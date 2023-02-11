import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";

interface Race {
  title: string;
  race_time: string;
  time_counter: number;
  participation_status:boolean,
  gate_status:boolean,
  predict_status:boolean,
  live:boolean,
  time:string,
  image:string,
  active: boolean;
}

const schema = new Schema<Race>(
  {
    title: { type: String, required: false },
    race_time: { type: String, required: false },
    time_counter: { type: Number, default: 0, required: false },
    gate_status: { type: Boolean, required: false, default: false },
    participation_status: { type: Boolean, required: false, default: false },
    predict_status: { type: Boolean, required: false, default: false },
    live: { type: Boolean, required: false, default: false },
    time: { type: String, required: false },
    image: { type: String, required: false },

    active: { type: Boolean, required: false, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const RaceModel = model<Race>("Race", schema);
