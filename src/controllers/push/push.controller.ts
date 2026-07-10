import { Controller, Post, Body, Headers, UnauthorizedException, Get, Query } from '@nestjs/common';
import { PushService } from './push.service';
import { RegisterPushDeviceDto } from './dto/create-push.dto';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('all')
  getAll(@Query('page') page?:string,@Query('limit') limit?:string,){
    return this.pushService.getAll(page? + page: undefined, /* limit ? +limit : undefined  */ 10)
  }

  @Post("register")
  create(@Body() createPushDto: RegisterPushDeviceDto) {
    return this.pushService.register(createPushDto);
  }

  @Post('broadcast')
  broadcast(
    @Headers('x-admin-secret') secret:string,  @Body() body: { title: string; body: string; data?: Record<string, unknown> },
  ){

    console.log("PUSH");
    console.log(process.env.ADMIN_PUSH_SECRET);
    console.log(secret);
    
     if (secret !== process.env.ADMIN_PUSH_SECRET) {
      throw new UnauthorizedException();
    }
    return this.pushService.sendEverybody(body);
  }
}
