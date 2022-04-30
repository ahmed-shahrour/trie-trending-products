const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const OrderSchema = new Schema({
  order_id: { type: Number, required: true },
  order_quantity: { type: Number, min: 1, required: true },
  order_time: { type: Date, default: moment().toDate(), required: true },
  restaurant_name: { type: String, required: true },
  product_name: { type: String, required: true },
  product_quantity: { type: Number, min: 1, required: true },
  product_price: { type: Schema.Types.Decimal128, required: true },
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
