export { };
const route = require('express').Router();
route.use('/user', require('./users.ts'));
module.exports = route;
