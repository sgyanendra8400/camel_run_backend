import { MahaliyatModel } from "../models/mahaliyat";
import moment from "moment";
import isEmpty from "../validation/is-empty";

async function create(data: any) {
  try {
    const result = await MahaliyatModel.create(data);
    return result;
  } catch (err) {
    throw err;
  }
}

async function fetch(pageSize: number, page: number, pagination: boolean) {
  try {
    let data = null;
    let query: any = {};
    const count = await MahaliyatModel.count(query);
    data = await MahaliyatModel.find(query)
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
