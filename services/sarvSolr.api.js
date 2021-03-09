import { isEmpty, isNil } from 'lodash'

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
    {
      defaultParams,
      queryFields,
      search,
      tableOptions,
      isValid,
      searchFilters = {},
      ...options
    }
  ) {
    if (isValid) {
      return {
        items: [],
        count: 0,
      }
    }
    const params = {
      ...defaultParams,
      ...buildQueryParameter(search),
      ...buildFilterQueryParameter(searchFilters),
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
      params: {
        ...buildQueryParameter(countParams.q ?? null),
        rows: 0,
        ...countParams,
      },
    })
    return {
      count: response.count,
    }
  },
})

const buildQueryParameter = (search) => {
  let s = search
  if (
    !isEmpty(search) &&
    search.includes('-') &&
    !search.includes(' -') &&
    !search.startsWith('"') &&
    !search.endsWith('"')
  ) {
    s = `"${search}"`
  }
  return {
    q: isEmpty(s) ? '*' : `${s}`,
  }
}

const buildFilterQueryParameter = (filters) => {
  const filterQueryStr = Object.entries(filters)
    .filter(([_, v]) => {
      if (v.type === 'range' && isNil(v.value[0]) && isNil(v.value[1]))
        return false
      if (v.type === 'text' && (!v.value || v.value.trim().length <= 0))
        return false
      if (v.type === 'select' && (v.value === null || v.value.length < 1))
        return false
      return v.value !== null
    })
    .reduce((prev, [k, v]) => {
      const filterQueryParam = v.fields.reduce((prev, curr, idx) => {
        function buildEncodedParameterStr(searchParameter, fieldId) {
          function buildTextParameter(encodedValue, fieldId) {
            const textArray = encodedValue.split(' ')

            const paramArray = textArray.map((str) => {
              switch (searchParameter.lookUpType) {
                case 'contains':
                  return `*${encodedValue}*`
                case 'equals':
                  return `"${encodedValue}"`
                case 'startsWith':
                  return `${encodedValue}*`
                case 'endsWith':
                  return `*${encodedValue}`
                default:
                  return `${fieldId}:${encodedValue}`
              }
            })

            return `${fieldId}:(${paramArray.join(' AND ')})`
          }

          switch (searchParameter.type) {
            case 'range': {
              // const encodedValue = searchParameter.value.map((el) => {
              //   return encodeURIComponent(el)
              // })

              const start = isNil(searchParameter.value[0])
                ? '*'
                : searchParameter.value[0]
              const end = isNil(searchParameter.value[1])
                ? '*'
                : searchParameter.value[1]
              return `(${fieldId}:[${start} TO ${end}] OR (*:* AND -${fieldId}:[* TO *]))`
            }
            case 'checkbox': {
              const encodedValue = encodeURIComponent(searchParameter.value)
              return `${fieldId}:${encodedValue}`
            }
            case 'select': {
              return `${fieldId}:(${encodeURIComponent(
                searchParameter.value.join(' ')
              )})`
            }
            case 'raw': {
              return `${fieldId}:${encodeURIComponent(searchParameter.value)}`
            }
            case 'text': {
              return encodeURIComponent(
                buildTextParameter(searchParameter.value, fieldId)
              )
            }
            default:
              return null
          }
        }

        if (idx === 0)
          return `${prev}${buildEncodedParameterStr(v, curr) ?? ''}`
        else return `${prev} OR ${buildEncodedParameterStr(v, curr) ?? ''}`
      }, '')

      if (filterQueryParam === null) return `${prev}`
      if (prev.length > 0) return `${prev} AND ${filterQueryParam}`
      return `${prev}${filterQueryParam}`
    }, '')
  return isEmpty(filterQueryStr) ? null : { fq: filterQueryStr }
}
