import { Test, TestingModule } from '@nestjs/testing';
import { StillagesController } from './stillages.controller';

describe('StillagesController', () => {
  let controller: StillagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StillagesController],
    }).compile();

    controller = module.get<StillagesController>(StillagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
