import { isEmpty } from 'lodash'

export default ($axios) => ({
  async getResource(resource, id) {
    const response = await $axios.get(`${resource}/${id}`)
    return response.data
  },

  async getResourceList(
    resource,
    { defaultParams, queryFields, search, ...options }
  ) {
    if (options.isValid) {
      return { items: [], count: 0 }
    }

    let multiSearch
    if (!isEmpty(options.search))
      multiSearch = `value:${search};fields:${Object.values(queryFields)
        .map((field) => field())
        .join()};lookuptype:icontains`

    let params = {
      ...defaultParams,
      multi_search: multiSearch,
      paginate_by: options.itemsPerPage,
      page: options.page,
    }

    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `-${queryFields[field]()}`
        return queryFields[field]()
      })

      params = {
        ...params,
        order_by: orderBy.join(','),
      }
    }
    const response = await $axios.$get(resource, { params })

    return {
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(resource, {
      params: { ...countParams, page: 1, paginate_by: 1, fields: 'id' },
    })
    return {
      count: response.count,
    }
  },
})
