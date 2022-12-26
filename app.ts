import express from "express";
import firebaseApi from "./controllers/firebase";
const app = express();
require("dotenv").config();
const log = require("debug")("app:run");
const mongoose = require("mongoose");
const routes = require("./routes");
var bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const { ConnetDB } = require("./models/db");
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));
ConnetDB();
var corsOptions = {
  origin: function (Origin: string, callback: any) {
    callback(null, true);
  },
  credentials: true,
};

require("./config/passport")(passport);
app.use(passport.initialize());

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", require("./routes"));
// firebaseApi();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
} else {
  app.get("/", (req: any, res: any) => {
    res.sendFile(__dirname + "/index.html");
    // res.send(`Api is running fast ${process.env.PORT}! `);
  });
}
async function run() {
  app.listen(`${process.env.PORT}`, () => {
    console.log(
      "\x1b[34m",
      "📗",
      `Camel Server is running on ${process.env.NODE_ENV} mode...`
    );
  });
}
run();
