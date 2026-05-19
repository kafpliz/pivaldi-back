import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class RulesService {

  constructor(private prisma:PrismaService){}

 async findAll() {
     try {

      const result = await this.prisma.rules.findMany({
        select: {
          id: true,
          type: true,
          text: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
      const response = {
        negative: result.filter(item => item.type == 'negative'),
        positive: result.filter(item => item.type == "positive"),
      }

      return response
    } catch (error: any) {
      throw new HttpException(error.message || 'Внутренняя ошибка', error.status || HttpStatus.BAD_GATEWAY)
    }
  }

}
