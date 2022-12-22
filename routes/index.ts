export { };
const route = require('express').Router();
route.use('/user', require('./users.ts'));
route.use('/race', require('./race.ts'));
route.use('/omania', require('./omania.ts'));
route.use('/mahaliyat', require('./mahaliyat.ts'));
route.use('/hainiyat', require('./hainiyat.ts'));
module.exports = route;
