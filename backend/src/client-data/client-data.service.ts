import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateClientDatumDto } from './dto/create-client-datum.dto';
import { UpdateClientDatumDto } from './dto/update-client-datum.dto';
import { ClientDatum } from './entities/client-datum.entity';
import { ClientMonthlyDatum } from './entities/client-monthly-datum.entity';
import { Cron } from '@nestjs/schedule';
import e from 'express';
import axios from 'axios';
import { WebHookPayload } from './client-data.controller';
import * as nodemailer from 'nodemailer';



@Injectable()
export class ClientDataService {
  private retryCount = 0
  private maxRetries = 3
  private emailSent = false;
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
    const data = await this.clientDataRepository.find({ relations: { monthly_datum: true } });
    data.forEach((e: any) => {
      if (e?.monthly_datum.length) {
        let sum = 0
        for (let i = 0; i < e.monthly_datum.length - 1; i++) {
          sum += parseInt(e.monthly_datum[i].remaining)
        }
        e.accountBalance = sum + ''
        e.monthly_datum = []  // empty array assigned just to optimize api response size
      }
    });
    return data;
  }

  // async findsActives() {
  //   const data = await this.clientDataRepository.find({ where: { is_active_from_bubble: '1' } });
  //   return data;
  // }

  async findsActives() {
    const data = await this.clientDataRepository.find({ where: { is_active_from_bubble: '1' }, relations: { monthly_datum: true } });
    data.forEach((e: any) => {
      if (e?.monthly_datum.length) {
        let sum = 0
        for (let i = 0; i < e.monthly_datum.length - 1; i++) {
          sum += parseInt(e.monthly_datum[i].remaining)
        }
        e.accountBalance = sum + ''
        e.monthly_datum = []  // empty array assigned just to optimize api response size
      }
    })
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

  async updateByClient(email: string, updateClientData: UpdateClientDatumDto) {
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
      let data = await this.clientMonthlyDataRepository.find({ order: { created_at: 'DESC' }, relations: { user: true }, select: { user: { client: true } } })

      // to prevent changes in frontend,here client name will be assigned from relation
      let list = []
      data.forEach(e => {
        if (!e.user)
          return;
        let obj: any = { ...e }
        obj.client = e.user.client
        list.push(obj)
      })
      return { list }
    } catch (error) {
      Logger.log("err ", error)
      return { error: "error while getting Monthly Data" }
    }
  }

  async sendEmail() {
    const transporter = nodemailer.createTransport({
      host: 'Gmail',
      auth: {
        user: process.env.NODE_MAIL_EMAIL,
        pass: process.env.NODE_MAIL_PASSWORD,
      },
    });
    const fromName = `Adview ${process.env.NODE_MAIL_EMAIL}`
    const msg = {
      to: 'muzamil.egenie@gmail.com',
      from: fromName,
      subject: 'Monthly Logs Data Alert',
      html: `<h2>ALert!</h2>
      <strong>Failed to fetch and save data for this month in the monthly logs. The cron job has exceeded the maximum number of retries. Please attempt to run it manually and save the data before it is lost.</strong>
      <h3>Best Wishes,</h3>
      <h3>/Adview</h3>
      `,
    };
    try {
      const response = await transporter.sendMail(msg);
      return response;
    } catch (error) {
      console.log(error, "error");
      return error;
    }
  };

  //crone job will run 1st day of every month at 9:00AM EST time
  @Cron('0 9 1 * *', {
    name: 'monthly update',
    timeZone: 'EST',
  })

  async handleCron() {
    try {
      let data = await this.ComputeMonthlyData()
      Logger.log('Cron job try block ran', data);
    }
    catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => {
          this.handleCron();
        }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
        Logger.log('Cron job catch block ran, retrying...', error);
      } else {
        Logger.log('Cron job exceeded maximum retries');
        if (!this.emailSent) {
          this.sendEmail();
          this.emailSent = true; // To avoid sending multiple emails
        }
      }
    }
  }

  // Monthly Calculation
  async ComputeMonthlyData() {
    try {
      const apiUrl = 'https://account.215marketing.com/version-live/api/1.1/obj/Work';
      const accessToken = process.env.BUBBLE_TOKEN
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
      let list = res.data.response.results || []
      // Calculate the date one month ago
      let arr = []
      if (list.length) {

        let spliceArr = []
        // filter out duplicate frequency 
        for (let i = 0; i < list.length; i++) {
          let isDuplicate = false;
          let sumOfBudget = 0
          let ele = list[i];
          for (let j = i + 1; j < list.length; j++) {
            if (ele.account_custom_account == list[j].account_custom_account && ele.billing_schedule_option_billing_schedule == 'Month-to-Month' && list[j].billing_schedule_option_billing_schedule == 'Month-to-Month') {
              // Add both M2M for a client
              isDuplicate = true
              sumOfBudget += ele.budget_number + list[j].budget_number
            }
          }
          if (isDuplicate == true) {
            ele.budget_number = sumOfBudget
            spliceArr.push(ele)
          }
          else spliceArr.push(ele)
        }

        const filteredArray = [];
        const seenNames = new Set();

        spliceArr.forEach((obj) => {
          const key = `${obj.account_custom_account}_${obj.billing_schedule_option_billing_schedule}`;
          if (!seenNames.has(key)) {
            seenNames.add(key);
            filteredArray.push(obj);
          }
        });

        console.log(filteredArray);

        filteredArray.forEach(e => {
          let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule, media_buyer_option_media_buyer: buyer }: WebHookPayload = e
          // find corresponding user 
          const { email: bub_email, facebook, bing, linkedin, google } = savedUsers.find((u) => u.email == email) || {};
          if (!bub_email)
            return

          const total = (facebook > '0' ? parseInt(facebook) : 0) + (google > '0' ? parseInt(google) : 0) + (bing > '0' ? parseInt(bing) : 0) + (linkedin > '0' ? parseInt(linkedin) : 0);

          // check if client have multiple repeat for different frequency 
          let duplicateArr = filteredArray.filter(e => e['account_custom_account'] == email)

          // if parent frequency is one-time and have duplicate id it mean its already been calculated and skip this iteration 
          if (duplicateArr.length > 1 && billing_schedule_option_billing_schedule == 'One-Time')
            return

          if (duplicateArr.length > 1) {
            duplicateArr.forEach((e: WebHookPayload) => {
              if (e.billing_schedule_option_billing_schedule == 'One-Time') {
                budget_number += e.budget_number
              }
            })
          }
          // find user to make relation with client table
          let user = savedUsers.find((u) => u.email == email) || {};
          let obj = { email, buyer: buyer, month, year, frequency: billing_schedule_option_billing_schedule, remaining: `` + (budget_number - total) || `0`, monthly_spent: `` + total, monthly_budget: `` + budget_number, user, facebook, google, bing, linkedin }
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

  // Enter spend data manually
  // async ComputeSpendData() {
  //   try {
  //     let savedUsers = await this.clientMonthlyDataRepository.find()

  //     // let list = [] bubble data
  //     // Calculate the date one month ago
  //     let arr = []

  //       arr.forEach(e => {
  //         let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule, media_buyer_option_media_buyer: buyer }: WebHookPayload = e
  //         // find corresponding user 
  //         const { email: bub_email, facebook, bing, linkedin, google } = savedUsers.find((u) => u.email == email) || {};
  //         if (!bub_email)
  //           return

  //         const total = (facebook > '0' ? parseInt(facebook) : 0) + (google > '0' ? parseInt(google) : 0) + (bing > '0' ? parseInt(bing) : 0) + (linkedin > '0' ? parseInt(linkedin) : 0);

  //         // check if client have multiple repeat for different frequency 
  //         let duplicateArr = filteredArray.filter(e => e['account_custom_account'] == email)

  //         // if parent frequency is one-time and have duplicate id it mean its already been calculated and skip this iteration 
  //         if (duplicateArr.length > 1 && billing_schedule_option_billing_schedule == 'One-Time')
  //           return

  //         if (duplicateArr.length > 1) {
  //           duplicateArr.forEach((e: WebHookPayload) => {
  //             if (e.billing_schedule_option_billing_schedule == 'One-Time') {
  //               budget_number += e.budget_number
  //             }
  //           })
  //         }
  //         // find user to make relation with client table
  //         let user = savedUsers.find((u) => u.email == email) || {};
  //         let obj = { email, buyer: buyer, month, year, frequency: billing_schedule_option_billing_schedule, monthly_budget: `` + budget_number, user }
  //         arr.push(obj)
  //       });
  //       // insert list in monthly table
  //       await this.clientMonthlyDataRepository.insert(arr)
  //       this.UpdateBubbleStatusForUser(savedUsers, arr)

  //       return ('Cron job success')
  //     }

  //   }
  //   catch (err) {
  //     Logger.log("Error in Cron Job ", err)
  //     return ('Failed cron jon operation')
  //   }
  // }


  // handle bubble user update budget 
  async HandleWebhookUpdateUser(payload) {
    let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule }: WebHookPayload = payload
    let obj: any = { monthly_budget: `${budget_number}`, frequency: billing_schedule_option_billing_schedule }
    if (name_text)
      obj.client = name_text;
    try {
      let user = await this.clientDataRepository.findOneBy({ email })
      if (!user)
        return { status: 'error', message: "User Not Found" }
      await this.clientDataRepository.update({ email }, obj)
      return { status: 'success' }
    } catch (error) {
      return { status: 'error', message: error }
    }
  }

  // handle bubble user update Reactivate 
  async HandleWebhookUpdateUserStatus(payload) {
    let { account_custom_account: email, budget_number, is_active }: WebHookPayload = payload
    let obj = { monthly_budget: `${budget_number}`, is_active_from_bubble: is_active == '1' ? '1' : '0' }
    try {
      let user = await this.clientDataRepository.findOneBy({ email })
      if (!user)
        return { status: 'error', message: "User Not Found" }
      let data =  await this.clientDataRepository.update({ email }, obj)
      if(data.affected == 0)
        return { status: 'error', message: "unable to update" }
      return { status: 'success',data }
    } catch (error) {
      return { status: 'error', message: error }
    }
  }


  // handle bubble new user call
  async HandleWebhookCreateUser(payload) {
    const { account_custom_account: email, name_text, budget_number }: WebHookPayload = payload
    try {
      let obj = { email, client: name_text, monthly_budget: `${budget_number}` }
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
        let { account_custom_account: email, name_text, budget_number, billing_schedule_option_billing_schedule = '', media_buyer_option_media_buyer: buyer }: WebHookPayload = e

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
      const { email, monthly_budget } = bubbleActiveUsers.find((u) => u.email == obj.email) || {};
      if (!email) {
        obj.is_active_from_bubble = '0'
        obj.is_meta_login = '0'
        obj.is_linkedin_login = '0'
        obj.is_google_login = '0'
        obj.is_bing_login = '0'
      }
      else {
        obj.monthly_budget = monthly_budget
        obj.is_active_from_bubble = '1'
      }
      arr.push(obj)
    })
    try {
      await this.clientDataRepository.upsert(arr, ['id'])
      Logger.log("bubble Status Updated Success")
    } catch (error) {
      Logger.log("bubble Status Updation Error", Error)
    }

  }

  async remove(id: number) {
    const deletedData = await this.clientDataRepository.delete({ id })
    return { message: "Record deleted successfully", res: deletedData }
  }

  // async testCall(){
  //   let users:WebHookPayload =await this.clientDataRepository.find()
  //   let users2:WebHookPayload =await this.clientMonthlyDataRepository.find({where:{month : '6'}})
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

