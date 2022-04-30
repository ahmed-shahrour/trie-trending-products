const moment = require('moment');
const Order = require('../models/order');

// Create 10 buckets by using a conditional expression to group the documents by the time_heuristic field.
const time_heuristic = {
  $cond: [
    {
      $gte: ['$most_recent_time', moment().subtract(0.25, 'hours').toDate()],
    },
    0,
    {
      $cond: [
        {
          $gte: ['$most_recent_time', moment().subtract(0.5, 'hours').toDate()],
        },
        1,
        {
          $cond: [
            {
              $gte: [
                '$most_recent_time',
                moment().subtract(1, 'hours').toDate(),
              ],
            },
            2,
            {
              $cond: [
                {
                  $gte: [
                    '$most_recent_time',
                    moment().subtract(2, 'hours').toDate(),
                  ],
                },
                3,
                {
                  $cond: [
                    {
                      $gte: [
                        '$most_recent_time',
                        moment().subtract(4, 'hours').toDate(),
                      ],
                    },
                    4,
                    {
                      $cond: [
                        {
                          $gte: [
                            '$most_recent_time',
                            moment().subtract(8, 'hours').toDate(),
                          ],
                        },
                        5,
                        {
                          $cond: [
                            {
                              $gte: [
                                '$most_recent_time',
                                moment().subtract(16, 'hours').toDate(),
                              ],
                            },
                            6,
                            {
                              $cond: [
                                {
                                  $gte: [
                                    '$most_recent_time',
                                    moment().subtract(32, 'hours').toDate(),
                                  ],
                                },
                                7,
                                8,
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// This is where the aggregation pipeline is defined.
// The aggregation pipeline is an array of aggregation operations.
const createTrendingProductsMaterialView = async () => {
  await Order.aggregate([
    // Filter the data between the 48 hours before the current time.
    {
      $match: {
        order_time: {
          $gte: moment().subtract(2, 'days').toDate(),
          $lte: moment().toDate(),
        },
      },
    },
    // Group by the data by the product and the restaurant name
    // to get the most recent time for each product and restaurant and the sum of product quantity.
    {
      $group: {
        _id: {
          product_name: '$product_name',
          restaurant_name: '$restaurant_name',
        },
        most_recent_quantity: { $sum: '$product_quantity' },
        most_recent_time: { $max: '$order_time' },
      },
    },
    // Add the time_heuristic field to the documents.
    {
      $project: {
        _id: 1,
        most_recent_quantity: 1,
        most_recent_time: 1,
        time_heuristic,
      },
    },
    // sort by the time_heuristic and then by the most_recent_quantity
    {
      $sort: {
        time_heuristic: 1,
        most_recent_quantity: -1,
      },
    },
    // finally create a material view of the aggregation pipeline to trending_products
    {
      $merge: { into: 'trending_products' },
    },
  ]);
};

module.exports = createTrendingProductsMaterialView;
