import { isEmpty } from 'lodash'

export default ($axios) => ({
  async getResourceList(resource, options) {
    if (options.isValid) {
      return { items: [], count: 0 }
    }

    let params, multiSearch
    if (!isEmpty(options.search))
      multiSearch = `value:${options.search};fields:${Object.values(
        options.sortValues
      )
        .map((field) => field())
        .join()};lookuptype:icontains`

    if (isEmpty(options.sortBy)) {
      params = {
        ...options.defaultParams,
        multi_search: multiSearch,
        paginate_by: options.itemsPerPage,
        page: options.page,
      }
    } else {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `-${options.sortValues[field]()}`
        return options.sortValues[field]()
      })

      params = {
        ...options.defaultParams,
        multi_search: multiSearch,
        paginate_by: options.itemsPerPage,
        page: options.page,
        order_by: orderBy.join(','),
      }
    }
    const response = await $axios.$get(resource, { params })

    return {
      items: response.results,
      count: response.count,
    }
  },
})
