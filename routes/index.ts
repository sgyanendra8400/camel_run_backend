export { };
const route = require('express').Router();
route.use('/user', require('./users.ts'));
route.use('/user', require('./nfts.ts'));
module.exports = route;
