
import { Module, RequestMethod, MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyService } from './service/currency.service';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';
import { Account, AccountSchema } from "./model/account.schema";
import { Currency, CurrencySchema } from "./model/currency.schema";
import { isAuthenticated } from './app.middleware';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise'
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout     : 5000,
        maxRedirects: 5,
      }),
    }),
    JwtModule.register({
     secret,
     signOptions: { expiresIn: '2h' },
   }),
    MongooseModule.forRoot(process.env.DATABASE),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
 ],

controllers: [AppController, CurrencyController, AccountController],
providers  : [AppService, CurrencyService, AccountService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/currency', method: RequestMethod.GET }
      )
      .forRoutes(CurrencyController);
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/account/signin', method: RequestMethod.POST }
      )
      .forRoutes(AccountController);
  }
}
 