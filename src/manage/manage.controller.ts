import { Controller, Get } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permission } from '../common/decorators/permission.decorator';

@ApiBearerAuth()
@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Permission(['*'])
  @Get('controllers')
  getAllControllers() {
    return this.manageService.getAllControllers();
  }
}
