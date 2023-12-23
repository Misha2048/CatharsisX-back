import { Test, TestingModule } from '@nestjs/testing';
import { ShelfsService } from './shelfs.service';

describe('ShelfsService', () => {
  let service: ShelfsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelfsService],
    }).compile();

    service = module.get<ShelfsService>(ShelfsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
