import { Test, TestingModule } from '@nestjs/testing';
import { FarmerApplicationController } from './farmer-application.controller';

describe('FarmerApplicationController', () => {
  let controller: FarmerApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmerApplicationController],
    }).compile();

    controller = module.get<FarmerApplicationController>(FarmerApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
