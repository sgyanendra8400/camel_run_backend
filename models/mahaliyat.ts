import { Schema, model } from "mongoose";

interface Mahaliyat {
  name: string;
  bloodline: string;
  image: string;
  url: string;
  attributes: Array<string>;
  active: boolean;
}
const schema = new Schema<Mahaliyat>(
  {
    name: { type: String, required: false },
    bloodline: { type: String, required: false },
    image: { type: String, required: false },
    url: { type: String, required: false },
    attributes: [
      {
        trait_type: {
          type: String,
          required: false,
        },
        value: {
          type: String,
          required: false,
        },
      },
    ],
    active: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const MahaliyatModel = model<Mahaliyat>("nfts", schema);
