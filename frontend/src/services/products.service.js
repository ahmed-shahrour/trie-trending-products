import api from '../util/api'

class ProductService {
  getTrendingProducts(page, limit, refresh) {
    return api.get('/products/trending', { params: { page, limit, refresh } });
  }
}

export default new ProductService();