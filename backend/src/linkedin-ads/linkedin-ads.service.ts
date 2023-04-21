import { Inject, Injectable } from '@nestjs/common';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDatum } from 'src/client-data/entities/client-datum.entity';
import { Repository } from 'typeorm';
import { ClientDataService } from 'src/client-data/client-data.service';


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

  async ObtainLinkedInAdsData(email: string, token: string) {

    const compiled = [];
    // const allData = await this.fetchCustomerData(email);
    // const length = allData.length

    const ACCESS_TOKEN = token
    const API_VERSION = '202302';
    let count = 100,
      sortField = 'ID',
      sortOrder = 'ASCENDING'
    const uri = `https://api.linkedin.com/rest/adCampaigns?q=search&search=(status:(values:List(ACTIVE)))&costType=MONTHLY&sort=(field:ID,order:DESCENDING)
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
      let total = { amount_spent: 0 }
      let res = await axios.request({
        url: uri, method: 'get', headers,
      })
      let { elements = [] } = res.data
      for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        let { campaign = {} } = e
        total.amount_spent += campaign?.budget?.total?.amount?.value || 0
      }
      const updated = await this.ClientDataService.updateByClient(email, { 'linkedin': `${total.amount_spent}` })
      return ({ linkedIn_api_data: res.data, calculated: total, db_updated: updated })
    } catch (error) {
      return ({ err: error, updation_status: false })
    }
  }
}
