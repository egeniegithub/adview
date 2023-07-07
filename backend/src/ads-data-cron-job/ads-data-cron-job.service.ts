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
    private readonly GoogleAdsApisService: GoogleAdsApisService,

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
    let google_Linked_users: any = []
    let usersList = await this.ClientDataService.findAllWithQuery({ where: [{ is_meta_login: '1' }, { is_bing_login: '1' }, { is_linkedin_login: '1' }, { is_google_login: '1' }] })
    usersList.forEach(e => {
      let { meta_refresh_token = '', bing_refresh_token, google_refresh_token, linkedin_refresh_token, facebook_client_linked_accounts = '', linkedin_client_linked_accounts = '', bing_client_linked_accounts = '', google_client_linked_accounts,
        email, is_linkedin_login, is_bing_login, is_meta_login, is_google_login
      } = e
      // get linkedin user object
      if (facebook_client_linked_accounts.length && meta_refresh_token && is_meta_login == '1') {
        let meta_clients = JSON.parse(facebook_client_linked_accounts)
        let meta_Data: any = {}
        meta_Data.customers = meta_clients.filter(e => !e.unlinked)
        meta_Data.email = email
        meta_Data.refresh_token = meta_refresh_token
        meta_Linked_users.push(meta_Data)
      }

      // get linkedin user object
      if (linkedin_client_linked_accounts.length && linkedin_refresh_token && is_linkedin_login == '1') {
        let clients = JSON.parse(linkedin_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = linkedin_refresh_token
        linkedin_Linked_users.push(data)
      }

      //get Bing user object 
      if (bing_client_linked_accounts.length && bing_refresh_token && is_bing_login == '1') {
        let clients = JSON.parse(bing_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = bing_refresh_token
        bing_Linked_users.push(data)
      }
      //get google user object 
      if (google_client_linked_accounts.length && google_refresh_token && is_google_login == '1') {
        let clients = JSON.parse(google_client_linked_accounts)
        let data: any = {}
        data.customers = clients.filter(e => !e.unlinked)
        data.email = email
        data.refresh_token = google_refresh_token
        google_Linked_users.push(data)
      }

    })
    // meta users ads computation
    meta_Linked_users.forEach(async (e) => {
      await this.MetaAdsService.ObtainMetaAdsDataWithCrone(e)
    })

    for (let i = 0; i < linkedin_Linked_users.length; i++) {
      let tokens = await this.LinkedinAdsService.ExchnageRefreshToAccess(linkedin_Linked_users[i].refresh_token)
      if (tokens.data?.access_token)
        await this.LinkedinAdsService.ObtainLinkedinAdsDataWithCrone({ ...linkedin_Linked_users[i], access_token: tokens.data.access_token })
    }


    // bing users ads computation
    for (let i = 0; i < bing_Linked_users.length; i++) {
      let tokens =await this.CovertBingRefreshToken(bing_Linked_users[i].refresh_token)
      if(tokens.access_token)
      {
        await this.BingAdsService.ObtainBingAdsDataWithCrone({...bing_Linked_users[i],access_token:tokens.access_token,refresh_token:tokens.refresh_token})
      } 
      // logout row if failed to get refresh token 
      // else{
      //   let {email} = bing_Linked_users[i]
      //   await this.ClientDataService.updateByClient(email,{is_bing_login: '0'})
      // }
    }

    // google users ads computation
    for (let i = 0; i < google_Linked_users.length; i++) {
      let token = google_Linked_users[i].refresh_token
      let access_token = await this.GoogleExchangeRefreshToken(token)
      if(access_token.token)
        await this.GoogleAdsApisService.ObtainGoogleAdsDataWithCrone({...google_Linked_users[i],access_token: access_token.token})
      // else {
      //   // logout google is response failed
      //   let {email} = google_Linked_users[i]
      //   await this.ClientDataService.updateByClient(email,{is_google_login: '0'})
      // }
    }
    // return ({ data: dd })

  }


  async GoogleExchangeRefreshToken(refresh_token) {
    try {
      let token = await this.GoogleAdsApisService.generateAccessToken(refresh_token)
      return ({ token })
    } catch (error) {
      return ({ error })
    }

  }

  async CovertBingRefreshToken(refresh_token) {
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
    const clientId = 'b2d7eb5f-e889-4f34-a297-7221ce6c26e7';
    // const clientSecret = '4-C8Q~zaIKCrqrnAS3YHNyUZAmIlygfnCCWWscJ5';
    const params = {
      scope: 'https://ads.microsoft.com/msads.manage',
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    };

    const originUrl = 'https://adview.io'
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Origin': `${originUrl}`
    });

    try {
      let res = await fetch(`${url}`, {
        method: 'POST',
        headers,
        body: new URLSearchParams(params),
      })
      let data = await res.json()
      return ({ access_token: data.access_token, refresh_token: data.refresh_token })

    } catch (error) {
      return ({ error: error })
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
