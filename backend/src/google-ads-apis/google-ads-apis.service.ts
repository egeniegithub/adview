import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGoogleAdsApiDto, ObtainAdsDataDto } from './dto/create-google-ads-api.dto';
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

  async ObtainAdsData({ email, accessToken, customer_ids, manager_id }: ObtainAdsDataDto) {

    let ids = customer_ids.split(',')
    let alldata = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      try {
        Logger.log("check in loop ", id)
        const developer_token = 'BSed2TGB27BPgmlMSYlCJw'
        const data = await this.getMonthlySpend(email, parseInt(id), developer_token, accessToken, manager_id);
        alldata.push({ ...data, id })
        // return ({ ...data })
      } catch (error) { return error; }
    }

    // sum amount for all accounts selected
    let total_amount = 0
    let connected_accounts = []
    alldata.forEach(el => {
      total_amount += parseInt(el.calculated.amount_spent)
      connected_accounts.push({ id: el.id, descriptiveName: el.calculated.descriptiveName, amount_spend: el.calculated.amount_spent })
    })
    // save data in db
    const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts) })
    return ({ data: alldata, updated, calculated: { amount_spent: total_amount } })
  }

  async getMonthlySpend(email, customer_id, developer_token, access_token, manager_id) {

    const options = {
      url: `https://googleads.googleapis.com/v13/customers/${customer_id}/googleAds:search`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'developer-token': developer_token,
        'login-customer-id': manager_id, //manager account id 
        'Authorization': `Bearer ${access_token}`,
      },
      data: {
        query: `
        SELECT
          segments.month,
          metrics.cost_micros,
          customer.descriptive_name
        FROM
          campaign
        WHERE
          segments.date DURING THIS_MONTH
      `
      }
    };
    try {
      let res = await axios(options)
      let total: number | any = { amount_spent: 0, descriptiveName: '' }
      let { results = [] } = res.data
      results.forEach(e => {
        total.amount_spent += parseInt(e.metrics.costMicros)
        total.descriptiveName = e.customer.descriptiveName
      });
      if (total.amount_spent > 0)
        total.amount_spent = (total.amount_spent / 1000000).toFixed(2);
      return ({ google_api_data: res.data, calculated: total, db_updated: "updated" })
    } catch (error) {
      Logger.log('error: ', error)
      return ({ err: error, updation_status: false })
    }
  }

  async hanldeUnlinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.google_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.google_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id)
          el.unlinked = true
        else
          total_amount += parseInt(el.amount_spend) 
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }

  }

  async hanldeRelinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.google_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.google_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id)
          delete el.unlinked
          total_amount += parseInt(el.amount_spend) 
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }

  }

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
