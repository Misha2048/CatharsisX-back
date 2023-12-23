import { Test, TestingModule } from '@nestjs/testing';
import { StillagesService } from './stillages.service';

describe('StillagesService', () => {
  let service: StillagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StillagesService],
    }).compile();

    service = module.get<StillagesService>(StillagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
