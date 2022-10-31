export { };
import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import passport from "passport";
import { UserModel } from "../models/users";

const route = Router();
const {
  createUser,
  fetchUsers,
  fetchUserByPhone,
  fetchUserById,
  updateUserById,
 
} = require("../controllers/users.ts");

import isEmpty from "../validation/is-empty";
import validateUserRegisterInput from "../validation/register-user";

const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const bcrypt = require("bcryptjs");
//access private
route.get("/", async (req: Request, res: Response) => {
  const {
    query: {
      pageSize,
      pageNumber,
      pagination,
    },
  } = req;
  let users = null;

  const pageSizeNext = Number(pageSize) || 10;
  const page = Number(pageNumber) || 1;
  users = await fetchUsers(
    pageSizeNext,
    page,
    pagination,
  );
  if (users.isSuccess && users.users.length) {
    res.status(200).json({
      isSuccess: users.isSuccess,
      msg: "User Found!",
      count: users.count,
      page: users.page,
      pages: users.pages,
      user: users.users,
    });
  } else {
    res.status(200).json({
      isSuccess: users.isSuccess,
      count: users.count,
      msg: "User Not Found!",
    });
  }
});

route.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await fetchUserById(req.params.id);
    res.status(200).json({
      isSuccess: true,
      msg: "User Found!",
      user: user,

    });
  } catch (err) {
    throw err;
  }
});




route.put(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  // validateUserRegisterInput,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
    } else {
      try {
        const user = await updateUserById(req.params.id, req.body);
        if (isEmpty(req.body)) {
          res.json({
            is_success: true,
            msg: "Please Fill the Required Field!",
          });
        } else {

          if (req.body.token) {
            const payload = {
              name: user.name,
              email: user.email,
              type: user.type,
            };
            jwt.sign(
              payload,
              config.secretOrKey,
              { expiresIn: 36000 },
              (err: any, token: any) => {
                if (!err) {
                  res.json({
                    is_success: true,
                    msg: "User Updated successfully",
                    token: "Bearer " + token,
                    user: payload,
                    userId: user._id,
                  });
                } else {
                  res.json({ msg: "Error generating token" });
                }
              }
            );
          } else {
            res.status(200).json({
              isSuccess: true,
              msg: "User Updated successfully",
              user: user,
            });
          }
        }
      } catch (err) {
        throw err;
      }
    }
  }
);



route.post(
  "/requestOtp",
  validateUserRegisterInput,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
    } else {
      try {
        const { phone } = req.body;
        const user = await fetchUserByPhone(phone);
          if (isEmpty(user)) {
            //sign up
            createUser("", "", "", phone, "", "", "", "");
            res.status(200).json({
              is_success: true,
              msg: "Otp send successfully",
            });
          } else {
            res.status(200).json({
              is_success: true,
              msg: "Otp send successfully",

            });
          }
       
      } catch (err) {
        throw err;
      }
    }
  }
);







module.exports = route;
