const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { UserModel } = require("../models/users");

module.exports = function (passport) {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      function (jwt_payload, CallBack) {
        UserModel.findOne({ email: jwt_payload.email }, function (err, user) {
          if (err) {
            return CallBack(err);
          }
          if (user) {
            CallBack(null, user);
          } else {
            CallBack(null, false);
          }
        });
      }
    )
  );
};
