import { LiveRaceModel } from "../models/liveRace";
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
    let startTime = moment().format('HH:mm:ss');

    const CAMEL_RACE = [
      {
        title: "Neo Dubai",
        race_time: new Date(Date.now() + 1 * 60 * 2000).toLocaleTimeString(),
        // time_counter: new Date(Date.now() + 1 * 60 * 1000),
        time_counter: 30,
        time:moment(startTime ,'HH:mm:ss a').add(2,'minutes').format('HH:mm:ss a'),
        image:"https://came-run.s3.ap-south-1.amazonaws.com/racetrackimages/Resized/MegaCity1.png"
      },
      {
        title: "Titan-10",
        race_time: new Date(Date.now() + 2 * 60 * 3000).toLocaleTimeString(),
        time_counter: 30, //new Date(Date.now() + (2 * 60 * 1000)),
        time:moment(startTime ,'HH:mm:ss a').add(2,'minutes').format('HH:mm:ss a'),
        image:"https://came-run.s3.ap-south-1.amazonaws.com/racetrackimages/Resized/Titan-10.png"
      },
      {
        title: "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
        time_counter: 30, // new Date(Date.now() + (3 * 60 * 1000)),
        time:moment(startTime ,'HH:mm:ss a').add(2,'minutes').format('HH:mm:ss a'),
        image:"https://came-run.s3.ap-south-1.amazonaws.com/racetrackimages/Resized/Galactica.png"
      },
    ];

    const randomRaceIndex = Math.floor(Math.random() * CAMEL_RACE.length);

    var race = await LiveRaceModel.create(CAMEL_RACE[randomRaceIndex]);

  
    return race;
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

    const count = await LiveRaceModel.count(query);
    races = await LiveRaceModel.find(query)
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
    const race: any = await LiveRaceModel.findById(id);

    return race;
  } catch (err) {
    throw err;
  }
}

async function updateRaceById(id: string,  data: any) {
  try {
    const race: any = await LiveRaceModel.findById(id);
    console.log(data, "datadata");
    if (race && data) {
      if (data?.participation) {
        race.participation_status = true;
      } else if (data?.prediction) {
        race.participation_status = false;
        race.predict_status = true;
        race.time = data?.time
        // createRace()
      } else if (data?.live) {
        race.participation_status = false;
        race.predict_status = false;
        race.live = true;
        race.time = data?.time

      } else if (data?.race) {

        const race: any = await LiveRaceModel.remove({id:id});
console.log(race,"raceracerace")
        // race.participation_status = false;
        // race.predict_status = false;
        // race.live = false;
        // race.active = false;
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
