import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({_id: false})
export class Account {

  @Prop({type: Types.ObjectId})
  _id: Types.ObjectId;

  @Prop()
  number: string;

  @Prop({default: Date.now() })
  createdDate: Date
}
export const AccountSchema = SchemaFactory.createForClass(Account);