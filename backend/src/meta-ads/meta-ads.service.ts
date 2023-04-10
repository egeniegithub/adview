import { Injectable } from '@nestjs/common';
import { CreateMetaAdDto } from './dto/create-meta-ad.dto';
import { UpdateMetaAdDto } from './dto/update-meta-ad.dto';

@Injectable()
export class MetaAdsService {
  create(createMetaAdDto: CreateMetaAdDto) {
    return 'This action adds a new metaAd';
  }

  findAll() {
    return `This action returns all metaAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaAd`;
  }

  update(id: number, updateMetaAdDto: UpdateMetaAdDto) {
    return `This action updates a #${id} metaAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaAd`;
  }
}
