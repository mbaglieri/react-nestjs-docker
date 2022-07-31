import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseInterceptors, Put, Req, Res, Query } from "@nestjs/common";
import { Currency } from "../model/currency.schema"
import { CurrencyService } from "../service/currency.service";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('/api/v1/currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }

    @Post()
    async create(@Res() response, @Req() request, @Body() currency: Currency) {
        const requestBody = { key: currency.key, price: currency.price }
        const newCurrency = await this.currencyService.create(requestBody);
        return response.status(HttpStatus.CREATED).json({
            newCurrency
        })
    }

    @Get()
    async read(@Query() page): Promise<Object> {
        return await this.currencyService.readAll(page);
    }

    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() currency: Currency) {
        const updated = await this.currencyService.update(id, currency);
        return response.status(HttpStatus.OK).json(updated)
    }

    @Delete('/:id')
    async delete(@Res() response, @Param('id') id) {
        await this.currencyService.delete(id);
        return response.status(HttpStatus.OK).json({
            user: null
        })
    }
}