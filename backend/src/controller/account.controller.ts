import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { Account } from "../model/account.schema";
import { AccountService } from "../service/account.service";
import { JwtService } from '@nestjs/jwt';


@Controller('/api/v1/account')
export class AccountController {
    constructor(private readonly accountServerice: AccountService,
        private jwtService: JwtService
    ) { }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: Account) {
        const data = await this.accountServerice.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json(data)
    }
}