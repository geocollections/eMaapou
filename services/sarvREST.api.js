import { isEmpty } from 'lodash'

export default ($axios) => ({
  async getResourceList(resource, options) {
    if (options.isValid) {
      return { items: [], count: 0 }
    }

    let multiSearch
    if (!isEmpty(options.search))
      multiSearch = `value:${options.search};fields:${Object.values(
        options.queryFields
      )
        .map((field) => field())
        .join()};lookuptype:icontains`

    let params = {
      ...options.defaultParams,
      multi_search: multiSearch,
      paginate_by: options.itemsPerPage,
      page: options.page,
    }

    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy.map((field, i) => {
        if (options.sortDesc[i]) return `-${options.queryFields[field]()}`
        return options.queryFields[field]()
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
})
