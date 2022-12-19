import { Schema, model, ObjectId } from "mongoose";

interface User {
  name: string;
  last_name:string,
  password:string,
  wallet_data_bep2:string,
  user_type:string,
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
    last_name: { type: String, required: false},
    password: { type: String, required: false},
    wallet_data_bep2: { type: String, required: false},
    user_type: { type: String, required: false},
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
);

export const UserModel = model<User>("User", schema);
