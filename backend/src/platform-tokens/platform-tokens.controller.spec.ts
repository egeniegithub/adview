import { Test, TestingModule } from '@nestjs/testing';
import { PlatformTokensController } from './platform-tokens.controller';
import { PlatformTokensService } from './platform-tokens.service';

describe('PlatformTokensController', () => {
  let controller: PlatformTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformTokensController],
      providers: [PlatformTokensService],
    }).compile();

    controller = module.get<PlatformTokensController>(PlatformTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
