import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDatumDto } from './dto/create-client-datum.dto';
import { UpdateClientDatumDto } from './dto/update-client-datum.dto';
import { ClientDatum } from './entities/client-datum.entity';

@Injectable()
export class ClientDataService {
  constructor(
    @InjectRepository(ClientDatum)
    private readonly clientDataRepository: Repository<ClientDatum>,
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

  async findOne(id: number) {
    const data = await this.clientDataRepository.find({ where: { id: id } });
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

  async remove(id: number) {
    const deletedData = await this.clientDataRepository.delete({ id })
    return { message: "Record deleted successfully", res: deletedData }
  }
}
