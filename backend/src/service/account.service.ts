import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Account, AccountDocument } from "../model/account.schema";
import { Currency } from "../model/currency.schema";
import { ConfigService } from '@nestjs/config';
import { CurrencyService } from "../service/currency.service";
import { HttpService } from 'nestjs-http-promise'
import { getMonthDifference } from '../utils/base'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AccountService {

    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        private readonly config: ConfigService,
        private readonly http: HttpService,
        
        private readonly currencyService: CurrencyService
    ) { }

    async signin(account: Account, jwt: JwtService): Promise<any> {
        var foundAccount = await this.accountModel.findOne({ number: account.number })
            .populate("currencies", {'price':1,'key':1,'ethers':1}, Currency.name).exec();
            
        if (!foundAccount) {
            if(!account.number){
                return new HttpException('No account to check', HttpStatus.UNAUTHORIZED)
            }
            const l   = await this.isOldAccount(account.number);
            var isOld = false;
            if(Number(l['data']['status']) == 1){
                var firstTx = new Date(l['data']['result'][0]['timeStamp'] * 1000);
                var now     = new Date()
                isOld       = (getMonthDifference(firstTx, now) < 12)
            }
            const reqBody = {
                number: account.number,
                isOld : isOld
            }
            const newAccount =  new this.accountModel(reqBody);
            await newAccount.save();
            var currencies = [];
            for (var currency of this.config.get('currencies')) {
                currency.account  = newAccount;
                const newCurrency = await this.currencyService.create(currency);
                currencies.push(newCurrency);
            }
            newAccount.currencies = currencies;
            await newAccount.save();
            foundAccount =  await this.getOne(newAccount._id);
        }
        const payload = {
            _id       : foundAccount._id,
            number    : foundAccount.number,
            isOld     : foundAccount.isOld,
            currencies: foundAccount.currencies
        };
        return {
            token: jwt.sign(payload),
        };
    }
    async getOne(_id: string): Promise<any> {
        const foundAccount = await this.accountModel.findOne({ _id: _id }).populate("currencies", {'price':1,'key':1,'ethers':1}, Currency.name).exec();
        if (foundAccount) {
            return foundAccount
        }else{
            return new HttpException('No account to check', HttpStatus.UNAUTHORIZED);
        }
    }    
    async isOldAccount(account): Promise<object> {
        let uri = `${this.config.get('ether_url')}${account}`
        return this.http.get(uri);

    }
}