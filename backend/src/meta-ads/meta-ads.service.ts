import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';
import { ClientDataService } from 'src/client-data/client-data.service';

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

  async ObtainMetaAdsData(email: string,token) {

    const ACCESS_TOKEN = token;
    let headers = {
      'Accept': '*/*',
      'Connection': 'Keep-Alive',
      'Host': 'graph.facebook.com'
    }
    let since = formatDate(new Date())
    let until = formatDate(new Date())
    let params = {
      level: 'campaign',
      time_range: `{"since":"2022-01-01","until":"2022-01-31"}`,
      fields: 'spend,impressions,clicks',
      access_token: ACCESS_TOKEN
    }
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v16.0/Me/adaccounts?fields=campaigns{daily_budget,lifetime_budget,ads},insights{spend,clicks,campaign_id,website_purchase_roas,date_presets=last_30d},amount_spent&access_token=${ACCESS_TOKEN}`,
        headers: headers
      };

      let res = await axios.request(config)
      let total = { daily_budget: 0, amount_spent: 0, lifetime_budget: 0 }
      let { data } = res.data
      data.forEach(e => {
        total.daily_budget += e.daily_budget
        total.amount_spent += e.amount_spent
        total.lifetime_budget += e.lifetime_budget
      });
      // save data in db
      const updated = await this.ClientDataService.updateByClient(email , { 'facebook': `${total.amount_spent}`})
      return ({ meta_api_data: res.data, calculated: total, db_updated: updated })

    } catch (error) {
      return { err: error,updation_status:false }
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