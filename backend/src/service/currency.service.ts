import {
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Currency, CurrencyDocument } from "../model/currency.schema";

@Injectable()
export class CurrencyService {

    constructor(
        @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
    ) { }

    async create(currency: Object): Promise<Currency> {
        const newCurrency = new this.currencyModel(currency);
        return newCurrency.save();
    }

    async update(id, currency: Currency): Promise<Currency> {

        const toUpdate = {
            ethers:currency.ethers,
            price :currency.price
        }
        return await this.currencyModel.findByIdAndUpdate(id, currency, { new: true })
    }
}