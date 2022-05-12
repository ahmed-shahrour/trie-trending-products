import api from '../util/api'

class ProductService {
  getTrendingProducts(page, limit, refresh, search = null) {
    return api.get('/products/trending', { params: { page, limit, refresh, search } });
  }
  getSuggestions(prefix) {
    return api.get('/products/suggestions', { params: { prefix } });
  }
}

export default new ProductService();