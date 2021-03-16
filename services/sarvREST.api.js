import { isEmpty } from 'lodash'

const getPaginationParams = (options) => {
  if (options?.page && options?.itemsPerPage) {
    return {
      paginate_by: options.itemsPerPage,
      page: options.page,
    }
  }
  return null
}

const getSortByParams = (options, queryFields) => {
  if (options?.sortBy && options?.sortDesc) {
    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `-${queryFields[field]}`
        return queryFields[field]
      })

      return { order_by: orderBy.join(',') }
    }
  }
  return null
}

export default ($axios) => ({
  async getResource(resource, id, options = {}) {
    const response = await $axios.get(`${resource}/${id}`, options)
    return response.data
  },
  async getResourceList(
    resource,
    { defaultParams, queryFields, search, tableOptions, isValid, ...options }
  ) {
    if (isValid) {
      return { items: [], count: 0 }
    }

    let multiSearch
    if (!isEmpty(search))
      multiSearch = `value:${search};fields:${Object.values(queryFields)
        .map((field) => field)
        .join()};lookuptype:icontains`

    const params = {
      ...defaultParams,
      multi_search: multiSearch,
      ...getPaginationParams(tableOptions),
      ...getSortByParams(tableOptions, queryFields),
    }

    const response = await $axios.$get(`${resource}/`, { params })

    return {
      page: response.page,
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(`${resource}/`, {
      params: { ...countParams, page: 1, paginate_by: 1, fields: 'id' },
    })
    return {
      count: response.count,
    }
  },
})
