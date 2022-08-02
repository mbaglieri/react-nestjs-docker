import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, Put, Req, Res, Query } from "@nestjs/common";
import { Currency } from "../model/currency.schema"
import { CurrencyService } from "../service/currency.service";

@Controller('/api/v1/currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }


    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() currency: Currency) {
        const updated = await this.currencyService.update(id, currency);
        return response.status(HttpStatus.OK).json(updated)
    }

}