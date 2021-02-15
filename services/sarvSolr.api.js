import { isEmpty } from 'lodash'

const getPaginationParams = (options) => {
  if (options?.page && options?.itemsPerPage) {
    return {
      start: (options.page - 1) * options.itemsPerPage,
      rows: options.itemsPerPage,
    }
  }
  return null
}

const getSortByParams = (options, queryFields) => {
  if (options?.sortBy && options?.sortDesc) {
    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `${queryFields[field]()} desc`
        return `${queryFields[field]()} asc`
      })

      return { sort: orderBy.join(',') }
    }
  }
  return null
}

export default ($axios) => ({
  async getResourceList(
    resource,
    { defaultParams, queryFields, search, tableOptions, isValid, ...options }
  ) {
    if (isValid) {
      return {
        items: [],
        count: 0,
      }
    }

    const params = {
      ...defaultParams,
      q: isEmpty(search) ? '*' : `${search}`,
      ...getPaginationParams(tableOptions),
      ...getSortByParams(tableOptions, queryFields),
    }

    const response = await $axios.$get(`solr/${resource}/`, { params })

    return {
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(`solr/${resource}/`, {
      params: { ...countParams, rows: 0 },
    })
    return {
      count: response.count,
    }
  },
})
