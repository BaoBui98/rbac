import { AppDataSource } from '../database/data-source';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding!');

    const roleRepository = AppDataSource.getRepository(Role);
    const permissionRepository = AppDataSource.getRepository(Permission);

    // 1. Seed Role
    let superAdminRole = await roleRepository.findOne({
      where: { name: 'superadmin' },
      relations: ['permissions'],
    });

    if (!superAdminRole) {
      superAdminRole = roleRepository.create({ name: 'superadmin', permissions: [] });
      await roleRepository.save(superAdminRole);
      console.log('Successfully seeded "superadmin" role!');
    } else {
      console.log('Role "superadmin" already exists.');
    }

    // 2. Seed Permission
    let allPermission = await permissionRepository.findOneBy({ name: '*' });

    if (!allPermission) {
      allPermission = permissionRepository.create({ name: '*' });
      await permissionRepository.save(allPermission);
      console.log('Successfully seeded "*" permission!');
    } else {
      console.log('Permission "*" already exists.');
    }

    // 3. Seed Role-Permission
    const hasPermission = superAdminRole.permissions.some((p) => p.id === allPermission!.id);

    if (!hasPermission) {
      superAdminRole.permissions.push(allPermission!);
      await roleRepository.save(superAdminRole);
      console.log('Successfully assigned "*" permission to "superadmin" role!');
    } else {
      console.log('The "superadmin" role already has the "*" permission.');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

seed();
