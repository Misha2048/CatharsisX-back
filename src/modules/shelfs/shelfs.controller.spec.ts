import { Test, TestingModule } from '@nestjs/testing';
import { ShelfsController } from './shelfs.controller';
import { ShelfsService } from './shelfs.service';

describe('ShelfsController', () => {
  let controller: ShelfsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelfsController],
      providers: [ShelfsService],
    }).compile();

    controller = module.get<ShelfsController>(ShelfsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
