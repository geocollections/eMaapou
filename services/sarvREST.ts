import type { NuxtAxiosInstance } from '@nuxtjs/axios'
import isEmpty from 'lodash/isEmpty'

import type { IOptions } from '.'

const getPaginationParams = (options: IOptions) => {
  if (!(options?.page && options?.itemsPerPage)) return null

  return {
    limit: options.itemsPerPage,
    offset: (options.page - 1) * options.itemsPerPage,
  }
}

const getSortByParams = (
  options: IOptions,
  fields: { [key: string]: string }
) => {
  if (!(options?.sortBy && options?.sortDesc)) return null

  const orderBy = options.sortBy.map((value, i) => {
    if (options.sortDesc?.[i]) return `-${fields[value]}`
    return fields[value]
  })
  return { ordering: orderBy.join(',') }
}

export default ($axios: NuxtAxiosInstance) => ({
  async getResource(resource: string, id: number, options = {}) {
    const response = await $axios.get(`${resource}/${id}/`, options)
    return response.data
  },
  async getResourceList(
    resource: string,
    {
      defaultParams = {},
      fields = {},
      search = null,
      options,
    }: {
      options: IOptions
      search?: string | null
      fields?: { [key: string]: string }
      defaultParams?: { [key: string]: any }
    }
  ) {
    let multiSearch
    let multiSearchFields
    if (!isEmpty(search)) {
      multiSearch = search
      multiSearchFields = Object.values(fields)
        .map((field) => field)
        .join()
    }

    const params = {
      ...defaultParams,
      search: multiSearch,
      search_fields: multiSearchFields,
      ...getPaginationParams(options),
      ...getSortByParams(options, fields),
    }

    const response = await $axios.$get(`${resource}/`, { params })

    return {
      next: response.next,
      previous: response.previous,
      items: response.results,
      count: response.count,
    }
  },

  async getResourceCount(
    resource: string,
    countParams: { [key: string]: any },
    fields = 'id'
  ) {
    const response = await $axios.$get(`${resource}/`, {
      params: { ...countParams, page: 1, paginate_by: 1, fields },
    })
    return {
      count: response.count,
    }
  },
})
