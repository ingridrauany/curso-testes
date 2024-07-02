import { mount } from '@vue/test-utils'
import Search from '@/components/Search'

describe('Search', () => {
  it('should mount the component', () => {
    const wrapper = mount(Search)
    expect(wrapper.vm).toBeDefined()
  })

  it('should emit serach event when form is submitted', async () => {
    const wrapper = mount(Search)
    const searchTerm = 'some search term'

    await wrapper.find('input[type="search"]').setValue(searchTerm)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted().doSearch).toBeTruthy()
    expect(wrapper.emitted().doSearch.length).toBe(1)
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term: searchTerm }])
  })

  it('should trigger search event when search input is cleared', async () => {
    const wrapper = mount(Search)

    const searchTerm = 'some search term'
    const input = wrapper.find('input[type="search"]')
    await input.setValue(searchTerm)
    await input.setValue('')

    expect(wrapper.emitted().doSearch).toBeTruthy()
    expect(wrapper.emitted().doSearch.length).toBe(1)
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term: '' }])
  })
})
