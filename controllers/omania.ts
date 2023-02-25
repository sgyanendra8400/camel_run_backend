import { OmaniaModel } from "../models/omania";
import moment from "moment";
import isEmpty from "../validation/is-empty";

async function create(data: any) {
  try {
    let result: any = null;
    if (data?.length) {
      for (let i = 0; i < data?.length; i++) {
        result = await OmaniaModel.create(data[i]);
      }
    } else {
      result = await OmaniaModel.create(data);
    }
    return result;
  } catch (err) {
    throw err;
  }
}

async function fetch(pageSize: number, page: number, pagination: boolean) {
  try {
    let data = null;
    let query: any = {};
    const count = await OmaniaModel.count(query);
    data = await OmaniaModel.find(query)
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
    const user: any = await OmaniaModel.findById(id);
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
