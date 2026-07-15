import { HttpException, Injectable } from '@nestjs/common';
import { CreateEmailSletterFrDto, CreateEmailSletterHrDto } from './dto/create-email-sletter.dto';
import { UpdateEmailSletterDto } from './dto/update-email-sletter.dto';
import { EmailService } from 'src/service/email/email.service';

@Injectable()
export class EmailSletterService {

  constructor(private email: EmailService) { }

  async createHr(createEmailSletterDto: CreateEmailSletterHrDto, ) {
    try {

      
      await this.email.send('pivaldihrd@mail.ru', 'Трудоустройство в ресторан PIVALDI', `Имя: ${createEmailSletterDto.name}\n\nНомер телефона: ${createEmailSletterDto.phone}\n\nХочу попасть в ресторан: ${createEmailSletterDto.resto}`)

      return
    } catch (error: any) {
      throw new HttpException(error.message || 'Ошибка сервера', error.statusCode || 500)
    }
  }

 async createFr(data:CreateEmailSletterFrDto) {
      try {
   
    
      await this.email.send('franch@mail.ru', 'ФРАНЧАЙЗИНГ PIVALDI CITY', 
        `ФИО: ${data.name} ${data.lastName}\n\nНомер телефона: ${data.phone}\n\nПочта: ${data.email}\n\nПланируемый город открытия: ${data.city}`)

      return
    } catch (error: any) {
      throw new HttpException(error.message || 'Ошибка сервера', error.statusCode || 500)
    }
  }

}
