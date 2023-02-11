import { Schema, model, ObjectId } from "mongoose";
import mongoose from "mongoose";

interface LiveRace {
  title: string;
  race_time: string;
  time:string,
  image:string,
  active: boolean;
}

const schema = new Schema<LiveRace>(
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

export const LiveRaceModel = model<LiveRace>("LiveRace", schema);
