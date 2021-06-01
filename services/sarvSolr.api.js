import { cloneDeep, isEmpty, isNil } from 'lodash'
import qs from 'qs'
import Wkt from 'wicket/wicket'
import earcut from 'earcut'

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
      const orderBy = options.sortBy
        .map((field, i) => {
          // Support for multivalue fields #219
          if (queryFields?.[field]) {
            return queryFields[field]
              .split(',')
              .map((item) =>
                options.sortDesc[i] ? `${item} desc` : `${item} asc`
              )
              .join()
          } else return options.sortDesc[i] ? `${field} desc` : `${field} asc`

          // if (options.sortDesc[i]) return `${queryFields[field]} desc`
          // return `${queryFields[field]} asc`
        })
        .filter((item) => item)

      return { sort: orderBy.join(',') }
    }
  }
  return null
}

export default ($axios) => ({
  async getResourceList(
    resource,
    {
      useRawSolr,
      defaultParams,
      queryFields,
      search,
      options,
      isValid,
      searchFilters = {},
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
      ...getPaginationParams(options),
      ...getSortByParams(options, queryFields),
    }

    const response = await $axios.$get(
      `${useRawSolr ? 'raw_solr' : 'solr'}/${resource}/`,
      {
        params,
        paramsSerializer: (par) => {
          return qs.stringify(par, { indices: false })
        },
      }
    )

    return {
      items: useRawSolr ? response?.response?.docs : response.results,
      count: useRawSolr ? response?.response?.numFound : response.count,
      stats: response?.stats,
      grouped: response?.grouped,
    }
  },

  async getResource(resource, id, options = {}) {
    const response = await $axios.get(`solr/${resource}/?q=${id}`, {
      params: { ...options },
    })
    return response.data
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(`solr/${resource}/`, {
      params: {
        rows: 0,
        ...countParams,
        ...buildQueryParameter(countParams.q ?? null),
      },
    })
    return {
      count: response.count,
    }
  },

  async getAllFieldNames(resource, params) {
    const response = await $axios.$get(`raw_solr/${resource}/`, {
      params,
    })
    return {
      fields: response?.response,
    }
  },
})

const buildQueryParameter = (search) => {
  const s = search
    ? search
        .split(' ')
        .map((s) => {
          if (
            !s.startsWith('-') &&
            s.includes('-') &&
            !s.startsWith('"') &&
            !s.endsWith('"')
          )
            return `"${s}"`
          return s
        })
        .join(' ')
    : null
  return {
    q: isEmpty(s) ? '*' : `${encodeURIComponent(s)}`,
  }
}

const buildFilterQueryParameter = (filters) => {
  let filterQueryStr = Object.entries(filters)
    .filter(([_, v]) => {
      if (v.type === 'range' && isNil(v.value[0]) && isNil(v.value[1]))
        return false
      if (
        (v.type === 'text' || v.type === 'range_alt') &&
        (!v.value || v.value.trim().length <= 0)
      )
        return false
      if (v.type === 'select' && (v.value === null || v.value.length < 1))
        return false
      if (
        v.type === 'object' &&
        (typeof v.value !== 'object' || !v.value?.[v.searchField])
      )
        return false
      if ((v.type === 'list' || v.type === 'list_or') && isEmpty(v.value))
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
                  return `*${str}*`
                case 'equals':
                  return `"${str}"`
                case 'startsWith':
                  return `${str}*`
                case 'endsWith':
                  return `*${str}`
                case 'doesNotContain':
                  return `-${fieldId}:${str}`
                case 'greaterThan':
                  return `[${str} TO *]`
                case 'smallerThan':
                  return `[* TO ${str}]`
                default:
                  return `${fieldId}:${str}`
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
              // return `${fieldId}:[${start} TO ${end}] OR (*:* AND -${fieldId}:[* TO *])`

              return `${fieldId}:[${start} TO ${end}]`
            }
            case 'range_alt': {
              const fieldValue = isNil(searchParameter.value)
                ? '*'
                : searchParameter.value
              return idx === 0
                ? `${searchParameter.fields[0]}:[${fieldValue} TO *]`
                : `${searchParameter.fields[1]}:[* TO ${fieldValue}]`
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
                `${buildTextParameter(searchParameter.value, fieldId)}`
              )
            }
            case 'object': {
              return encodeURIComponent(
                `${buildTextParameter(
                  searchParameter.value[searchParameter.searchField],
                  fieldId
                )}`
              )
            }
            case 'list': {
              return searchParameter.fields
                .map((field) => {
                  return searchParameter.value
                    .map((obj) => {
                      return `(${field}:${obj?.value ?? obj})`
                    })
                    .join(' AND ')
                })
                .join(' AND ')
            }
            case 'list_or': {
              return searchParameter.fields
                .map((field) => {
                  return searchParameter.value
                    .map((obj) => {
                      return `(${field}:${obj?.value ?? obj})`
                    })
                    .join(' OR ')
                })
                .join(' OR ')
            }
            case 'geom': {
              if (searchParameter.value.geometry.type === 'Polygon') {
                // LON LAT
                const value = cloneDeep(searchParameter.value)

                // Polygon triangulation
                const data = earcut.flatten(value.geometry.coordinates)
                const triangles = earcut(
                  data.vertices,
                  data.holes,
                  data.dimensions
                )

                // Reversing triangles to geo coordinates
                const coordinates = triangles.map((item) => {
                  const startIndex = item * 2
                  return [
                    data.vertices[startIndex],
                    data.vertices[startIndex + 1],
                  ]
                })
                const triangleCoordinates = coordinates.reduce(
                  (prev, item, index, arr) => {
                    if ((index + 1) % 3 === 0) {
                      prev.push([
                        arr[index - 2],
                        arr[index - 1],
                        arr[index],
                        arr[index - 2],
                      ])
                    }
                    return prev
                  },
                  []
                )

                // Creating WKT string for query
                const wkt = new Wkt.Wkt()
                wkt.read(
                  JSON.stringify({
                    coordinates:
                      triangleCoordinates.length > 1
                        ? [triangleCoordinates]
                        : triangleCoordinates,
                    type:
                      triangleCoordinates.length > 1
                        ? 'MultiPolygon'
                        : 'Polygon',
                  })
                )
                let wktString = wkt.write()
                wktString = wktString.replaceAll('),(', ')),((')

                return `${fieldId}:"isWithin(${wktString})"`
              } else {
                // CIRCLE
                const reversedCoordinates = [
                  ...searchParameter.value.geometry.coordinates,
                ].reverse()
                // convert to km (from m) and round to 1 decimal place
                const radius =
                  Math.round(
                    (searchParameter.value.properties.radius / 1000) * 10
                  ) / 10

                return `{!geofilt})&d=${radius}&pt=${reversedCoordinates}&sfield=${fieldId}`
              }
            }
            default:
              return null
          }
        }

        if (idx === 0)
          return `${prev}${buildEncodedParameterStr(v, curr) ?? ''}`
        else if (v.type === 'range_alt')
          return `${prev} AND ${buildEncodedParameterStr(v, curr) ?? ''}`
        else return `${prev} OR ${buildEncodedParameterStr(v, curr) ?? ''}`
      }, '')

      if (filterQueryParam === null) return `${prev}`
      if (prev.length > 0) return `${prev} AND (${filterQueryParam})`
      return `${prev}(${filterQueryParam})`
    }, '')

  // Hack: Special case for spatial search CIRCLE:
  if (filterQueryStr.includes('{!geofilt}') && filterQueryStr.endsWith(')'))
    filterQueryStr = filterQueryStr.slice(0, -1)
  return isEmpty(filterQueryStr) ? null : { fq: filterQueryStr }
}
