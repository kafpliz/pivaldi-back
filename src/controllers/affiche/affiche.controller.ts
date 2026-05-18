import { Controller, Get, Param } from '@nestjs/common';
import { AfficheService } from './affiche.service';

@Controller('affiche')
export class AfficheController {
  constructor(private readonly afficheService: AfficheService) {}

  @Get(':id')
  findAll(@Param('id') id:string){
    return this.afficheService.findAll(+id)
  }
}
