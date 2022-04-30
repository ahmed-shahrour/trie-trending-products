const moment = require('moment');

// min and max are in miliseconds since unix
// returns a random date between min and max
const getRandomDate = (min, max) =>
  moment(Math.floor(Math.random() * (max - min + 1)) + min).toDate();

module.exports = getRandomDate;
