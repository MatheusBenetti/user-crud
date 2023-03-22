import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('find user by ID', () => {
      it('should return the user object', async () => {
        const userId = '1';
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);

        const user = await service.findOne(userId);
        expect(user).toEqual(expectedUser);
      });

      it('should return NotFoundException', async () => {
        const userId = '1';
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User ID: ${userId} not found.`);
        }
      });
    });
  });

  describe('findAll', () => {
    describe('find all users', () => {
      it('should return the list of users', async () => {
        const expectedUser = [
          { name: 'test', email: 'test@test.com', password: 123456 },
        ];

        userRepository.find.mockReturnValue(expectedUser);

        const user = await service.findAll();

        expect(user).toEqual([
          { name: 'test', email: 'test@test.com', password: 123456 },
        ]);
      });
    });
  });
});
