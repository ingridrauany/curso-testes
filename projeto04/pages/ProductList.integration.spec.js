import { mount } from '@vue/test-utils'
import axios from 'axios'
import Vue from 'vue'
import ProductList from '.'
import ProductCard from '@/components/ProductCard'
import Search from '@/components/Search'
import { makeServer } from '@/miragejs/server'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  const getProducts = (quantity = 10, overrides = []) => {
    let overrideList = []
    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      )
    }
    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ]

    return products
  }

  const mountProductList = async (
    quantity = 0,
    overrides = [],
    shouldReject = false
  ) => {
    const products = getProducts(quantity, overrides)

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('Error')))
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }))
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    await Vue.nextTick()

    return { wrapper, products }
  }

  it('Should mount the component', async () => {
    const { wrapper } = await mountProductList()
    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the Search component as child', async () => {
    const { wrapper } = await mountProductList()
    expect(wrapper.findComponent(Search)).toBeDefined()
  })

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/products')
  })

  it('should mount the ProductCard 10 times as component child', async () => {
    const { wrapper } = await mountProductList(10, [])

    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(10)
  })

  it('should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList(0, [], true)

    expect(wrapper.text()).toContain('Problemas ao carregar lista')
  })

  it('should filter the product list when a search is performed', async () => {
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
      { title: 'Meu outro relógio amado' },
    ])

    const search = wrapper.findComponent(Search)
    await search.find('input[type="search"]').setValue('relógio')
    await search.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('relógio')
    expect(cards).toHaveLength(2)
  })
})
