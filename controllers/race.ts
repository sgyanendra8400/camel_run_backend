import { RaceModel } from "../models/race";
import moment from "moment";
import isEmpty from "../validation/is-empty";
import {
  getDatabase,
  ref,
  onChildAdded,
  onChildRemoved,
  off,
  push,
  set,
  update,
  onValue,
} from "firebase/database";
import { initializeApp, getApp, getApps } from "firebase/app";
var Countdown = require("countdown-js");
const firebaseConfig = {
  apiKey: "AIzaSyAJoOm3k--r8mb4b16-kvtFB8e7WqmsG_U",
  authDomain: "camelrun-3efc7.firebaseapp.com",
  databaseURL: "https://camelrun-3efc7-default-rtdb.firebaseio.com",
  projectId: "camelrun-3efc7",
  storageBucket: "camelrun-3efc7.appspot.com",
  messagingSenderId: "895810043625",
  appId: "1:895810043625:web:ab9b5bdd1388a74806ba78",
  measurementId: "G-J117GZGGWF",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let messagesRef = ref(database, "/");
async function createRace() {
  try {
    // const { title, race_time, time_counter, active } = data;

    const CAMEL_RACE = [
      {
        title: "Neo Dubai",
        race_time: new Date(Date.now() + 1 * 60 * 1000).toLocaleTimeString(),
        // time_counter: new Date(Date.now() + 1 * 60 * 1000),
        time_counter: 30,
      },
      {
        title: "Titan-10",
        race_time: new Date(Date.now() + 2 * 60 * 1000).toLocaleTimeString(),
        time_counter: 30, //new Date(Date.now() + (2 * 60 * 1000)),
      },
      {
        title: "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
        time_counter: 30, // new Date(Date.now() + (3 * 60 * 1000)),
      },
    ];

    const randomRaceIndex = Math.floor(Math.random() * CAMEL_RACE.length);

    var race = await RaceModel.create(CAMEL_RACE[randomRaceIndex]);
    console.log(race, "raceeeeeeeeeeeeeeeeee");
    set(messagesRef, {
      race: [
        {
          title: race.title,
          race_time: race.race_time,
          time_counter: race.time_counter,
          gate_status: race.gate_status,
          participation_status: race.participation_status,
          predict_status: race.predict_status,
          live: race.live,
          active: race.active,
        },
      ],
    });
    var end = new Date(new Date().getTime() + 1000 * race.time_counter);
    var timer = Countdown.timer(
      end,
      function (timeLeft: any) {
        let data = {
          time_counter: `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`, // new Date(Date.now() + (3 * 60 * 1000)),
          // title: race?.title || "Galactica",
          // race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
          title: race.title,
          race_time: race.race_time,
          // time_counter: race.time_counter,
          gate_status: race.gate_status,
          participation_status: race.participation_status,
          predict_status: race.predict_status,
          live: race.live,
          active: race.active,
        };
        update(messagesRef, { race: [data] });
      },
      async function () {
        race = await updateRaceById(race.id, { participation: true });
        var end = new Date(new Date().getTime() + 1000 * race.time_counter);
        var timer = Countdown.timer(
          end,
          function (timeLeft: any) {
            let data = {
              time_counter: `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`, // new Date(Date.now() + (3 * 60 * 1000)),
              // title: race?.title || "Galactica",
              // race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
              title: race.title,
              race_time: race.race_time,
              // time_counter: race.time_counter,
              gate_status: race.gate_status,
              participation_status: race.participation_status,
              predict_status: race.predict_status,
              live: race.live,
              active: race.active,
            };
            update(messagesRef, { race: [data] });
          },
         async function () {
             race = await updateRaceById(race.id, { prediction: true });
            update(messagesRef, { race: [race] });

          }
        );
      }
    );
    return race;
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
        createRace();
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
