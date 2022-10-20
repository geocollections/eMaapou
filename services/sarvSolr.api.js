import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { stringify } from 'qs'
import Wkt from 'wicket/wicket'
import earcut from 'earcut'

export default ($axios) => ({
  async getResourceList(
    resource,
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useRawSolr,
      defaultParams,
      fields,
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
      ...buildSolrQueryParameter(search),
      ...buildSolrParameters(searchFilters),
      ...buildSolrPaginationParameters(options),
      ...buildSolrSortParameter(options, fields),
    }

    const response = await $axios.$get(`solr/${resource}`, {
      params,
      paramsSerializer: (par) => {
        return stringify(par, { indices: false })
      },
    })

    return {
      items: response?.response?.docs,
      count: response?.response?.numFound,
      stats: response?.stats,
      facet: response?.facet_counts,
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
        ...buildSolrQueryParameter(countParams.q ?? null),
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

const buildSolrQueryParameter = (search) => {
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
    q: isEmpty(s) ? '*' : `${s}`,
  }
}

const buildSolrPaginationParameters = (options) => {
  if (options?.page && options?.itemsPerPage) {
    return {
      start: (options.page - 1) * options.itemsPerPage,
      rows: options.itemsPerPage,
    }
  }
  return null
}

const buildSolrSortParameter = (options, fields) => {
  if (options?.sortBy && options?.sortDesc) {
    if (!isEmpty(options.sortBy)) {
      const orderBy = options.sortBy
        .map((field, i) => {
          // Support for multivalue fields #219
          if (fields?.[field]) {
            return fields[field]
              .split(',')
              .map((item) =>
                options.sortDesc[i] ? `${item} desc` : `${item} asc`
              )
              .join()
          } else return options.sortDesc[i] ? `${field} desc` : `${field} asc`
        })
        .filter((item) => item)

      return { sort: orderBy.join(',') }
    }
  }
  return null
}

const createSolrFieldQuery = (field, value, lookUpType) => {
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
  if (
    filter.type === 'range' &&
    isNil(filter.value[0]) &&
    isNil(filter.value[1])
  )
    return false
  if (
    (filter.type === 'text' || filter.type === 'range_alt') &&
    (!filter.value || filter.value.trim().length <= 0)
  )
    return false
  if (
    filter.type === 'select' &&
    (filter.value === null || filter.value.length < 1)
  )
    return false
  if (
    filter.type === 'object' &&
    (typeof filter.value !== 'object' || !filter.value?.[filter.searchField])
  )
    return false
  if (
    (filter.type === 'list' || filter.type === 'list_or') &&
    isEmpty(filter.value)
  )
    return false
  if (
    filter.type === 'boolean' &&
    (typeof filter.value !== 'boolean' || !filter.value)
  )
    return false
  return filter.value !== null
}

const buildSolrParameters = (filters) => {
  const initialObject = { fq: [] }

  const solrParameters = Object.entries(filters)
    .filter(([_, filter]) => isFilterValid(filter))
    .reduce((prev, [_, filter]) => {
      switch (filter.type) {
        case 'text': {
          // eslint-disable-next-line no-useless-escape
          const pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g

          const values = filter.value.replace(pattern, '\\$1').split(' ')

          const solrFilter = filter.fields
            .map((field) => {
              return `(${values
                .map((value) => {
                  return createSolrFieldQuery(field, value, filter.lookUpType)
                })
                .join(' AND ')})`
            })
            .join(' OR ')
          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'range': {
          const start = isNil(filter.value[0]) ? '*' : filter.value[0]
          const end = isNil(filter.value[1]) ? '*' : filter.value[1]

          const solrFilter = filter.fields
            .map((field) => `${field}:[${start} TO ${end}]`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'range_alt': {
          const value = isNil(filter.value)

          const solrFilter = `${filter.fields[0]}: [${value} TO *] AND ${filter.fields[1]}: [* TO ${value}]`

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'boolean': {
          const solrFilter = filter.fields
            .map((field) => `${field}:${filter.value}`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'select': {
          const solrFilter = filter.fields
            .map((field) => `${field}:(${filter.value.join(' ')})`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'raw': {
          const solrFilter = filter.fields
            .map((field) => `${field}:${filter.value}`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case 'object': {
          const solrFilter = filter.fields
            .map((field) =>
              createSolrFieldQuery(
                field,
                filter.value[filter.searchField],
                filter.lookUpType
              )
            )
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
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

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
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

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
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
              (prev, _, index, arr) => {
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
              .map((field) => `${field}:"isWithin(${wktString})"`)
              .join(' OR ')

            return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
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
            const solrFilter = filter.fields.map(
              (field) => `{!geofilt sfield=${field}}`
            )

            return {
              ...prev,
              fq: [...prev.fq, `${solrFilter}`],
              d: radius,
              pt: `${reversedCoordinates[0]},${reversedCoordinates[1]}`,
            }
          }
        }
        default: {
          return { ...prev }
        }
      }
    }, initialObject)

  // Join fq array together if array has elements
  // If no elements in fq delete fq so that fq default parameter is not over written with null
  if (solrParameters.fq.length > 0) {
    solrParameters.fq = `(${solrParameters.fq.join(' AND ')})`
  } else {
    delete solrParameters.fq
  }
  return solrParameters
}
