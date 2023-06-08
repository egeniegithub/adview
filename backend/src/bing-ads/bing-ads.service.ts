import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CreateBingAdDto } from './dto/create-bing-ad.dto';
import { UpdateBingAdDto } from './dto/update-bing-ad.dto';
import { ClientDataService } from 'src/client-data/client-data.service';
import { parseString } from "xml2js";
const { DOMParser } = require('xmldom');

@Injectable()
export class BingAdsService {
  constructor(
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService,
  ) { }
  create(createBingAdDto: CreateBingAdDto) {
    return 'This action adds a new bingAd';
  }

  findAll() {
    return `This action returns all bingAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bingAd`;
  }

  update(id: number, updateBingAdDto: UpdateBingAdDto) {
    return `This action updates a #${id} bingAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} bingAd`;
  }

  async hanldeUnlinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.bing_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.bing_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id)
          el.unlinked = true
        else
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'bing': `${total_amount}`, bing_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }

  async hanldeRelinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.bing_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.bing_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id) {
          total_amount += parseInt(el.amount_spend)
          delete el.unlinked
        }
        else
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'bing': `${total_amount}`, bing_client_linked_accounts: JSON.stringify(connected_accounts) })
      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }



  async ObtainBingAdsData({ email, accessToken, customer_ids, customer_names }: any) {

    let ids = customer_ids.split(',')
    let cust_names = customer_names.split(',')
    let alldata = []
    let total_amount = 0
    let connected_accounts = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const name = cust_names[i]
      try {
        const data: any = await this.getMonthlySpend(parseInt(id), accessToken);
        alldata.push({ list: data, id })
        total_amount += parseFloat(data.calculated) || 0
        connected_accounts.push({ id: id, amount_spend: data.calculated || 0, descriptiveName: name })
      } catch (error) { return error; }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'bing': `${total_amount}`, bing_client_linked_accounts: JSON.stringify(connected_accounts) })
    return ({ data: alldata, updated, calculated: { amount_spent: total_amount } })
  }

  async getMonthlySpend(customer_id, access_token,) {
    let data = `
        <s:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header xmlns="https://bingads.microsoft.com/Billing/v13">
          <AuthenticationToken i:nil="false">${access_token}</AuthenticationToken>
          <DeveloperToken i:nil="false">107A59125Z900953</DeveloperToken>
        </s:Header>
        <s:Body>
          <GetAccountMonthlySpendRequest xmlns="https://bingads.microsoft.com/Billing/v13"> 
            <AccountId>${customer_id}</AccountId>
            <MonthYear>${getPreviousMonthDate()}</MonthYear>   
          </GetAccountMonthlySpendRequest>
        </s:Body>
        </s:Envelope>`;

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://clientcenter.api.bingads.microsoft.com/Api/Billing/v13/CustomerBillingService.svc',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'GetAccountMonthlySpend',
      },
      data: data
    };

    // return {data: json.GetAccountMonthlySpendResponse.Amount}

    try {
      let res = await axios.request(config)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res.data, 'text/xml');
      const resultElement = xmlDoc.getElementsByTagName('GetAccountMonthlySpendResponse')[0];
      const json: any = await func(resultElement)
      let total = json.GetAccountMonthlySpendResponse.Amount || 0
      let obj = {}
      obj['calculated'] = total
      return ({ ...obj })
    } catch (error) {
      return ({ err: error, updation_status: false })
    }
  }



  async GetMangerActInfo(access_token) {

    let data = `<?xml version="1.0" encoding="utf-8"?>\n<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n  <s:Header>\n    <h:ApplicationToken i:nil="true" xmlns:h="https://bingads.microsoft.com/Customer/v13" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" />\n    <h:AuthenticationToken xmlns:h="https://bingads.microsoft.com/Customer/v13">${access_token}</h:AuthenticationToken>\n    <h:DeveloperToken xmlns:h="https://bingads.microsoft.com/Customer/v13">107A59125Z900953</h:DeveloperToken>\n  </s:Header>\n  <s:Body>\n    <GetUserRequest xmlns="https://bingads.microsoft.com/Customer/v13">\n      <UserId i:nil="true" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" />\n    </GetUserRequest>\n  </s:Body>\n</s:Envelope>`;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://clientcenter.api.bingads.microsoft.com/Api/CustomerManagement/v13/CustomerManagementService.svc',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'GetUser',
      },
      data: data
    };
    let res = await axios.request(config)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res.data, 'text/xml');
    const resultElement = xmlDoc.getElementsByTagName('User')[0];
    const json: any = await func(resultElement)
    let linked_accounts = await this.getLinkedActs(json.User['a:CustomerId'], access_token)
    return ({ data: json, linked_accounts })
  }

  async getLinkedActs(id, access_token) {

    let data = `
    <s:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Header xmlns="https://bingads.microsoft.com/Customer/v13">
        <Action mustUnderstand="1">GetLinkedAccountsAndCustomersInfo</Action>
        <AuthenticationToken i:nil="false">${access_token}</AuthenticationToken>
        <DeveloperToken i:nil="false">107A59125Z900953</DeveloperToken>
      </s:Header>
      <s:Body>
        <GetLinkedAccountsAndCustomersInfoRequest xmlns="https://bingads.microsoft.com/Customer/v13">
          <CustomerId i:nil="false">${id}</CustomerId>
          <OnlyParentAccounts>false</OnlyParentAccounts>
        </GetLinkedAccountsAndCustomersInfoRequest>
      </s:Body>
    </s:Envelope>`;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://clientcenter.api.bingads.microsoft.com/Api/CustomerManagement/v13/CustomerManagementService.svc',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'GetLinkedAccountsAndCustomersInfo',
      },
      data: data
    };
    let res = await axios.request(config)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res.data, 'text/xml');
    const resultElement = xmlDoc.getElementsByTagName('AccountsInfo')[0];
    const json: any = await func(resultElement)
    return json
  }
}


const func = async (xml) => {
  return new Promise((resolve, reject) => {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getPreviousMonthDate() {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  var year = currentDate.getFullYear();
  var month:any = currentDate.getMonth() + 1;
  if(month < 10)
    month = "0"+month
  return   year + "-" + month;
}