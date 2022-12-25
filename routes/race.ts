import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";

const route = Router();
const {
  createRace,
  fetchRaces,
  fetchRaceById,
  updateRaceById,
} = require("../controllers/race.ts");
import isEmpty from "../validation/is-empty";

const jwt = require("jsonwebtoken");
const config = require("../config/keys");
route.get("/", async (req: Request, res: Response) => {
  const {
    query: { pageSize, pageNumber, pagination },
  } = req;
  let race = null;

  const pageSizeNext = Number(pageSize) || 3;
  const page = Number(pageNumber) || 1;
  race = await fetchRaces(pageSizeNext, page, pagination);
  if (race.status && race.race.length) {
    res.status(200).json({
      status: 1,
      msg: "Race Found!",
      count: race.count,
      page: race.page,
      pages: race.pages,
      race: race.race,
    });
  } else {
    res.status(200).json({
      status: 0,
      count: race.count,
      msg: "Race Not Found!",
    });
  }
});

route.get("/:id", async (req: Request, res: Response) => {
  try {
    const Race = await fetchRaceById(req.params.id);
    res.status(200).json({
      isSuccess: true,
      msg: "Race Found!",
      Race: Race,
    });
  } catch (err) {
    throw err;
  }
});

route.put(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  // validateRaceRegisterInput,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
    } else {
      try {
        const Race = await updateRaceById(req.params.id, req.body);
        res.json({
            status: true,
            msg: "Race Updated successfully",
          });
      } catch (err) {
        throw err;
      }
    }
  }
);

route.post("/", async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401).json({ errors: errors.array() });
  } else {
    try {
      if (isEmpty(req?.body)) {
        res.status(200).json({ status: 0, msg: "some inputs are required!" });
      }else{

          createRace(req.body);
          res.status(200).json({ status: 1, msg: "Race created!" });
      }
    } catch (err) {
      throw err;
    }
  }
});

module.exports = route;
