import api from '../util/api'

class ProductService {
  getTrendingProducts(page, limit, refresh) {
    return api.get('/products/trending', { params: { page, limit, refresh } });
  }
  getSuggestions(prefix) {
    return api.get('/products/suggestions', { params: { prefix } });
  }
}

export default new ProductService();