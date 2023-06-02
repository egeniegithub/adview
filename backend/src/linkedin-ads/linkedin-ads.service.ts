import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';
import { Repository } from 'typeorm';
import { ClientDataService } from 'src/client-data/client-data.service';
import { ObtainLinkedinAdsDataDto } from './linkedin-ads.controller';


@Injectable()
export class LinkedinAdsService {
  constructor(
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService,
  ) { }
  create(createLinkedinAdDto: CreateLinkedinAdDto) {
    return 'This action adds a new linkedinAd';
  }

  findAll() {
    return `This action returns all linkedinAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkedinAd`;
  }

  update(id: number, updateLinkedinAdDto: UpdateLinkedinAdDto) {
    return `This action updates a #${id} linkedinAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkedinAd`;
  }

  async getLinkedActs(access_token:string) {

    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.linkedin.com/rest/adAccounts?q=search',
        headers: {
          'LinkedIn-Version': '202302',
          'X-Restli-Protocol-Version': '2.0.0',
          'X-RestLi-Method': 'finder',
          'Authorization': `Bearer ${access_token}`
        }
      };

      let res = await axios.request(config)
      return { list: res.data.elements }

    } catch (error) {
      return { error: error }
    }
  }
  
  async ObtainLinkedInAdsData({ email, accessToken, customer_ids,customer_names }: any) {

    let ids = customer_ids.split(',')
    let cust_names = customer_names.split(',')
    let alldata = []
    let total_amount = 0
    let connected_accounts = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const name = cust_names[i]
      try {
        let last_month_date = getPreviousMonthDate()
        const data:any = await this.getMonthlySpend(parseInt(id) , accessToken,last_month_date);
        alldata.push({ list:data, id })
        total_amount += parseFloat(data.calculated) 
        connected_accounts.push({ id: id, amount_spend: data.calculated, descriptiveName: name })
      } catch (error) { return error; }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'linkedin': `${total_amount}`, linkedin_client_linked_accounts: JSON.stringify(connected_accounts) })
    return ({ data: alldata, updated, calculated: { amount_spent: total_amount } })
  }

  async getMonthlySpend(customer_id, access_token,last_month_date) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.linkedin.com/rest/adAnalytics?q=analytics&dateRange=(start:(${last_month_date}),end:(year:2023,month:6,day:2))&timeGranularity=MONTHLY&accounts=List(urn%3Ali%3AsponsoredAccount%3A${customer_id})&projection=(*,elements*(externalWebsiteConversions,dateRange(*),impressions,landingPageClicks,likes,shares,costInLocalCurrency,approximateUniqueImpressions,pivotValues*~(localizedName)))&fields=externalWebsiteConversions,costInLocalCurrency`,
        headers: {
          'LinkedIn-Version': '202302',
          'X-Restli-Protocol-Version': '2.0.0',
          'X-RestLi-Method': 'finder',
          'Authorization': `Bearer ${access_token}`
        }
      };
      let total = 0
      let res = await axios.request(config)
      let obj = {}
      res.data?.elements.forEach(e => {
        total += parseFloat(e.costInLocalCurrency)
      });
      obj['calculated'] = total
      return ({ ...obj })
    } catch (error) {
      return ({ err: error, updation_status: false })
    }
  }


  async hanldeUnlinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.linkedin_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.linkedin_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id)
          el.unlinked = true
        else
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'linkedin': `${total_amount}`, linkedin_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }

  async hanldeRelinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.linkedin_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.linkedin_client_linked_accounts)
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
      const updated = await this.ClientDataService.updateByClient(email, { 'linkedin': `${total_amount}`, linkedin_client_linked_accounts: JSON.stringify(connected_accounts) })
      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }

}


function getPreviousMonthDate() {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  var day = currentDate.getDate();
  
  return "year:" + year + ",month:" + month + ",day:" + day;
}