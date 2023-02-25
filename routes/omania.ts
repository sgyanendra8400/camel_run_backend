import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";

const route = Router();
const { create, fetch, fetchById } = require("../controllers/omania.ts");
import isEmpty from "../validation/is-empty";

route.get("/", async (req: Request, res: Response) => {
  const {
    query: { pageSize, pageNumber, pagination },
  } = req;
  let omania = null;

  const pageSizeNext = Number(pageSize) || 3;
  const page = Number(pageNumber) || 1;
  omania = await fetch(pageSizeNext, page, pagination);

  if (omania.isSuccess && omania.data.length) {
    res.status(200).json({
      status: 1,
      msg: "Race Found!",
      count: omania.count,
      page: omania.page,
      pages: omania.pages,
      data: omania.data,
    });
  } else {
    res.status(200).json({
      status: 0,
      count: omania.count,
      msg: "Data Not Found!",
    });
  }
});

route.get("/:id", async (req: Request, res: Response) => {
  try {
    const omania = await fetchById(req.params.id);
    res.status(200).json({
      isSuccess: true,
      msg: "Data Found!",
      data: omania,
    });
  } catch (err) {
    throw err;
  }
});

route.post("/", async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401).json({ errors: errors.array() });
  } else {
    try {
      if (isEmpty(req?.body)) {
        res.status(200).json({ status: 0, msg: "some inputs are required!" });
      } else {
        const response = await  create(req.body);
       if(!isEmpty(response)){
         res.status(200).json({ status: 1, msg: "Data created!" });
       }else{
        res.status(400).json({ status: 0, msg: "Data Not created!" });

       }
      }
    } catch (err) {
      throw err;
    }
  }
});

module.exports = route;
