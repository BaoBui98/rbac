import { PartialType } from '@nestjs/swagger';
import { CreateManageDto } from './create-manage.dto';

export class UpdateManageDto extends PartialType(CreateManageDto) {}
