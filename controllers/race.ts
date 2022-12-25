import { RaceModel } from "../models/race";
import moment from "moment";
import isEmpty from "../validation/is-empty";

async function createRace() {
  try {
    // const { title, race_time, time_counter, active } = data;

    const CAMEL_RACE = [
      {
        title: "Neo Dubai",
        race_time: new Date(Date.now() + 1 * 60 * 1000).toLocaleTimeString(),
        time_counter: new Date(Date.now() + 1 * 60 * 1000),
      },
      {
        title: "Titan-10",
        race_time: new Date(Date.now() + 2 * 60 * 1000).toLocaleTimeString(),
        time_counter: new Date(Date.now() + 1 * 60 * 1000), //new Date(Date.now() + (2 * 60 * 1000)),
      },
      {
        title: "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
        time_counter: new Date(Date.now() + 1 * 60 * 1000), // new Date(Date.now() + (3 * 60 * 1000)),
      },
    ];

    const randomRaceIndex = Math.floor(Math.random() * CAMEL_RACE.length);
    console.log(
      randomRaceIndex,
      "randomRacerandomRace",
      new Date().toLocaleTimeString()
    );
    const user = await RaceModel.create(CAMEL_RACE[randomRaceIndex]);
    return user;
  } catch (err) {
    throw err;
  }
}

async function fetchRaces(
  pageSize: number,
  page: number,
  pagination: boolean,
  admin: boolean
) {
  try {
    let races: any = null;
    let admin_ = {};
    if (isEmpty(admin)) {
      admin_ = {
        active: true,
      };
    }
    let query: any = {};
    if (admin_) {
      query.$and = [];
      query.$and.push(admin_);
    }

    const count = await RaceModel.count(query);
    races = await RaceModel.find(query)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1));

    if (pagination) {
      return {
        status: true,
        races: races,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      };
    } else {
      return {
        status: true,
        race: races,
        count,
      };
    }
  } catch (err) {
    throw err;
  }
}

async function fetchRaceById(id: string) {
  try {
    const race: any = await RaceModel.findById(id);

    return race;
  } catch (err) {
    throw err;
  }
}

async function updateRaceById(id: string, data: any) {
  try {
    const race: any = await RaceModel.findById(id);
    if (race && data) {
      if (data?.participation) {
        race.participation_status = true;
      } else if (data?.prediction) {
        race.participation_status = false;
        race.predict_status = true;
      } else if (data?.live) {
        race.participation_status = false;
        race.predict_status = false;
        race.live = true;
      } else if (data?.race) {
        race.participation_status = false;
        race.predict_status = false;
        race.live = false;
        race.active = false;
        createRace()
      }
    }
    race.save();
    // createRace()
    // createRace()

    return race;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createRace,
  fetchRaces,
  updateRaceById,
  fetchRaceById,
};
