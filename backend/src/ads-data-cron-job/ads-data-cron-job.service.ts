import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAdsDataCronJobDto } from './dto/create-ads-data-cron-job.dto';
import { UpdateAdsDataCronJobDto } from './dto/update-ads-data-cron-job.dto';
import { MetaAdsService } from 'src/meta-ads/meta-ads.service';
import { Cron } from '@nestjs/schedule';
import { ClientDataService } from 'src/client-data/client-data.service';
import { LinkedinAdsService } from 'src/linkedin-ads/linkedin-ads.service';
import { BingAdsService } from 'src/bing-ads/bing-ads.service';
import axios from 'axios';
import { GoogleAdsApisService } from 'src/google-ads-apis/google-ads-apis.service';
// const { PublicClientApplication, TokenCachePersistenceOptions } = require('@azure/msal-node');

@Injectable()
export class AdsDataCronJobService {
  constructor(
    @Inject(MetaAdsService)
    private readonly MetaAdsService: MetaAdsService,
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService,
    @Inject(LinkedinAdsService)
    private readonly LinkedinAdsService: LinkedinAdsService,
    @Inject(BingAdsService)
    private readonly BingAdsService: BingAdsService,
    @Inject(GoogleAdsApisService)
    private readonly GoogleAdsApisService: GoogleAdsApisService
  ) { }


  //crone job will run 1st day of every month at 9:00AM EST time
  @Cron('0 8 * * *', {
    name: 'Daily Update',
    timeZone: 'EST',
  })
  async ClientadsUpdateCroneJob() {
    let meta_Linked_users: any = []
    let linkedin_Linked_users: any = []
    let bing_Linked_users: any = []
    let google_Linked_users:any =[]
    let usersList = await this.ClientDataService.findAllWithQuery({ where: [{ is_meta_login: '1' }, { is_bing_login: '1' }, { is_linkedin_login: '1' }, { is_google_login: '1' }] })
    usersList.forEach(e => {
      let { meta_refresh_token = '', bing_refresh_token, google_refresh_token,linkedin_refresh_token, facebook_client_linked_accounts = '', linkedin_client_linked_accounts = '', bing_client_linked_accounts = '',google_client_linked_accounts,
        email
      } = e
      // get linkedin user object
      if (facebook_client_linked_accounts.length && meta_refresh_token) {
        let meta_clients = JSON.parse(facebook_client_linked_accounts)
        let meta_Data: any = {}
        meta_Data.customers = meta_clients.filter(e => !e.unlinked)
        meta_Data.email = email
        meta_Data.refresh_token = meta_refresh_token
        meta_Linked_users.push(meta_Data)
      }

      // get linkedin user object
      if (linkedin_client_linked_accounts.length && linkedin_refresh_token) {
        let clients = JSON.parse(linkedin_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = linkedin_refresh_token
        linkedin_Linked_users.push(data)
      }

      //get Bing user object 
      if (bing_client_linked_accounts.length && bing_refresh_token) {
        let clients = JSON.parse(bing_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = bing_refresh_token
        bing_Linked_users.push(data)
      }
      //get google user object 
      if (google_client_linked_accounts.length && google_refresh_token) {
        let clients = JSON.parse(google_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = google_refresh_token
        google_Linked_users.push(data)
      }

    })
    meta_Linked_users.forEach(async (e) => {
      await this.MetaAdsService.ObtainMetaAdsDataWithCrone(e)
    })

    let dd = []
    // for (let i = 0; i < linkedin_Linked_users.length; i++) {
    //   dd = await this.LinkedinAdsService.ObtainLinkedinAdsDataWithCrone(linkedin_Linked_users[i])
    // }



    for (let i = 0; i < bing_Linked_users.length; i++) {
      // dd = await this.BingAdsService.ObtainBingAdsDataWithCrone(linkedin_Linked_users[i])
    }

    for (let i = 0; i < google_Linked_users.length; i++) {
      let token = google_Linked_users[i].refresh_token
      let access_token = await this.GoogleExchangeRefreshToken(token)
      await this.GoogleAdsApisService.ObtainGoogleAdsDataWithCrone({...google_Linked_users[i],access_token: access_token.token})
    }


    // let refresh_token =await this.CovertBingRefreshToken(bing_Linked_users[0].refresh_token)
    // let d = await this.CovertBingRefreshToken(bing_Linked_users[0].refresh_token)
    // return ({ dd:dd })
  }



  // async  BingExchangeRefreshToken(refreshToken) {
    // const msalConfig = {
    //   auth: {
    //     clientId: 'b2d7eb5f-e889-4f34-a297-7221ce6c26e7',
    //     authority: 'https://login.microsoftonline.com/0bed3f84-9143-4f82-9513-d2a74f5ca754', // Replace {tenant} with your Azure AD tenant ID or name
    //   }
    // };
    
    // const pca = new PublicClientApplication(msalConfig);
    
  //   try {
  //     const tokenRequest = {
  //       scopes: ['https://ads.microsoft.com/msads.manage'],
  //       refreshToken: 'M.C106_BL2.-CT41e58xIJO7T8rKHI!0HNJu7T*F7iN8eh9JjAYsrCrnD0A2zyL0GE12rPe3UTTsYCbkAbBJ7VFoWGA0kHrWzBw0Aa00ODxcHoIgsPnWOPPbjTTWTfL1kiL60kJ8c1icYC0gZornabTNvMJROIrXhvGg834c*fcTQsMWk0KZsM*Crghvck862!y4hgGbxCrx1scJ7gE8kCzUo0jau6M6pYaBTbfcw5S9UWHkgk5nXnlAlXZuGSrqvDWqM2nXrALs5CibeWPt8gZsClhIfOClKeKbzTkU9yUO33QZcR7MOXyNQLaJMznwf8oImqWucLpM!Kk1HkHnsbLHRifv0lNHG5IJ9uKLWfyFilKG!2GMXXM8*Q9nc4hV6TDFTjG!jNcfjQ$$',
  //     };

  //     const response = await pca.acquireTokenByRefreshToken(tokenRequest);
  
  //     // Use the response.accessToken as your new access token
  //     const accessToken = response.accessToken;
  //     return ({accessToken});
  //   } catch (error) {
  //     return ({error});

  //     console.log('Error exchanging refresh token:', error);
  //     // Handle the error appropriately
  //   }
  // }

  async GoogleExchangeRefreshToken(refresh_token){
    let token = await this.GoogleAdsApisService.generateAccessToken(refresh_token)
    return ({token})
  }

  async CovertBingRefreshToken(refresh_token) {
    const url = `https://login.microsoftonline.com/0bed3f84-9143-4f82-9513-d2a74f5ca754/oauth2/v2.0/token`;
    const clientId = 'b2d7eb5f-e889-4f34-a297-7221ce6c26e7';
    const clientSecret = '4-C8Q~zaIKCrqrnAS3YHNyUZAmIlygfnCCWWscJ5';
    // secret_value = '4-C8Q~zaIKCrqrnAS3YHNyUZAmIlygfnCCWWscJ5'
    // sceretId= 'c942f74b-ea00-43a4-8a95-bb7476d5dd59'
    const params = {
      scope:'https://ads.microsoft.com/msads.manage',
      client_id :clientId,
      grant_type: 'refresh_token',
      refresh_token:'M.C106_BL2.-CT41e58xIJO7T8rKHI!0HNJu7T*F7iN8eh9JjAYsrCrnD0A2zyL0GE12rPe3UTTsYCbkAbBJ7VFoWGA0kHrWzBw0Aa00ODxcHoIgsPnWOPPbjTTWTfL1kiL60kJ8c1icYC0gZornabTNvMJROIrXhvGg834c*fcTQsMWk0KZsM*Crghvck862!y4hgGbxCrx1scJ7gE8kCzUo0jau6M6pYaBTbfcw5S9UWHkgk5nXnlAlXZuGSrqvDWqM2nXrALs5CibeWPt8gZsClhIfOClKeKbzTkU9yUO33QZcR7MOXyNQLaJMznwf8oImqWucLpM!Kk1HkHnsbLHRifv0lNHG5IJ9uKLWfyFilKG!2GMXXM8*Q9nc4hV6TDFTjG!jNcfjQ$$',
      // client_secret:clientSecret
    };
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Origin': 'http://localhost'
    });

    try {
      let res = await fetch(`${url}`, {
        method: 'POST',
        headers,
        body: new URLSearchParams(params),
      })
      let a =await res.json()
      return ({data:a})
    } catch (error) {
      return ({error :error})
    }
    
  }



  create(createAdsDataCronJobDto: CreateAdsDataCronJobDto) {
    return 'This action adds a new adsDataCronJob';
  }

  findAll() {
    return `This action returns all adsDataCronJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adsDataCronJob`;
  }

  update(id: number, updateAdsDataCronJobDto: UpdateAdsDataCronJobDto) {
    return `This action updates a #${id} adsDataCronJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} adsDataCronJob`;
  }
}
