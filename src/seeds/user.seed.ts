import { AppDataSource } from '../database/data-source';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { HashService } from '../common/services/hash.service';

async function seedUser() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for user seeding!');

    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);
    const hashService = new HashService();

    // Lấy role superadmin
    const superAdminRole = await roleRepository.findOneBy({ name: 'superadmin' });

    if (!superAdminRole) {
      console.error('Role "superadmin" not found. Cannot create user.');
      process.exit(1);
    }

    const email = 'admin@admin.com';
    const existingUser = await userRepository.findOneBy({ email });

    if (!existingUser) {
      // Hash mật khẩu
      const hashedPassword = await hashService.hashPassword('Admin@123');

      // Tạo user với role superadmin
      const superAdminUser = userRepository.create({
        name: 'Super Admin',
        email: email,
        password: hashedPassword,
        role: superAdminRole,
      });

      await userRepository.save(superAdminUser);
      console.log('Successfully seeded superadmin user with hashed password!');
    } else {
      console.log('User "admin@admin.com" already exists.');
    }
  } catch (error) {
    console.error('Error during user seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

seedUser();
