import { Body, Controller, HttpException, HttpStatus, Param, Put,  Res } from "@nestjs/common";
import { Currency } from "../model/currency.schema"
import { CurrencyService } from "../service/currency.service";

@Controller('/api/v1/currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }


    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() currency: Currency) {
        if(Number(currency.ethers)<=0){
            return response.status(HttpStatus.UNAUTHORIZED).json({'message':"ethers: you need to put unless 0.000001"})
        }
        if(Number(currency.price)<=0){
            return response.status(HttpStatus.UNAUTHORIZED).json({'message':"price: you need to put unless 0.000001"})
        }
        await this.currencyService.update(id, currency);
        return response.status(HttpStatus.OK).json({status:200,message:"Updated"})
    }

}