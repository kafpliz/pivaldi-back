import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdDataDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {

    constructor(private service: UserService) { }

    @Get('')
    getUser(@Req() req) {
        const user = req['user']
        return this.service.getUser(user.id)
    }

    @Put()
    async updUser(@Body() data: UserUpdDataDTO, @Req() req) {
        const user = req['user']
        const cleanData = Object.entries(data).reduce((acc, [key, val]) => {
            if (val !== undefined) {
                acc[key] = val
            }
            return acc
        }, {} as Record<string, any>)

        return this.service.updData(user.id, cleanData)
    }

    @Post('logout')
    async logOut(@Req() req) {
        const user = req['user']
        return this.service.logOut(user.id)
    }

    @Post('delete')
    async deleteUser(@Req() req) {
        const user = req['user']
        console.log(user);
        
        return this.service.deleteAcc(user.id)
    }
}
