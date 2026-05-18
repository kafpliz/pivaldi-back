import { PartialType } from '@nestjs/mapped-types';
import { CreateRestoDto } from './create-resto.dto';

export class UpdateRestoDto extends PartialType(CreateRestoDto) {}
