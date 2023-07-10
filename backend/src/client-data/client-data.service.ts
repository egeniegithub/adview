import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateClientDatumDto } from './dto/create-client-datum.dto';
import { UpdateClientDatumDto } from './dto/update-client-datum.dto';
import { ClientDatum } from './entities/client-datum.entity';
import { ClientMonthlyDatum } from './entities/client-monthly-datum.entity';
import { Cron } from '@nestjs/schedule';
import e from 'express';
import axios from 'axios';

@Injectable()
export class ClientDataService {
  constructor(
    @InjectRepository(ClientDatum)
    private readonly clientDataRepository: Repository<ClientDatum>,
    @InjectRepository(ClientMonthlyDatum)
    private readonly clientMonthlyDataRepository: Repository<ClientMonthlyDatum>,
  ) { }

  async create(createClientDatumDto: CreateClientDatumDto) {
    try {
      const newRecord = await this.clientDataRepository.create(createClientDatumDto)
      // return { newRecord }
      if (newRecord) {
        const res = await this.clientDataRepository.save(newRecord)
        return { message: "Data added successfully", res: res }
      }
      else {
        return { error: "error occured while adding Data." }
      }
    }
    catch (err) {
      return { error: err }
    }
  }

  async findAll() {
    const data = await this.clientDataRepository.find();
    return data;
  }

  async findsActives() {
    const data = await this.clientDataRepository.find({ where: { is_active_from_bubble: '1' } });
    return data;
  }

  async findAllWithQuery(query) {
    const data = await this.clientDataRepository.find(query);
    return data;
  }

  async findOne(id: number) {
    const data = await this.clientDataRepository.find({ where: { id: id } });
    return data;
  }
  async findByEmail(email: string) {
    const data = await this.clientDataRepository.find({ where: { email } });
    return data;
  }

  async update(id: number, updateClientDatumDto: UpdateClientDatumDto) {
    try {
      const isUserExist = await this.clientDataRepository.find({
        where: { id: id }
      });
      if (isUserExist) {
        const updateTokens = await this.clientDataRepository.update({ id }, { ...updateClientDatumDto })
        return { message: "Data updated successfully", res: updateTokens }
      }
      else {
        return { message: "No Data found for this user." }
      }
    }
    catch (err) {
      return { error: err }
    }
  }

  async updateByClient(email: string, updateClientData: any) {
    try {
      return this.clientDataRepository.update({ email }, updateClientData)
    }
    catch (err) {
      return { error: err }
    }
  }

  async SyncWithBubble(bubbleData = []) {
    let updated = { affected: 0 }
    try {
      for (let index = 0; index < bubbleData.length; index++) {
        const e = bubbleData[index];
        let obj = await this.clientDataRepository.update({ client: e.client }, { monthly_budget: e.monthly_budget })
        updated.affected += obj.affected
      }
      return { message: "Data updated successfully", res: updated }
    }
    catch (err) {
      Logger.log("check error ", err)
    }
  }

  async GetMonthlyClientsData() {
    try {
      let data = await this.clientMonthlyDataRepository.find({ order: { created_at: 'DESC' } })
      return { list: data }
    } catch (error) {
      return { error: "error while getting Monthly Data" }
    }
  }


  //crone job will run 1st day of every month at 9:00AM EST time
  @Cron('0 9 1 * *', {
    name: 'monthly update',
    timeZone: 'EST',
  })
  async handleCron() {
    let data = await this.ComputeMonthlyData()
    Logger.log('Cron job response', data);
  }

  // Monthly Calculation
  async ComputeMonthlyData() {
    try {
      const apiUrl = 'https://account.215marketing.com/version-live/api/1.1/obj/Work';
      const accessToken = '3bf2d433d7db4b76e663f78faefccbab';
      let { month, year } = getPreviousMonthYear()
      let currentDate = getCurrentIOSDate()
      let savedUsers = await this.clientDataRepository.find()
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          // limit: 2,
          constraints: JSON.stringify([
            {
              key: 'work_type__option__option_work_type__option_',
              constraint_type: 'equals',
              value: 'Media Buying',
            },
            {
              key: 'status_option_work_type_status',
              constraint_type: 'in',
              value: ['Active', 'Accepted'],
            },
            {
              key: 'starts_at_date',
              constraint_type: 'less than',
              value: `${currentDate}T21:00:00.000Z`,
            },
          ]),
        },
      };

      let res = await axios.get(apiUrl, config)
      const list = res.data.response.results || []
      // Calculate the date one month ago
      let arr = []
      if (list.length) {
        // filter out duplicate frequency 
        const freqSet = new Set();
        const uniqueArray = list.filter((obj) => {
          if (freqSet.has(obj.billing_schedule_option_billing_schedule)) return false; // Skip this object if it's a duplicate
          freqSet.add(obj.billing_schedule_option_billing_schedule);
          return true; // Include this object in the filtered array
        });
        uniqueArray.forEach(e => {
          let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule, media_buyer_option_media_buyer: buyer }: any = e
          // find corresponding user 
          const { email: bub_email, facebook, bing, linkedin, google, client: adview_client_name } = savedUsers.find((u) => u.email == email) || {};
          if (!bub_email)
            return

          const total = (facebook > '0' ? parseInt(facebook) : 0) + (google > '0' ? parseInt(google) : 0) + (bing > '0' ? parseInt(bing) : 0) + (linkedin > '0' ? parseInt(linkedin) : 0)
          // check if client have multiple repeat for different frequency 
          let duplicateArr = list.filter(e => e[email] == email)

          // if parent frequency is one-time and have duplicate id it mean its already been calculated and skip this iteration 
          if (duplicateArr.length > 1 && billing_schedule_option_billing_schedule == 'One-Time')
            return

          if (duplicateArr.length > 1) {
            duplicateArr.forEach((e: any) => {
              if (e.billing_schedule_option_billing_schedule == 'One-Time') {
                budget_number += e.budget_number
              }
            })
          }
          let obj = { email, client: adview_client_name, buyer: buyer, month, year, frequency: billing_schedule_option_billing_schedule, remaining: `` + (budget_number - total) || `0`, monthly_spent: `` + total, monthly_budget: `` + budget_number }
          arr.push(obj)
        });
        // insert list in monthly table 
        await this.clientMonthlyDataRepository.insert(arr)
        this.UpdateBubbleStatusForUser(savedUsers, arr)

        return ('Cron job success')
      }

    }
    catch (err) {
      Logger.log("Error in Cron Job ", err)
      return ('Failed cron jon operation')
    }
  }


  // handle bubble user update budget 
  async HandleWebhookUpdateUser(payload) {
    let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule }: any = payload
    let obj = { monthly_budget: budget_number, frequency: billing_schedule_option_billing_schedule }
    try {
      await this.clientDataRepository.update({ email }, obj)
      return { status: 'success' }
    } catch (error) {
      return { status: 'error', message: error }
    }
  }

  // handle bubble new user call
  async HandleWebhookCreateUser(payload) {
    const { account_custom_account: email, name_text, budget_number }: any = payload
    try {
      let obj = { email, client: name_text, monthly_budget: budget_number }
      await this.clientDataRepository.insert(obj)
      return { status: 'success', message: 'user created successfully' }
    } catch (error) {
      return { status: 'error', error: error }
    }
  }


  // call for only to insert data for the first time in db
  async InsertClientData() {

    const apiUrl = 'https://account.215marketing.com/version-live/api/1.1/obj/Work';
    const accessToken = '3bf2d433d7db4b76e663f78faefccbab';
    let currentDate = getCurrentIOSDate()

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        // limit: 2,
        constraints: JSON.stringify([
          {
            key: 'work_type__option__option_work_type__option_',
            constraint_type: 'equals',
            value: 'Media Buying',
          },
          {
            key: 'status_option_work_type_status',
            constraint_type: 'in',
            value: ['Active', 'Accepted'],
          },
          {
            key: 'starts_at_date',
            constraint_type: 'less than',
            value: `${currentDate}T21:00:00.000Z`,
          },
        ]),
      },
    };
    try {
      let res = await axios.get(apiUrl, config)
      let arr = []
      const list = res.data.response.results || []
      // map data
      list.forEach(e => {
        let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule = '', media_buyer_option_media_buyer: buyer }: any = e

        let obj = { email, client: name_text, buyer: buyer, frequency: billing_schedule_option_billing_schedule, monthly_budget: budget_number, updated_at: getCurrentTimeForUpdateField() }
        arr.push(obj)
      });
      // update list in client table 
      let data = await this.clientDataRepository.upsert(arr, ['email'])

      return { list: data }

    } catch (error) {
      Logger.log("Error in Inserting client from bubble ", error)
      return { error: error }
    }

  }


  // update user bubble_status if he/she will be active from current month 
  async UpdateBubbleStatusForUser(savedUsers, bubbleActiveUsers) {
    let arr = []
    savedUsers.forEach(e => {
      let obj = { ...e }
      const { client: adview_client_name,monthly_budget} = bubbleActiveUsers.find((u) => u.email == obj.email) || {};
      if (!adview_client_name){
        obj.monthly_budget = monthly_budget
        obj.is_active_from_bubble = '0'
      }
      arr.push(obj)
    })
    try {
      await this.clientDataRepository.upsert(arr, ['id'])
      Logger.log("bubble Status Updated Success")
    } catch (error) {
      Logger.log("bubble Status Updation Error" , Error)
    }
    
  }

  async remove(id: number) {
    const deletedData = await this.clientDataRepository.delete({ id })
    return { message: "Record deleted successfully", res: deletedData }
  }

  // async testCall(){
  //   let users:any =await this.clientDataRepository.find()
  //   let users2:any =await this.clientMonthlyDataRepository.find({where:{month : '6'}})
  //   let arr = []
  //   users.forEach(e => {
  //     let obj = { ...e }
  //     const { client: adview_client_name } = users2.find((u) => u.email == obj.email) || {};
  //     if(!adview_client_name)
  //       obj.is_active_from_bubble = '0'
  //     arr.push(obj)
  //   })
  //   try {
  //     let upd = await this.clientDataRepository.upsert(arr, ["id"])
  //     return {data:upd}
  //   } catch (error) {
  //     return {error:error}
  //   }
    
  // }


}




function getPreviousMonthYear() {
  var currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  return { year, month }
}


function getCurrentIOSDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}


function getCurrentTimeForUpdateField() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

