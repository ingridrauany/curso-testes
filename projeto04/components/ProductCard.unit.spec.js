import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('ProductCard', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  const mounProductCard = () => {
    const product = server.create('product', {
      title: 'Relógio bonito',
      price: '23.00',
      image:
        'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
    })
    const cartManager = new CartManager()
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
      },
      mocks: {
        $cart: cartManager,
      },
    })

    return {
      wrapper,
      product,
      cartManager,
    }
  }

  it('should mount the component', () => {
    const { wrapper } = mounProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$23.00')
  })

  it('should add item to cart on buttonClick', async () => {
    const { wrapper, cartManager, product } = mounProductCard()
    const spy = jest.spyOn(cartManager, 'open')
    const spyProduct = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spyProduct).toHaveBeenCalledTimes(1)
    expect(spyProduct).toHaveBeenCalledWith(product)
  })
})
