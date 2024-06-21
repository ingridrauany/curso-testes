import { createServer } from 'miragejs'
import products from '../mocks/products.json'

export const makeServer = ({ environment = 'development' } = {}) => {
  return createServer({
    environment,
    routes() {
      this.namespace = 'api'
      this.get('products', () => ({
        products,
      }))
    },
  })
}
