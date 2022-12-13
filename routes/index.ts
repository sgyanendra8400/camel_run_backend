export { };
const route = require('express').Router();
route.use('/user', require('./users.ts'));
route.use('/race', require('./race.ts'));
module.exports = route;
