import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';

@Module({
  imports: [DiscoveryModule],
  controllers: [ManageController],
  providers: [ManageService],
})
export class ManageModule {}
