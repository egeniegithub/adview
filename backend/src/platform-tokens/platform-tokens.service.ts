import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlatformTokenDto } from './dto/create-platform-token.dto';
import { UpdatePlatformTokenDto } from './dto/update-platform-token.dto';
import { PlatformToken } from './entities/platform-token.entity';

@Injectable()
export class PlatformTokensService {
  constructor(
    @InjectRepository(PlatformToken)
    private readonly platform_tokensRepository: Repository<PlatformToken>,
  ) { }

  async create(createPlatformTokenDto: CreatePlatformTokenDto) {
    try {
      const email = createPlatformTokenDto.email
      const isemailExist = await this.platform_tokensRepository.find({
        where: { email: email }
      });

      if (isemailExist) {
        const updatedData = {
          g_token: createPlatformTokenDto.g_token,
          g_refresh: createPlatformTokenDto.g_refresh,
          b_token: createPlatformTokenDto.b_token,
          b_refresh: createPlatformTokenDto.b_refresh,
          li_token: createPlatformTokenDto.li_token,
          li_refresh: createPlatformTokenDto.li_refresh,
          m_token: createPlatformTokenDto.m_token,
          m_refresh: createPlatformTokenDto.m_refresh,
        }
        const updateTokens = await this.platform_tokensRepository.update({ email }, { ...updatedData })
        return { message: "Record updated successfully", res: updateTokens, isemailExist: isemailExist }
      } else {
        // const data = {
        //   email: email,
        //   g_token: g_token,
        //   g_refresh: g_refresh,
        //   created_at: new Date(),
        //   updated_at: new Date()
        // }

        const newRecord = await this.platform_tokensRepository.create(createPlatformTokenDto)
        if (newRecord) {
          const res = await this.platform_tokensRepository.save(newRecord)
          return { message: "Record added successfully", res: res }
        }
        else {
          return { error: "error occured while adding record." }
        }
      }
    } catch (err) {
      console.log(err);
      return { error: err }
    }
  }

  async findAll() {
    const platform_tokens = await this.platform_tokensRepository.find();
    return platform_tokens
  }

  findOne(id: number) {
    return `This action returns a #${id} platformToken`;
  }

  update(id: number, updatePlatformTokenDto: UpdatePlatformTokenDto) {
    return `This action updates a #${id} platformToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} platformToken`;
  }
}
