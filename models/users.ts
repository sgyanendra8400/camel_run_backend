import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";
interface User {
  name: string;
  email: string;
  no_of_nfts_owned: number;
  nfts_token_id: Array<string>;
  wallet: string;
  winnings: number;
  lossings: number;
  active: boolean;
}
const schema = new Schema<User>(
  {
    name: { type: String, required: false},
    email: {type: String,required: false},
    no_of_nfts_owned: {type: Number,default:0,  required: false},
    nfts_token_id: [{type: String,required: false}],
    wallet: {type: String,required: false},
    winnings: {type: Number,default:0,required: false},
    lossings: {type: Number,default:0,required: false},
    active: {type: Boolean,required: false,default: true},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
export const UserModel = model<User>("User", schema);
