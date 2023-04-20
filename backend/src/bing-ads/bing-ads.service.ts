import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CreateBingAdDto } from './dto/create-bing-ad.dto';
import { UpdateBingAdDto } from './dto/update-bing-ad.dto';

@Injectable()
export class BingAdsService {
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

  async ObtainBingAdsData(email: string, token: string) {

    const compiled = [];
    // const allData = await this.fetchCustomerData(email);
    // const length = allData.length

    const ACCESS_TOKEN = token;
    const customer_id = 'Act_5498527660249813';
    const developer_token = 'NTipfGy1nGO2oAFRaSdFiw'

    const url = 'https://campaign.api.bingads.microsoft.com/v13/campaigns';
    const params = {
      'CustomerAccountId': '{your_customer_account_id}',
      'Top': 10,
      'Skip': 0,
      'OrderBy': 'Name ASC',
      'CampaignType': 'SearchAndContent',
      'ReturnAdditionalFields': 'CampaignType,BudgetType,TrackingUrlTemplate,Spend'
    };

    // Set the authentication headers
    const headers = {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Customer-Id': `${customer_id}`,
      'Developer-Token': `${developer_token}`,
      'Content-Type': 'application/json',
      'MS-API-Version': '13'
    };
    try {
      let total = { amount_spent: 0 }
      let response = await axios.get(url, {
        headers: headers,
        params: params
      })
      return ({ bing_api_data: response.data, calculated: total, db_updated: "updated" })
    } catch (error) {
      Logger.log(error);
      return ({ err: error, updation_status: false })
    }

  }
}
