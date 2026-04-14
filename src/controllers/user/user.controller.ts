import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private service:UserService){}

    @Get('')
    getUser(@Req() req){
        const user = req['user']
        return this.service.getUser(user.id)
    }
    
}
