import { Schema, model, ObjectId } from "mongoose";
const bcrypt = require("bcryptjs");

interface User {
  name: string;
  last_name: string;
  password: string;
  wallet_data_bep2: string;
  user_type: string;
  dob: string;
  confirm_correctness: boolean;
  telegram: string;
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
    name: { type: String, required: false },
    last_name: { type: String, required: false },
    password: { type: String, required: false },
    wallet_data_bep2: { type: String, required: false },
    user_type: { type: String, required: false },
    dob: { type: String, required: false },
    confirm_correctness: { type: Boolean, required: false },
    email: { type: String, required: false },
    no_of_nfts_owned: { type: Number, default: 0, required: false },
    nfts_token_id: [{ type: String, required: false }],
    wallet: { type: String, required: false },
    winnings: { type: Number, default: 0, required: false },
    lossings: { type: Number, default: 0, required: false },
    active: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export const UserModel = model<User>("User", schema);
