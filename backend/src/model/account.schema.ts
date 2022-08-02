import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Currency } from './currency.schema';
import * as mongoose from "mongoose";

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {

  @Prop({required:true})
  number: string;

  @Prop({required:true,default:false})
  isOld: boolean;


  @Prop({type: [mongoose.Schema.Types.ObjectId ],ref: 'Currency'})
  currencies: Currency[];

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}
export const AccountSchema = SchemaFactory.createForClass(Account);