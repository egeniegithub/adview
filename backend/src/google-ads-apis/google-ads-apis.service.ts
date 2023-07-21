import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGoogleAdsApiDto, ObtainAdsDataDto } from './dto/create-google-ads-api.dto';
import { UpdateGoogleAdsApiDto } from './dto/update-google-ads-api.dto';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi, enums } from 'google-ads-api';
import axios from 'axios';

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
  async generateTokens(code:string){
    const oAuth2Client = new OAuth2Client(
      '828028257241-vhnmormtqapi8j744f086ee5shoc5380.apps.googleusercontent.com',
      `${process.env.GOOGLE_CLIENT_SECRET}`,
      'postmessage',
    );
    try {
      const { tokens } = await oAuth2Client.getToken(code); // exchange code for tokens
      return ({tokens :tokens})
    } catch (error) { 
      return ({error :error})
    }
  }


  async generateAccessToken(refresh_token: string) {
    if (!refresh_token) {
      return { message: 'Refresh Token should have a value to proceed.' };
    }
    const CLIENT_ID = '828028257241-vhnmormtqapi8j744f086ee5shoc5380.apps.googleusercontent.com';
    const CLIENT_SECRET = `${process.env.GOOGLE_CLIENT_SECRET}`
    const REDIRECT_URI = 'postmessage';
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

  async ObtainAdsData({ email, access_token, customer_ids, manager_id,refresh_token }: ObtainAdsDataDto) {

    let ids = customer_ids.split(',')
    let alldata = []
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      try {
        Logger.log("check in loop ", id)
        const developer_token = process.env.GOOGLE_DEV_TOKEN
        const data = await this.getMonthlySpend(email, parseInt(id), developer_token, access_token, manager_id);
        alldata.push({ ...data, id })
        // return ({ ...data })
      } catch (error) { return error; }
    }

    // sum amount for all accounts selected
    let total_amount = 0
    let connected_accounts = []
    alldata.forEach(el => {
      if(el.calculated)
        total_amount += parseInt(el.calculated.amount_spent)
      connected_accounts.push({ id: el.id, descriptiveName: el.calculated.descriptiveName, amount_spend: el.calculated.amount_spent,manager_id })
    })
    // save data in db
    const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts),  google_refresh_token : refresh_token, is_google_login : '1' })
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
      let total: any = { amount_spent: 0, descriptiveName: '' }
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

  async ObtainGoogleAdsDataWithCrone({ email, access_token, customers }: ObtainAdsDataDto) {
    let total_amount = 0
    let alldata=[]
    for (let i = 0; i < customers.length; i++) {
      const {id,manager_id} = customers[i];
      try {
        const developer_token = process.env.GOOGLE_DEV_TOKEN
        const data = await this.getMonthlySpend(email,parseInt(id),developer_token, access_token,manager_id);
        alldata.push({ ...data })
      } catch (error) { 
        await this.ClientDataService.updateByClient(email, {is_google_login : '0'})
        return error; 
      }
    }

    // sum amount for all accounts selected
    alldata.forEach(el => {
      if(el.calculated.amount_spent)
        total_amount += parseInt(el.calculated.amount_spent)
    })
      await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`,is_google_login : '1' })
    return ({ data: alldata,})

  }


  async handleUnlinkCustomer(id: string, email: string) {

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
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }

  }

  async handleRelinkCustomer(id: string, email: string) {

    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.google_client_linked_accounts)
        return ({ error: "user not found" })
      let connected_accounts = JSON.parse(user[0]?.google_client_linked_accounts)
      let total_amount = 0
      connected_accounts.forEach(el => {
        if (el.id == id) {
          total_amount += parseInt(el.amount_spend)
          delete el.unlinked
        }
        else
          if (!el.unlinked)
            total_amount += parseInt(el.amount_spend)
      })
      const updated = await this.ClientDataService.updateByClient(email, { 'google': `${total_amount}`, google_client_linked_accounts: JSON.stringify(connected_accounts) })

      return ({ success: updated })
    } catch (error) {
      return ({ error: "Something went wrong" })
    }

  }

  async handleGoogleLogout(email: string) {
    try {
      const user = await this.ClientDataService.findByEmail(email)
      if (!user[0]?.google_client_linked_accounts)
        return ({ error: "user not found" })
      const updated = await this.ClientDataService.updateByClient(email, { is_google_login: `0` })
      return ({ status: 'success' })
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
