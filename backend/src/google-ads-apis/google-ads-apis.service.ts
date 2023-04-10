import { Injectable } from '@nestjs/common';
import { CreateGoogleAdsApiDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi, enums } from 'google-ads-api';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
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
      const CLIENT_ID = "930170658277-1r3ucue1tdacr9jqf0ugoougutimk3kg.apps.googleusercontent.com";
      const CLIENT_SECRET = "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";

      const length = allData.length
      if (allData && length > 0) {
        for (let index = 0; index < length; index++) {
          const clientData = allData[index];
          const developer_token = clientData.g_token;
          if (developer_token) {
            const client = new GoogleAdsApi({
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              developer_token: developer_token,
            });

            const query = `
          SELECT
            segments.month,
            metrics.cost_micros
          FROM
            campaign
          WHERE
            segments.date DURING THIS_MONTH
        `;
            const monthlySpend = this.getMonthlySpend(client, query);

            if (monthlySpend) {
              compiled.push({
                ...clientData,
                total_spent: monthlySpend,
                updation_status: true,
              });
            } else {
              compiled.push({ ...clientData, updation_status: false });
            }
            return { compiled: compiled, message: "running" };
          } else {
            return { error: "develop_token is empty." }
          }
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getMonthlySpend(client: any, query: any) {
    const [response] = await client.service.googleAds.search(query);
    return (
      response.results.reduce(
        (total, row) => total + row.metrics.cost_micros,
        0,
      ) / 1000000
    );
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
