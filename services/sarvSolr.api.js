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
      ...buildSolrFilters(searchFilters),
      ...getPaginationParams(options),
      ...getSortByParams(options, queryFields),
    }

    const response = await $axios.$get(`solr/${resource}`, {
      params,
      paramsSerializer: (par) => {
        return qs.stringify(par, { indices: false, encode: false })
      },
    })

    return {
      items: response?.response?.docs,
      count: response?.response?.numFound,
      stats: response?.stats,
      grouped: response?.grouped,
    }
  },

  async getResource(resource, id, options = {}) {
    const response = await $axios.get(`solr/${resource}?q=id:${id}`, {
      params: { ...options },
    })
    return response.data?.response?.docs
  },

  async getResourceCount(resource, countParams) {
    const response = await $axios.$get(`solr/${resource}`, {
      params: {
        rows: 0,
        ...countParams,
        ...buildQueryParameter(countParams.q ?? null),
      },
    })
    return {
      count: response?.response?.numFound,
    }
  },

  async getAllFieldNames(resource, params) {
    const response = await $axios.$get(`solr/${resource}`, {
      params,
    })
    return {
      fields: response,
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

const buildSolrLookUpTypes = (field, value, lookUpType) => {
  switch (lookUpType) {
    case 'contains':
      return `${field}:*${value}*`
    case 'equals':
      return `${field}:"${value}"`
    case 'startsWith':
      return `${field}:${value}*`
    case 'endsWith':
      return `${field}:*${value}`
    case 'doesNotContain':
      return `-${field}:${value}`
    case 'greaterThan':
      return `${field}:[${value} TO *]`
    case 'smallerThan':
      return `${field}:[* TO ${value}]`
    default:
      return `${field}:${value}`
  }
}

const isFilterValid = (filter) => {
  switch (filter.type) {
    case 'range': {
      return isNil(filter.value[0]) && isNil(filter.value[1])
    }
    case 'text': {
      return !filter.value || filter.value.trim().length <= 0
    }
    case 'range_alt': {
      return !filter.value || filter.value.trim().length <= 0
    }
    case 'select': {
      return filter.value === null || filter.value.length < 1
    }
    case 'object': {
      return (
        typeof filter.value !== 'object' || !filter.value?.[filter.searchField]
      )
    }
    case 'list': {
      return isEmpty(filter.value)
    }
    case 'list_or': {
      return isEmpty(filter.value)
    }
    default: {
      return filter.value !== null
    }
  }
}

const buildSolrFilters = (filters) => {
  const solrParametersObject = { fq: [] }

  Object.entries(filters)
    .filter(([_, filter]) => isFilterValid(filter))
    .forEach(([_, filter]) => {
      switch (filter.type) {
        case 'text': {
          const encodedValue = encodeURIComponent(filter.value)

          const solrFilter = filter.fields
            .map((field) =>
              buildSolrLookUpTypes(field, encodedValue, filter.lookUpType)
            )
            .join(' OR ')
          solrParametersObject.fq.push(`(${solrFilter})`)

          break
        }
        case 'range': {
          const start = isNil(filter.value[0]) ? '*' : filter.value[0]
          const end = isNil(filter.value[1]) ? '*' : filter.value[1]

          const solrFilter = filter.fields
            .map((field) => `${field}:[${start} TO ${end}]`)
            .join(' OR ')

          solrParametersObject.fq.push(`(${solrFilter})`)

          break
        }
        case 'range_alt': {
          const value = isNil(filter.value)

          const solrFilter = `${filter.fields[0]}: [${value} TO *] AND ${filter.fields[1]}: [* TO ${value}]`

          solrParametersObject.fq.push(`(${solrFilter})`)

          break
        }
        case 'checkbox': {
          const encodedValue = encodeURIComponent(filter.value)

          const solrFilter = filter.fields
            .map((field) => `${field}:${encodedValue}`)
            .join(' OR ')

          solrParametersObject.fq.push(`(${solrFilter})`)

          break
        }
        case 'select': {
          const encodedValue = encodeURIComponent(filter.value.join(' '))
          const solrFilter = filter.fields
            .map((field) => `${field}:(${encodedValue})`)
            .join(' OR ')
          solrParametersObject.fq.push(`(${solrFilter})`)
          break
        }
        case 'raw': {
          const encodedValue = encodeURIComponent(filter.value)

          const solrFilter = filter.fields
            .map((field) => `${field}:${encodedValue}`)
            .join(' OR ')

          solrParametersObject.fq.push(`(${solrFilter})`)
          break
        }
        case 'object': {
          const encodedValue = encodeURIComponent(
            filter.value[filter.searchField]
          )

          const solrFilter = filter.fields
            .map((field) =>
              buildSolrLookUpTypes(field, encodedValue, filter.lookUpType)
            )
            .join(' OR ')
          solrParametersObject.fq.push(`(${solrFilter})`)
          break
        }
        case 'list': {
          const solrFilter = filter.fields
            .map((field) => {
              return filter.value
                .map((v) => {
                  return `(${field}:${v?.value ?? v})`
                })
                .join(' AND ')
            })
            .join(' AND ')
          solrParametersObject.fq.push(`(${solrFilter})`)
          break
        }
        case 'list_or': {
          const solrFilter = filter.fields
            .map((field) => {
              return filter.value
                .map((v) => {
                  return `(${field}:${v?.value ?? v})`
                })
                .join(' OR ')
            })
            .join(' OR ')
          solrParametersObject.fq.push(`(${solrFilter})`)
          break
        }
        case 'geom': {
          if (filter.value.geometry.type === 'Polygon') {
            // LON LAT
            const value = cloneDeep(filter.value)

            // Polygon triangulation
            const data = earcut.flatten(value.geometry.coordinates)
            const triangles = earcut(data.vertices, data.holes, data.dimensions)

            // Reversing triangles to geo coordinates
            const coordinates = triangles.map((item) => {
              const startIndex = item * 2
              return [data.vertices[startIndex], data.vertices[startIndex + 1]]
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
                  triangleCoordinates.length > 1 ? 'MultiPolygon' : 'Polygon',
              })
            )
            let wktString = wkt.write()
            wktString = wktString.replaceAll('),(', ')),((')

            const solrFilter = filter.fields
              .forEach((field) => `${field}:"isWithin(${wktString})"`)
              .join(' OR ')

            solrParametersObject.fq.push(`(${solrFilter})`)
          } else {
            // CIRCLE
            const reversedCoordinates = [
              ...filter.value.geometry.coordinates,
            ].reverse()
            // convert to km (from m) and round to 1 decimal place
            const radius =
              Math.round((filter.value.properties.radius / 1000) * 10) / 10

            // NOTE:  Might cause trouble when multiple fields in fields array.
            // Right now there is always one field in the fields array
            filter.fields.forEach((field) =>
              solrParametersObject.fq.push(`{!geofilt sfield=${field}}`)
            )

            solrParametersObject.d = radius
            solrParametersObject.pt = `${reversedCoordinates[0]},${reversedCoordinates[1]}`
          }

          break
        }
        default: {
          break
        }
      }
    })

  if (solrParametersObject.fq && solrParametersObject.fq.length > 0) {
    solrParametersObject.fq = `(${solrParametersObject.fq.join(' AND ')})`
  } else {
    delete solrParametersObject.fq
  }

  return solrParametersObject
}
