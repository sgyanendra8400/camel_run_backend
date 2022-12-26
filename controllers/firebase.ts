// import { getAnalytics } from "firebase/analytics";
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
import { RaceModel } from "../models/race";
var Countdown = require("countdown-js");

// setup end datetime for timer
var ten_days = 1000 * 60 * 60 * 24 * 10;

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
// const analytics = getAnalytics(app);
async function firebaseApi() {
  const database = getDatabase(app);
  let messagesRef = ref(database, "/");
  var count = 1;
  // const starCountRef = ref(db, 'posts/' + postId + '/starCount');
  count++;
  const CAMEL_RACE = [
    {
      time_counter: 20,
      title: "Neo Dubai",
      race_time: new Date(Date.now() + 1 * 60 * 1000).toLocaleTimeString(),
    },
    {
      time_counter: 20, //new Date(Date.now() + (2 * 60 * 1000)),
      title: "Titan-10",
      race_time: new Date(Date.now() + 2 * 60 * 1000).toLocaleTimeString(),
    },
    {
      time_counter: 20, // new Date(Date.now() + (3 * 60 * 1000)),
      title: "Galactica",
      race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
    },
  ];
  const randomRaceIndex = Math.floor(Math.random() * CAMEL_RACE.length);
  var end = new Date(new Date().getTime() + 1000 * 20);
  set(messagesRef, { race: CAMEL_RACE });
  var data: any = CAMEL_RACE;
  var currentRace = data[2];
  var end = new Date(new Date().getTime() + 1000 * currentRace.time_counter);
  var timer = Countdown.timer(
    end,
    function (timeLeft: any) {
      data[2] = {
        time_counter: `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`, // new Date(Date.now() + (3 * 60 * 1000)),
        title: currentRace?.title || "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
      };
      update(messagesRef, { race: data });
    },
    function () {
      console.log("Countdown Finished!");
    }
  );
  var currentRace = data[1];
  var end = new Date(new Date().getTime() + 1000 * currentRace.time_counter);
  var timer = Countdown.timer(
    end,
    function (timeLeft: any) {
      data[1] = {
        time_counter: `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`, // new Date(Date.now() + (3 * 60 * 1000)),
        title: currentRace?.title || "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
      };
      update(messagesRef, { race: data });
    },
    function () {
      console.log("Countdown Finished!");
    }
  );
  var currentRace = data[0];
  var end = new Date(new Date().getTime() + 1000 * currentRace.time_counter);
  var timer = Countdown.timer(
    end,
    function (timeLeft: any) {
      data[0] = {
        time_counter: `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`, // new Date(Date.now() + (3 * 60 * 1000)),
        title: currentRace?.title || "Galactica",
        race_time: new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(),
      };
      update(messagesRef, { race: data });
    },
    function () {
      console.log("Countdown Finished!");
    }
  );
  const user = await RaceModel.create(CAMEL_RACE[randomRaceIndex]);
  console.log(count);
  setInterval(function () {}, 1000);
  onChildAdded(messagesRef, (snapshot) => {
    // console.log(messagesRef, "messagesRefmessagesRef1");
    // count = count + 1;
    // setLiveViewData(count);
  });
  onChildRemoved(messagesRef, (snapshot) => {
    // console.log(messagesRef, "messagesRefmessagesRef");
  });
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data.race[2], "pprace");

    //     let messagesRef = ref(database, "/");
    //     var timer = Countdown.timer(end, function(timeLeft:any) {
    //         data.race[0].time_counter = `End in ${timeLeft.hours}h | ${timeLeft.minutes}m | ${timeLeft.seconds}s`;
    //         update(messagesRef,  data );
    //       }, function() {
    //         console.log("Countdown Finished!")
    //       })
    // setShowRace(data?.messageData)
    // updateStarCount(postElement, data);
  });
}
export default firebaseApi;
