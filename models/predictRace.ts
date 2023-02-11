import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";

interface PredictRace {
  title: string;
  race_time: string;
  time:string,
  image:string,
  active: boolean;
}

const schema = new Schema<PredictRace>(
  {
    title: { type: String, required: false },
    race_time: { type: String, required: false },
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

export const PredictRaceModel = model<PredictRace>("PredictRace", schema);
