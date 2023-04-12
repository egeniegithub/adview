import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';

@Injectable()
export class MetaAdsService {
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

  async ObtainMetaAdsData(email: string) {

    const compiled = [];
    // const allData = await this.fetchCustomerData(email);
    // const length = allData.length

    const ACCESS_TOKEN = "EABOI4bv6EtUBAE1XFkfhhZB5qDKZCZCYRwuoyiKTtZCEc1D00MgFYWsNGAPIZCo0enZCwhhVeFzCABOZBgi7spInZAULhrcxLV1HFbnd8ZBfbVfxOjhsLxuKyLqVFRJGMqHbLZAmZBQTtlcLcJOppjrg3GToprZBqyEIdfcRDpj5IGmXGtLita4dxhXV";
    const accoutn_id = 'Act_5498527660249813';

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
      let res = await axios.request({
        url: `https://graph.facebook.com/v16.0/${accoutn_id}/insights`,
        method: 'get',
        headers,
        params,
      })
      return { res: res.data }
    } catch (error) {
      return { err: error }
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