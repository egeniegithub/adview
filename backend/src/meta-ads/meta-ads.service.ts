import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';
import { ClientDataService } from 'src/client-data/client-data.service';
import { ObtainMetaAdsDataDto } from './meta-ads.controller';

@Injectable()
export class MetaAdsService {
  constructor(
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService,
  ) { }
  create(createMetaAdDto: CreateMetaAdDto) {
    return 'This action adds a new metaAd';
  }

  findAll() {
    return `This action returns all metaAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaAd`;
  }

  update(id: number, updateMetaAdDto: UpdateMetaAdDto) {
    return `This action updates a #${id} metaAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaAd`;
  }

  async ObtainMetaAdsData({ email, accessToken, customer_ids }: ObtainMetaAdsDataDto) {
    let ids = customer_ids.split(',')
    let alldata = []
    let total_amount = 0
    let connected_accounts = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      try {
        const data = await this.getMonthlySpend(id, accessToken);
        alldata.push({ ...data, id })
        total_amount += data.insights ? (parseInt(data.insights.data[0].spend)) / 100 : 0
        connected_accounts.push({ id: data.id, amount_spend: data.insights ? (data.insights.data[0].spend) / 100 : 0, descriptiveName: data.name })

      } catch (error) { return error; }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, facebook_client_linked_accounts: JSON.stringify(connected_accounts) })
    return ({ data: alldata, updated, calculated: { amount_spent: total_amount } })

  }

  async getMonthlySpend(customer_id, access_token) {

    let headers = {
      'Accept': '*/*',
      'Connection': 'Keep-Alive',
      'Host': 'graph.facebook.com'
    }
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v16.0/${customer_id}?fields=name,insights&access_token=${access_token}`,
        headers: headers
      };
      let config2 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v16.0/${customer_id}?fields=name&access_token=${access_token}`,
        headers: headers
      };
      let res = await axios.request(config)
      // res2 is to get account name cuz insights will not return account name if data is null

      return ({ ...res.data })
      // let total = { daily_budget: 0, amount_spent: 0, lifetime_budget: 0 }
      // let { data } = res.data
      // data.forEach(e => {
      //   total.daily_budget += e.daily_budget
      //   total.amount_spent += e.amount_spent
      //   total.lifetime_budget += e.lifetime_budget
      // });
      // // save data in db
      // const updated = await this.ClientDataService.updateByClient(email , { 'facebook': `${total.amount_spent}`})
      // return ({ meta_api_data: res.data, calculated: total, db_updated: updated })

    } catch (error) {
      return { err: error, updation_status: false }
    }
  }

  async hanldeUnlinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.facebook_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.facebook_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id)
          el.unlinked = true
        else
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, facebook_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }

  }

  async hanldeRelinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.facebook_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.facebook_client_linked_accounts)
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
      const updated = await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, facebook_client_linked_accounts: JSON.stringify(connected_accounts) })
      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }
  }

}


function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}