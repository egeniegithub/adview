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

  async ExchnageRefreshToAccess(refresh_token) {
    let client_id = '78zrt5co4u4vmi'
    let client_secret = process.env.LINKEDIN_CLIENT_SECRET
    const params = {
      refresh_token: refresh_token,
      grant_type: 'refresh_token',
      client_id,
      client_secret,
    };
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    try {
      let res = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', new URLSearchParams(params))
      return ({ data: res.data })
    } catch (error) {
      return { error }
    }
  }


  async getLinkedActs(access_token: string) {

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

  // obtains ads data
  async ObtainLinkedInAdsData({ email, access_token, refresh_token, customer_ids, customer_names }: any) {

    let ids = customer_ids.split(',')
    let cust_names = customer_names.split(',')
    let alldata = []
    let total_amount = 0
    let connected_accounts = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const name = cust_names[i]
      try {
        let first_date = getCurrentMonthFirstDate()
        const data: any = await this.getMonthlySpend(parseInt(id), access_token, first_date);
        alldata.push({ list: data, id })
        total_amount += parseFloat(data.calculated)
        connected_accounts.push({ id: id, amount_spend: data.calculated, descriptiveName: name })
      } catch (error) { return error; }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'linkedin': `${total_amount}`, linkedin_client_linked_accounts: JSON.stringify(connected_accounts), linkedin_refresh_token: refresh_token, is_linkedin_login: '1' })
    return ({ data: alldata, updated, calculated: { amount_spent: total_amount } })
  }

  async getMonthlySpend(customer_id, access_token, first_date) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.linkedin.com/rest/adAnalytics?q=analytics&dateRange=(start:(${first_date}))&timeGranularity=MONTHLY&accounts=List(urn%3Ali%3AsponsoredAccount%3A${customer_id})&projection=(*,elements*(externalWebsiteConversions,dateRange(*),impressions,landingPageClicks,likes,shares,costInLocalCurrency,approximateUniqueImpressions,pivotValues*~(localizedName)))&fields=externalWebsiteConversions,costInLocalCurrency`,
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

  // called by daily cron job
  async ObtainLinkedinAdsDataWithCrone({ email, refresh_token, customers }: any) {
    let total_amount = 0
    let first_date = getCurrentMonthFirstDate()
    for (let i = 0; i < customers.length; i++) {
      const { id } = customers[i];
      try {
        const data: any = await this.getMonthlySpend(parseInt(id), refresh_token, first_date);
        if (data.calculated)
          total_amount += parseFloat(data.calculated)
      } catch (error) {
        await this.ClientDataService.updateByClient(email, { is_linkedin_login: '0' })
        return error;
      }
    }
    await this.ClientDataService.updateByClient(email, { 'linkedin': `${total_amount}`, is_linkedin_login: '1' })
    return ({ data: total_amount })
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

  // logout linked from row
  async hanldeLinkedinLogout(email: string) {
    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.linkedin_client_linked_accounts)
        return ({ error: "user not found" })
      const updated = await this.ClientDataService.updateByClient(email, { is_linkedin_login: `0` })
      return ({ status: 'success' })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }


}

function getCurrentMonthFirstDate() {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth());

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  var day = currentDate.getDate();

  return "year:" + year + ",month:" + month + ",day:" + 1;
}
