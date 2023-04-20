import { Injectable } from '@nestjs/common';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';
import axios from 'axios';


@Injectable()
export class LinkedinAdsService {
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

  async ObtainLinkedInAdsData(email: string) {

    const compiled = [];
    // const allData = await this.fetchCustomerData(email);
    // const length = allData.length

    const ACCESS_TOKEN = "AQVFPLMfl25kYkNudAV1fxNiIEIibJ2qu2ojDcv6LTlAwqrWr7WsI519ddJXP4KFyHBv12R35pr8J5MNlqBlr1VVLApbHftUA6nTDXfDEemZaN9Zs9xEUFDiNiJ48d2-As7rPygldZpRjvZLzHElzKUUdyhSvK6ZwkJ6KJoHmLWj49RWxNEzE24Rxa0PsBcWAj7PKP630hSjwBz5ekmYrxO6lqB75zuNJVJpeRvmWokpyfTh1Q-_2sA2u5zfDK9h7McLJm1eL_6O28JbedrXR_LTSHO2mKKvT0IbYjReraO24pfnA3CUFgiJ-5ud2UisKy8qCrVLDa6lqBrxlPHtrPS84hQ7s";

    const API_VERSION = '202302';
    let count = 100,
      sortField = 'ID',
      sortOrder = 'ASCENDING'
    const uri = `https://api.linkedin.com/rest/adCampaigns?q=search&search=(status:(values:List(ACTIVE)))&sort=(field:ID,order:DESCENDING)
    `;
    let headers = {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'X-RestLi-Method': 'finder',
      'X-RestLi-Protocol-Version': '2.0.0',
      'Connection': 'Keep-Alive',
      'LinkedIn-Version': API_VERSION
    }
    let params = {
      q: 'search',
      search: '(type:(values:List(SPONSORED_UPDATES)),status:(values:List(ACTIVE)))',
      count,
      sort: `(field:${sortField},order:${sortOrder})`
    }
    try {
      let res = await axios.request({
        url: uri,method: 'get',headers,
      })
      return { res: res }
    } catch (error) {
      return { err: error }
    }
  }
}
