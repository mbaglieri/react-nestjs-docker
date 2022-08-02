import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Account } from './account.schema';
import * as mongoose from "mongoose";

export type CurrencyDocument = Currency & Document;

@Schema({ timestamps: true })
export class Currency {

  @Prop({required:true})
  key: string;

  @Prop({required:true})
  price: number;

  @Prop({required:true})
  ethers: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Account" ,required:true})
  account: Account

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}
export const CurrencySchema = SchemaFactory.createForClass(Currency);
