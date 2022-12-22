import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";

const route = Router();
const { create, fetch, fetchById } = require("../controllers/hainiyat.ts");
import isEmpty from "../validation/is-empty";

route.get("/", async (req: Request, res: Response) => {
  const {
    query: { pageSize, pageNumber, pagination },
  } = req;
  let hainiyat = null;

  const pageSizeNext = Number(pageSize) || 3;
  const page = Number(pageNumber) || 1;
  hainiyat = await fetch(pageSizeNext, page, pagination);

  if (hainiyat.isSuccess && hainiyat.data.length) {
    res.status(200).json({
      status: 1,
      msg: "Race Found!",
      count: hainiyat.count,
      page: hainiyat.page,
      pages: hainiyat.pages,
      data: hainiyat.data,
    });
  } else {
    res.status(200).json({
      status: 0,
      count: hainiyat.count,
      msg: "Data Not Found!",
    });
  }
});

route.get("/:id", async (req: Request, res: Response) => {
  try {
    const hainiyat = await fetchById(req.params.id);
    res.status(200).json({
      isSuccess: true,
      msg: "Data Found!",
      data: hainiyat,
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
        create(req.body);
        res.status(200).json({ status: 1, msg: "Data created!" });
      }
    } catch (err) {
      throw err;
    }
  }
});

module.exports = route;
