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

    const ACCESS_TOKEN = "AQXasd";
    const API_VERSION = '202302';

    let count = 100,
      sortField = 'ID',
      sortOrder = 'ASCENDING'
    let headers = {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'X-RestLi-Method': 'finder',
      'X-RestLi-Protocol-Version': '2.0.0',
      'Connection': 'Keep-Alive',
      'LinkedIn-Version': API_VERSION
    }
    let params = {
      q: 'search',
      'search.(campaignStatuses)': 'ACTIVE',
      'search.(searchType)': 'SEARCH',
      // search: `(reference:(values:List(${references.map(encodeURIComponent).join(',')})))`,
      count,
      sort: `(field:${sortField},order:${sortOrder})`
    }
    try {
      let res = await axios.request({
        url: 'https://api.linkedin.com/rest/adCampaigns',
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
