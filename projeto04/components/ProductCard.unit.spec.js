import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'

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
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
      },
    })

    return {
      wrapper,
      product,
    }
  }

  it('should mount the component', () => {
    const { wrapper } = mounProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$23.00')
  })

  it('should emit the event addToCart with product object when button gets clicked', async () => {
    const { wrapper, product } = mounProductCard()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().addToCart).toBeTruthy()
    expect(wrapper.emitted().addToCart.length).toBe(1)
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }])
  })
})
