import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailSletterService } from './email-sletter.service';
import { CreateEmailSletterFrDto, CreateEmailSletterHrDto } from './dto/create-email-sletter.dto';
import { UpdateEmailSletterDto } from './dto/update-email-sletter.dto';

@Controller('email-sletter')
export class EmailSletterController {
  constructor(private readonly emailSletterService: EmailSletterService) {}

  @Post('hr')
  createHr(@Body() createEmailSletterDto: CreateEmailSletterHrDto) {
    return this.emailSletterService.createHr(createEmailSletterDto);
  }
  @Post('fr')
  createFr(@Body() createEmailSletterDto:CreateEmailSletterFrDto) {
    return this.emailSletterService.createFr(createEmailSletterDto);
  }

 
}
