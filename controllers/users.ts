import { UserModel } from "../models/users";

async function createUser(data: any) {
  try {
    const {
      name,
      last_name,
      password,
      wallet_data_bep2,
      user_type,
      email,
      no_of_nfts_owned,
      nfts_token_id,
      wallet,
      winnings,
      lossings,
      active,
    } = data;
    const user = await UserModel.create({
      name,
      last_name,
      password,
      wallet_data_bep2,
      user_type,
      email,
      no_of_nfts_owned,
      nfts_token_id,
      wallet,
      winnings,
      lossings,
      active,
    });
    return user;
  } catch (err) {
    throw err;
  }
}

async function fetchUsers(pageSize: number, page: number, pagination: boolean) {
  try {

    let users = null;
    const dataAndTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });
    let query: any = {};

    const todayDate = dataAndTime.split(",")[0];

    const count = await UserModel.count(query);
    users = await UserModel.find(query)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1));

    if (pagination) {
      return {
        isSuccess: true,
        users: users,
        page,
        pages: Math.ceil(count / pageSize),
        count,
      };
    } else {
      return {
        isSuccess: true,
        users: users,
        count,
      };
    }
  } catch (err) {
    throw err;
  }
}
async function fetchUserByEmail(email: string) {
  try {
    const users = await UserModel.find({ email: email });
    return users;
  } catch (err) {
    throw err;
  }
}
async function fetchUserById(id: string) {
  try {
    const user: any = await UserModel.findById(id);

    return user;
  } catch (err) {
    throw err;
  }
}

async function updateUserById(id: string, data: any) {
  try {
    const user: any = await UserModel.findById(id);
    if (user && data) {
      if (data?.updatedSize) {
        user.size = user.size?.map((item: any) => {
          if (item.category == data.updatedSize?.category) {
            return { category: item.category, size: data.updatedSize.size };
          } else {
            return item;
          }
        });
      } else if (data.recentlyViewed) {
        let isAlreadyviewd = user?.recentlyViewed.some(
          (item: string) => item == data.recentlyViewed.toString()
        );
        if (!isAlreadyviewd) {
          if (user?.recentlyViewed?.length) {
            user.recentlyViewed.push(data.recentlyViewed);
          } else {
            user.recentlyViewed = data.recentlyViewed;
          }
        }
      } else {
        Object.assign(user, data);
        user.profileUpdate = true;
      }
      user.save();
    }
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  fetchUsers,
  updateUserById,
  fetchUserById,
  fetchUserByEmail,
};
