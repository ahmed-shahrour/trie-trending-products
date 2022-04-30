const TrendingProduct = require('../models/trendingProduct');
const createTrendingProductsMaterialView = require('../util/createTrendingProductsMaterialView');

async function getTrendingProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const refresh = req.query.refresh;

    // This is very important to note. The materialized view is triggered to refresh by the refresh query parameter.
    // This is not good practice if you have multiple users accessing the database.
    // This is because the materialized view will be triggered multiple times.
    if (refresh) await createTrendingProductsMaterialView();

    // Pagination logic
    let trendingProducts = await TrendingProduct.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    // Count is used to calculate the total number of pages so that the pagination can be done in the frontend.
    const count = await TrendingProduct.countDocuments();

    return res.status(200).json({
      trendingProducts,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
}

const productController = {
  getTrendingProducts,
};

module.exports = productController;
