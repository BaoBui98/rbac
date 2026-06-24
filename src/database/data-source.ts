import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load variables from .env
config({ path: join(process.cwd(), '.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  username: process.env.POSTGRES_USER || 'admin_user',
  password: process.env.POSTGRES_PASSWORD || 'SecretPassword123',
  database: process.env.POSTGRES_DB || 'my_app_db',
  synchronize: false, // Ensure this is false so migrations are used instead
  logging: true,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  subscribers: [],
});
