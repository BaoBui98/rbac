import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guard/auth.guard';
import { PermissionGuard } from './guard/permission.guard';
import { RolePermissionModule } from './role_permission/role_permission.module';
import { ManageModule } from './manage/manage.module';
import { ProjectModule } from './project/project.module';
import { ProjectMemberModule } from './project-member/project-member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') || 'localhost',
        port: configService.get<number>('POSTGRES_PORT') || 5432,
        username: configService.get<string>('POSTGRES_USER') || 'admin_user',
        password: configService.get<string>('POSTGRES_PASSWORD') || 'SecretPassword123',
        database: configService.get<string>('POSTGRES_DB') || 'my_app_db',
        autoLoadEntities: true,
        synchronize: false,
        ssl: configService.get<string>('POSTGRES_HOST') && configService.get<string>('POSTGRES_HOST') !== 'localhost'
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    PermissionModule,
    AuthModule,
    RolePermissionModule,
    ManageModule,
    ProjectModule,
    ProjectMemberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule { }
