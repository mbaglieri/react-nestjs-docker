import {
    Injectable,
    HttpException,
    HttpStatus,
    NotFoundException,
    ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Currency, CurrencyDocument } from "../model/currency.schema";
import { Account, AccountDocument } from "../model/account.schema";
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';

@Injectable()
export class CurrencyService {

    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
    ) { }

    async create(currency: Object): Promise<Currency> {
        const newCurrency = new this.currencyModel(currency);
        return newCurrency.save();
    }
    async readAll(id): Promise<any> {
        if (id.id) {
            return this.currencyModel.findOne({ _id: id.id }).exec();
        }
        return this.currencyModel.find().exec();
    }

    async update(id, currency: Currency): Promise<Currency> {
        return await this.currencyModel.findByIdAndUpdate(id, currency, { new: true })
    }

    async delete(id): Promise<any> {
        const replaceCurrency = await this.currencyModel.findOne({ _id: {$ne: id.id } }).exec();
        if(!replaceCurrency){
            return new HttpException('There is not replace for this currency', HttpStatus.UNAUTHORIZED)
        }
        const currency = await this.currencyModel.findOne({ _id: id.id  }).exec();
        await this.accountModel.updateMany({ currency: currency}, { currency: replaceCurrency });
        return await this.currencyModel.findByIdAndRemove(id);
    }
}