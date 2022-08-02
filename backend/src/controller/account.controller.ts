import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { Account } from "../model/account.schema";
import { AccountService } from "../service/account.service";


@Controller('/api/v1/account')
export class AccountController {
    constructor(private readonly accountService: AccountService
    ) { }

    @Get('/me')
    async read(@Req() req){
        return {
            _id       : req.account._id,
            number    : req.account.number,
            isOld     : req.account.isOld,
            currencies: req.account.currencies
        };
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() account: Account) {
        const data = await this.accountService.signin(account);
        return response.status(HttpStatus.OK).json(data)
    }
}