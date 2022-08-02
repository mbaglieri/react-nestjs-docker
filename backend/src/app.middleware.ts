
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountService } from './service/account.service';
interface AccountRequest extends Request {
    account: any
}
@Injectable()
export class isAuthenticated implements NestMiddleware {
    constructor(private readonly accountService: AccountService) { }
    async use(req: AccountRequest, res: Response, next: NextFunction) {
        try{
       
            if ( 
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                const _id = req.headers.authorization.split(' ')[1];
                const account = await this.accountService.getOne(_id)
                if (account) {
                    req.account = account
                    next()
                } else {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
                    
                }
            } else {
                throw new HttpException('No token found', HttpStatus.NOT_FOUND)
                
            }
        }catch {
         throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
       }
    }
}
@Injectable()
export class isAdminAuthenticated implements NestMiddleware {
    constructor(private readonly accountService: AccountService) { }
    async use(req: AccountRequest, res: Response, next: NextFunction) {
        try{
            if ( 
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                const _id = req.headers.authorization.split(' ')[1];
                const account = await this.accountService.getOne(_id)
                if (account && account.number ==="0x") {
                    req.account = account
                    next()
                } else {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
                    
                }
            } else {
                throw new HttpException('No token found', HttpStatus.NOT_FOUND)
                
            }
        }catch {
         throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
       }
    }
}