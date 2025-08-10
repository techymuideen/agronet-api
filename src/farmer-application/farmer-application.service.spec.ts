import { Test, TestingModule } from '@nestjs/testing';
import { FarmerApplicationService } from './farmer-application.service';

describe('FarmerApplicationService', () => {
  let service: FarmerApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FarmerApplicationService],
    }).compile();

    service = module.get<FarmerApplicationService>(FarmerApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
