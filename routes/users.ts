export {};
import { Request, Response, Router } from "express";
import { validationResult } from "express-validator";
import passport from "passport";
import { UserModel } from "../models/users";

const route = Router();
const {
  createUser,
  fetchUsers,
  fetchUserByEmail,
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
    query: { pageSize, pageNumber, pagination },
  } = req;
  let users = null;

  const pageSizeNext = Number(pageSize) || 10;
  const page = Number(pageNumber) || 1;
  users = await fetchUsers(pageSizeNext, page, pagination);
  if (users.isSuccess && users.users.length) {
    res.status(200).json({
      status: 1,
      msg: "User Found!",
      count: users.count,
      page: users.page,
      pages: users.pages,
      user: users.users,
    });
  } else {
    res.status(200).json({
      status: 0,
      count: users.count,
      msg: "User Not Found!",
    });
  }
});

route.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await fetchUserById(req.params.id);
    res.status(200).json({
      status: 1,
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
            status: 0,
            msg: "Please Fill the Required Field!",
          });
        } else {
            res.status(200).json({
              isSuccess: true,
              msg: "User Updated successfully!",
              user: user,
            });
          }
        
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
      }
      const user = await fetchUserByEmail(req?.body?.email);
      if (isEmpty(user)) {
        createUser(req.body);
        res.status(200).json({ status: 1, msg: "user created!" });
      } else {
        res.status(200).json({ status: 0, msg: "user already exist!" });
      }
    } catch (err) {
      throw err;
    }
  }
});


route.post(
  "/login",
  // validateUserLoginInput,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
    } else {
      const {email, password } = req.body;
   
        const users = await fetchUserByEmail(email);
        console.log(users,'users')
        if (isEmpty(users)) {
          return   res.status(200).json({ status: 0, msg: "User Not Found!" });
        }
        const user = users[0];
        //Check Password
        bcrypt.compare(password, user.password).then((isMatch: Boolean) => {
          if (isMatch) {
            const payload = {
              userId: user._id,
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
                    status: 1,
                    msg: "Login Successfully",
                    token: "Bearer " + token,
                    user_id: user._id,
                    user: {
                      userId: user._id,
                      email: user.email,
                      type: "user",
                    },
                  });
                } else {
                  res.json({ msg: "Error generating token" });
                }
              }
            );
          } else {
            res.status(200).json({ status: 0, msg: "password Incorrect!" });          }
        });
      
    }
  }
);
module.exports = route;
