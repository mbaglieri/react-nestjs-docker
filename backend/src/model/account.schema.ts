import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Currency } from './currency.schema';
import * as mongoose from "mongoose";

export type AccountDocument = Account & Document;

@Schema({_id: false})
export class Account {

  @Prop({type: Types.ObjectId})
  _id: Types.ObjectId;

  @Prop()
  number: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Currency" })
  currency: Currency

  @Prop({default: Date.now() })
  createdDate: Date
}
export const AccountSchema = SchemaFactory.createForClass(Account);