const fs = require('fs');
const db = require('../config/db');
const dotenv = require('dotenv');
const moment = require('moment');
const colors = require('colors');

dotenv.config();

const Order = require('../models/order');
const getRandomDate = require('./getRandomDate');

// Connect to Mongo Database
db().then();

// get the json file
const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/../_seedData/orders.json`, 'utf8')
);

// Create a new key called order_time that is a random datetime within 48 hours of the current time for each order_id
const min = moment().subtract(2, 'days').valueOf();
const max = moment().valueOf();
let orderIds = {};
orders.forEach((order) => {
  if (!orderIds.hasOwnProperty(order.order_id)) {
    order.order_time = getRandomDate(min, max);
    orderIds[order.order_id] = order.order_time;
  }
  order.order_time = orderIds[order.order_id];
});

// This imports the orders data into the database
const importData = async () => {
  try {
    await Order.insertMany(orders);
    console.log(`Data successfully imported`.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// This drops the orders data from the database
const deleteData = async () => {
  try {
    await Order.deleteMany();
    console.log(`Data successfully deleted`.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// This handles the arguments passed in the command line
async function processData(arg) {
  switch (arg) {
    case '--import':
      await importData();
      break;
    case '--delete':
      await deleteData();
      break;
    default:
      console.log(
        `${arg} is not a valid option. Please use one of the following: --import or --delete`
      );
  }
}

processData(process.argv[2]);
