import { Injectable } from '@nestjs/common';
import { CreateLinkedinAdDto } from './dto/create-linkedin-ad.dto';
import { UpdateLinkedinAdDto } from './dto/update-linkedin-ad.dto';

@Injectable()
export class LinkedinAdsService {
  create(createLinkedinAdDto: CreateLinkedinAdDto) {
    return 'This action adds a new linkedinAd';
  }

  findAll() {
    return `This action returns all linkedinAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkedinAd`;
  }

  update(id: number, updateLinkedinAdDto: UpdateLinkedinAdDto) {
    return `This action updates a #${id} linkedinAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkedinAd`;
  }
}
