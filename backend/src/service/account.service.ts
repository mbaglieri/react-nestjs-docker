import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Account, AccountDocument } from "../model/account.schema";
import { Currency, CurrencyDocument } from "../model/currency.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {

    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
    ) { }

    async signin(account: Account, jwt: JwtService): Promise<any> {
        const foundAccount = await this.accountModel.findOne({ number: account.number }).populate("currency").exec();
        if (foundAccount) {
            return {
                id    : foundAccount._id,
                number: foundAccount.number,
                currency: {
                    key: foundAccount.currency.key,
                }
            };
        }else{
            const currency = await this.currencyModel.findOne().exec();
            if(!currency){
                return new HttpException('the system doesnt setup', HttpStatus.UNAUTHORIZED)
            }
            const reqBody = {
                number: account.number,
                currency: currency
            }
            const newAccount = new this.accountModel(reqBody);
            return {
                id    : newAccount._id,
                number: newAccount.number,
                currency: {
                    key: currency.key,
                }
            };
        }
    }

    async getOne(number): Promise<Account> {
        return await this.accountModel.findOne({ number }).populate("currency").exec();
    }
}