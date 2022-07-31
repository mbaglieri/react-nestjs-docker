import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CurrencyDocument = Currency & Document;

@Schema({_id: false})
export class Currency {

  @Prop({type: Types.ObjectId})
  _id: Types.ObjectId;

  @Prop()
  key: string;

  @Prop()
  price: number;

  @Prop({default: Date.now() })
  createdDate: Date
}
export const CurrencySchema = SchemaFactory.createForClass(Currency);
