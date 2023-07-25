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

  async ObtainMetaAdsData({ email, access_token, customer_ids,customer_names,refresh_token }: ObtainMetaAdsDataDto) {
    let ids = customer_ids.split(',')
    let cust_names = customer_names.split(',')
    let alldata = []
    let total_amount = 0
    let connected_accounts = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const name = cust_names[i]
      try {
        const data = await this.getMonthlySpend(id, access_token);
        alldata.push({ ...data, id })
        total_amount += data.data.length ? (parseInt(data.data[0].spend)) : 0
        connected_accounts.push({ id: id, amount_spend: data.data.length ? (data.data[0].spend) : 0, descriptiveName: name })

      } catch (error) { return error; }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, facebook_client_linked_accounts: JSON.stringify(connected_accounts), meta_refresh_token : refresh_token, is_meta_login : '1'})
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
        url: `https://graph.facebook.com/v16.0/${customer_id}/insights?date_preset=this_month&access_token=${access_token}`,
        headers: headers
      };
      let config2 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v16.0/${customer_id}?fields=name&access_token=${access_token}`,
        headers: headers
      };
      let res = await axios.request(config)
      return ({ ...res.data })

    } catch (error) {
      return { err: error, updation_status: false }
    }
  }

  async ObtainMetaAdsDataWithCrone({ email, refresh_token, customers }: ObtainMetaAdsDataDto) {
    let total_amount = 0
    for (let i = 0; i < customers.length; i++) {
      const {id} = customers[i];
      try {
        const data = await this.getMonthlySpend(id, refresh_token);
        total_amount += data.data.length ? (parseInt(data.data[0].spend)) : 0
      } catch (error) { 
        await this.ClientDataService.updateByClient(email, {is_meta_login : '0'})
        return error; 
      }
    }
    const updated = await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, is_meta_login : '1'})
    return ({ updated, calculated: { amount_spent: total_amount } })

  }

  async handleUnlinkCustomer(id: string, email: string) {

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

      return ({ status: "success" })
    } catch (error) {
      return ({ status: "Something went wrong" })
    }

  }

  async handleRelinkCustomer(id: string, email: string) {

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
      await this.ClientDataService.updateByClient(email, { 'facebook': `${total_amount}`, facebook_client_linked_accounts: JSON.stringify(connected_accounts) })
      return ({ status: 'success' })
    } catch (error) {
      return ({ status: "Something went wrong" })
    }
  }

  async handleMetaLogout(email: string) {
    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.facebook_client_linked_accounts)
        return ({ error: "user not found" })
      await this.ClientDataService.updateByClient(email, { is_meta_login: `0` })
      return ({ status: 'success' })
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