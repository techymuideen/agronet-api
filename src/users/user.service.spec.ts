import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  const mockSave = jest.fn();
  const mockUserConstructor = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
    };

    // Make mockUserModel callable as a constructor
    const callableMock = Object.assign(mockUserConstructor, mockUserModel);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: callableMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException when email already exists', async () => {
    const createUserDto: CreateUserDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
    };

    // Mock findOne to return an existing user
    userModel.findOne.mockResolvedValue({
      _id: 'existing-id',
      email: 'john@example.com',
    });

    await expect(service.createUser(createUserDto)).rejects.toThrow(
      ConflictException,
    );
    await expect(service.createUser(createUserDto)).rejects.toThrow(
      'A user with this email address already exists',
    );
  });

  it('should create user when email does not exist', async () => {
    const createUserDto: CreateUserDto = {
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane@example.com',
      password: 'StrongPassword123!',
    };

    // Mock findOne to return null (no existing user)
    userModel.findOne.mockResolvedValue(null);

    // Mock save to return the created user
    mockSave.mockResolvedValue({
      _id: 'new-id',
      ...createUserDto,
    });

    await service.createUser(createUserDto);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
    expect(mockSave).toHaveBeenCalled();
  });
});
