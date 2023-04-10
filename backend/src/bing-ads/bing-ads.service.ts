import { Injectable } from '@nestjs/common';
import { CreateBingAdDto } from './dto/create-bing-ad.dto';
import { UpdateBingAdDto } from './dto/update-bing-ad.dto';

@Injectable()
export class BingAdsService {
  create(createBingAdDto: CreateBingAdDto) {
    return 'This action adds a new bingAd';
  }

  findAll() {
    return `This action returns all bingAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bingAd`;
  }

  update(id: number, updateBingAdDto: UpdateBingAdDto) {
    return `This action updates a #${id} bingAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} bingAd`;
  }
}
