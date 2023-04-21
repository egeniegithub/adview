import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGoogleAdsApiDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import axios from 'axios';
const { OAuth2 } = google.auth;
import { ClientDataService } from '../client-data/client-data.service'

@Injectable()
export class GoogleAdsApisService {

  constructor(
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService,
  ) { }

  // async fetchAllCustomersData() {
  //   const data = await this.exportedDataRepository.find();
  //   return data;
  // }
  // async fetchCustomerData(email: string) {
  //   const data = await this.exportedDataRepository.find({ where: { email: email } });
  //   return data;
  // }

  async generateAccessToken(refresh_token: string) {
    if (!refresh_token) {
      return { message: 'Refresh Token should have a value to proceed.' };
    }
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT;
    const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_SECRET;
    const REDIRECT_URI = 'http://localhost';
    const oAuth2Client = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );

    try {
      // Set the refresh token on the OAuth2 client:
      oAuth2Client.setCredentials({ refresh_token: refresh_token });

      // Generate a new access token using the OAuth2 client:
      const { token } = await oAuth2Client.getAccessToken();

      // Return the new access token to the caller:
      return token;
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  async ObtainAdsData(email: string, access_token: string) {
    try {
      const compiled = [];
      const allData = []
      const developer_token = 'NTipfGy1nGO2oAFRaSdFiw'
      let customer_id = '3007970972' //ad acount id

      const length = allData.length
      const data = await this.getMonthlySpend(email, customer_id, developer_token, access_token);
      return ({ ...data })
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getMonthlySpend(email, customer_id, developer_token, access_token) {

    const options = {
      url: `https://googleads.googleapis.com/v13/customers/${customer_id}/googleAds:search`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'developer-token': developer_token,
        'login-customer-id': '2549371484', //manager account id 
        'Authorization': `Bearer ${access_token}`,
      },
      data: {
        query: `
        SELECT
          segments.month,
          metrics.cost_micros
        FROM
          campaign
        WHERE
          segments.date DURING THIS_MONTH
      `
      }
    };
    try {
      let res = await axios(options)
      let total = { amount_spent: 0 }
      let { results = [] } = res.data
      results.forEach(e => {
        total.amount_spent += parseInt(e.metrics.cost_micros)
      });
      // save data in db
      const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total.amount_spent}` })
      return ({ google_api_data: res.data, calculated: total, db_updated: updated })
    } catch (error) {
      Logger.log('error: ', error)
      return ({ err: error, updation_status: false })
    }
  }


  // findAll() {
  //   return `This action returns all googleAdsApis`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} googleAdsApi`;
  }


  update(id: number, UpdateGoogleAdsApiDto: UpdateGoogleAdsApiDto) {
    return `This action updates a #${id} bingAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} googleAdsApi`;
  }
}
