import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAdsDataCronJobDto } from './dto/create-ads-data-cron-job.dto';
import { UpdateAdsDataCronJobDto } from './dto/update-ads-data-cron-job.dto';
import { MetaAdsService } from 'src/meta-ads/meta-ads.service';
import { Cron } from '@nestjs/schedule';
import { ClientDataService } from 'src/client-data/client-data.service';

@Injectable()
export class AdsDataCronJobService {
  constructor(
    @Inject(MetaAdsService)
    private readonly MetaAdsService: MetaAdsService,
    @Inject(ClientDataService)
    private readonly ClientDataService: ClientDataService
  ) { }


  //crone job will run 1st day of every month at 9:00AM EST time
  @Cron('0 8 * * *', {
    name: 'Daily Update',
    timeZone: 'EST',
  })
  async ClientadsUpdateCroneJob() {
    let meta_Linked_users: any = []
    let linkedin_Linked_users: any = []
    let usersList = await this.ClientDataService.findAllWithQuery({ where: [{ is_meta_login: '1' }, { is_bing_login: '1' }, { is_linkedin_login: '1' }, { is_google_login: '1' }] })
    usersList.forEach(e => {
      let { meta_refresh_token = '', linkedin_refresh_token, facebook_client_linked_accounts = '', linkedin_client_linked_accounts = '',
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
      // if (linkedin_client_linked_accounts.length && linkedin_refresh_token) {
      //   let clients = JSON.parse(linkedin_client_linked_accounts)
      //   let data: any = {}
      //   data.customers = clients.filter(e => !e.unlinked)
      //   data.email = email
      //   data.refresh_token = meta_refresh_token
      //   linkedin_Linked_users.push(data)
      // }

    })
    meta_Linked_users.forEach(async (e) => {
      await this.MetaAdsService.ObtainMetaAdsDataWithCrone(e)
    })

    linkedin_Linked_users.forEach(async (e)=>{
      // await this.MetaAdsService.ObtainMetaAdsDataWithCrone(e)
    })

    // Logger.log('Cron job ClientadsUpdateCroneJob',customer_ids);
    return ({ meta_Linked_users })
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
