import { MahaliyatModel } from "../models/mahaliyat";
import moment from "moment";
import isEmpty from "../validation/is-empty";
import { async } from "@firebase/util";

async function create(data: any) {
  try {
    let result: any = null;
    if (data?.length) {
      for (let i = 0; i < data?.length; i++) {
        result = await MahaliyatModel.create(data[i]);
      }
    } else {
      result = await MahaliyatModel.create(data);
    }
    return result;
  } catch (err) {
    throw err;
  }
}

async function fetch(
  pageSize: number,
  page: number,
  pagination: boolean,
  bloodline: any
) {
  try {
    let data = null;
    let query: any = {};
    const bloodlineValue =
      bloodline === "Omania (Oman)"
        ? "OmaniaSpecial"
        : bloodline === "Hainiyat (Saudi Arabia)"
        ? "HainiyatSpecial"
        : bloodline === "Mahaliyat (UAE)"
        ? "MahaliyatSpecial"
        : "All";
    const bloodlineFilter = bloodline && bloodline !=="All"
      ? {
          attributes: {
            $elemMatch: { trait_type: "bloodline", value: bloodlineValue },
          },
        }
      : {};
    const count = await MahaliyatModel.count(bloodlineFilter);
    console.log(bloodlineFilter, "hhhhhhhhhhhhhhhhhhhhhh");
    data = await MahaliyatModel.find(bloodlineFilter)

      .limit(pageSize)
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1));
    if (pagination) {
      return {
        isSuccess: true,
        data: data,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      };
    } else {
      return {
        isSuccess: true,
        data: data,
        count,
      };
    }
  } catch (err) {
    throw err;
  }
}

async function fetchById(id: string) {
  try {
    const user: any = await MahaliyatModel.findById(id);
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  create,
  fetch,
  fetchById,
};
