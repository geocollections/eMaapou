import { isEmpty } from 'lodash'

const getPaginationParams = (options) => {
  if (options?.page && options?.itemsPerPage) {
    return {
      limit: options.itemsPerPage,
      offset: (options.page - 1) * options.itemsPerPage,
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

      return { ordering: orderBy.join(',') }
    }
  }
  return null
}

export default ($axios) => ({
  async getResource(resource, id, options = {}) {
    const response = await $axios.get(`${resource}/${id}/`, options)
    return response.data
  },
  async getResourceList(
    resource,
    { defaultParams, queryFields, search, options, isValid }
  ) {
    if (isValid) {
      return { items: [], count: 0 }
    }

    let multiSearch
    let multiSearchFields
    if (!isEmpty(search)) {
      multiSearch = search
      multiSearchFields = Object.values(queryFields)
        .map((field) => field)
        .join()
    }

    const params = {
      ...defaultParams,
      search: multiSearch,
      search_fields: multiSearchFields,
      ...getPaginationParams(options),
      ...getSortByParams(options, queryFields),
    }

    const response = await $axios.$get(`${resource}/`, { params })

    return {
      next: response.next,
      previous: response.previous,
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(resource, countParams, fields = 'id') {
    const response = await $axios.$get(`${resource}/`, {
      params: { ...countParams, page: 1, paginate_by: 1, fields },
    })
    return {
      count: response.count,
    }
  },
})
