import { Test, TestingModule } from '@nestjs/testing';
import { PlatformTokensService } from './platform-tokens.service';

describe('PlatformTokensService', () => {
  let service: PlatformTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformTokensService],
    }).compile();

    service = module.get<PlatformTokensService>(PlatformTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
