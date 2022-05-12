const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrendingProductSchema = new Schema({
  _id: { type: Object, required: true },
  most_recent_quantity: { type: Number, min: 1, required: true },
  most_recent_time: { type: Date, required: true },
});

TrendingProductSchema.index({ "_id.product_name": 'text' });


module.exports = mongoose.model(
  'TrendingProduct',
  TrendingProductSchema,
  'trending_products'
);

