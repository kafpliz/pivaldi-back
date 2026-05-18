import { Controller, Get } from '@nestjs/common';
import { RestoService } from './resto.service';

@Controller('resto')
export class RestoController {
  constructor(private readonly restoService: RestoService) {}



  @Get()
  findAll() {
    return this.restoService.findAll();
  }


}
