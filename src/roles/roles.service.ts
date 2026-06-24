import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async findByNameWithPermissions(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      inherit: createRoleDto.inherit,
    });
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find({ relations: ['permissions'] });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    const updated = this.roleRepository.merge(role, {
      name: updateRoleDto.name,
      inherit: updateRoleDto.inherit,
    });
    return await this.roleRepository.save(updated);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    return await this.roleRepository.remove(role);
  }
}
