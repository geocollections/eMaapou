import { isEmpty } from 'lodash'

export default ($axios) => ({
  async getResourceList(
    resource,
    { defaultParams, queryFields, search, ...options }
  ) {
    if (options.isValid) {
      return {
        items: [],
        count: 0,
      }
    }
    let params = {
      ...defaultParams,
      q: isEmpty(search) ? '*' : `${search}`,
      start: (options.page - 1) * options.itemsPerPage,
      rows: options.itemsPerPage,
    }

    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `${queryFields[field]()} desc`
        return `${queryFields[field]()} asc`
      })

      params = {
        ...params,
        sort: orderBy.join(','),
      }
    }
    const response = await $axios.$get(`solr/${resource}`, { params })

    return {
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(`solr/${resource}`, {
      params: { ...countParams, rows: 0 },
    })
    return {
      count: response.count,
    }
  },
})
