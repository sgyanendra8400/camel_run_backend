import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";

interface User {
  userId: string;
  name: string;
  email: string;
  active: boolean;
}

const schema = new Schema<User>(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const UserModel = model<User>("User", schema);
