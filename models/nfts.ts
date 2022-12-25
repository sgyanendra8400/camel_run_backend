import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";
interface Nft {
  name: string;
  attributes:Array<string>;
}
const schema = new Schema<Nft>(
  {
    name: { type: String, required: false},
    attributes: [{type: String,required: false}],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
export const UserModel = model<Nft>("Nft", schema);
