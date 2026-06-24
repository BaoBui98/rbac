import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../common/services/hash.service';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) { }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await this.hashService.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: { id: createUserDto.roleId } as Role,
    });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: string) {
    return await this.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (existingUser) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      hashedPassword = await this.hashService.hashPassword(updateUserDto.password);
    }

    const updated = this.userRepository.merge(user, {
      ...updateUserDto,
      password: hashedPassword,
      role: updateUserDto.roleId ? ({ id: updateUserDto.roleId } as any) : undefined,
    });
    return await this.userRepository.save(updated);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    return await this.userRepository.remove(user);
  }
}
