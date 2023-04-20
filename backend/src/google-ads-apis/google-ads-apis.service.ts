import { Injectable, Logger } from '@nestjs/common';
import { CreateGoogleAdsApiDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import axios from 'axios';
const { OAuth2 } = google.auth;

@Injectable()
export class GoogleAdsApisService {
  constructor(
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

  async ObtainAdsData(email: string) {
    try {
      const compiled = [];
      const allData = []
      const developer_token='NTipfGy1nGO2oAFRaSdFiw'
      let customer_id ='1840315132' //muzamil acount id

      const length = allData.length
      if (allData && length > 0) {
        for (let index = 0; index < length; index++) {    
          // if (developer_token) {
            
            const query = `
          SELECT
            segments.month,
            metrics.cost_micros
          FROM
            campaign
          WHERE
            segments.date DURING THIS_MONTH
        `;
            const monthlySpend =await this.getMonthlySpend(query,customer_id,developer_token);
            return {data: monthlySpend}
            // if (monthlySpend) {
            //   compiled.push({
            //     ...clientData,
            //     total_spent: monthlySpend,
            //     updation_status: true,
            //   });
            // } else {
            //   compiled.push({ ...clientData, updation_status: false });
            // }
            return { compiled: compiled, message: "running" };
          // } else {
          //   return { error: "develop_token is empty." }
          // }
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getMonthlySpend(query: any,customer_id,developer_token) {

    const options = { 
      url: `https://googleads.googleapis.com/v13/customers/${customer_id}/googleAds:search`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'developer-token': developer_token,
        'Authorization': `Bearer ${"ya29.a0Ael9sCMStHrd4_1jaFuCgHFLfPwkpunNiBi3_zWQr9r9cXIgjBYu_5lCKQUtegjP0qhodFyqpDAvTfHgUttY41CLYbxlz5j32C2OM_p8cdDhnkH5kDItpkC8M1lSkL4JF-PMMpzgzMuMcuO9plZe5qxUIAkDaCgYKAU0SARISFQF4udJhfGTAcsfgj0m11frsQ99vog0163"}`,
      },
      data: {
        query : `
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
      return res
    } catch (error) {
      Logger.log('error: ', error)
      return error
    }
    

  // const campaigns = await customer.query(query);
  // return campaigns

    // const [response] = await client.service.googleAds.search(query);
    // console.log("check google spend res", response)
    // return (
    //   response.results.reduce(
    //     (total, row) => total + row.metrics.cost_micros,
    //     0,
    //   ) / 1000000
    // );
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
