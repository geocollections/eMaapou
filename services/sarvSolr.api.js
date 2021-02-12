import { isEmpty } from 'lodash'

export default ($axios) => ({
  async getResourceList(resource, options) {
    if (options.isValid) {
      return {
        items: [],
        count: 0,
      }
    }

    const start = (options.page - 1) * options.itemsPerPage

    let params
    if (isEmpty(options.sortBy)) {
      params = {
        ...options.defaultParams,
        q: isEmpty(options.search) ? '*' : `${options.search}`,
        rows: options.itemsPerPage,
        start,
      }
    } else {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `${options.sortValues[field]()} desc`
        return `${options.sortValues[field]()} asc`
      })

      params = {
        ...options.defaultParams,
        q: isEmpty(options.search) ? '*' : `${options.search}`,
        rows: options.itemsPerPage,
        start,
        sort: orderBy.join(','),
      }
    }
    const response = await $axios.$get(`solr/${resource}`, { params })

    return {
      items: response.results,
      count: response.count,
    }
  },
})
