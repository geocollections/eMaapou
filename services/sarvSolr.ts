import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { stringify } from 'qs'
// @ts-ignore
import * as Wkt from 'wicket'
import earcut from 'earcut'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'

import type { IOptions } from '.'

import { FilterType, LookupType } from '~/types/enums'
import { Filter } from '~/types/filters'
import isFilterValid from '~/utils/isFilterValid'
export default ($axios: NuxtAxiosInstance) => ({
  async getResourceList(
    resource: string,
    {
      defaultParams,
      fields = {},
      search = null,
      options,
      searchFilters = {},
    }: {
      options?: IOptions
      search?: string | null
      fields?: { [key: string]: string }
      defaultParams?: { [key: string]: any }
      searchFilters?: { [key: string]: Filter }
    }
  ) {
    const params = {
      ...defaultParams,
      ...buildSolrQueryParameter(search),
      ...buildSolrParameters(searchFilters),
      ...(options && buildSolrPaginationParameters(options)),
      ...(options && buildSolrSortParameter(options, fields)),
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

  async getResource(resource: string, id: number, options = {}) {
    const response = await $axios.get(`solr/${resource}?q=id:${id}`, {
      params: { ...options },
    })
    return response.data?.response?.docs
  },

  async getResourceCount(
    resource: string,
    countParams: { [key: string]: any }
  ) {
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

  async getAllFieldNames(resource: string, params: { [key: string]: any }) {
    const response = await $axios.$get(`solr/${resource}`, {
      params,
    })
    return {
      fields: response,
    }
  },
})

const buildSolrQueryParameter = (search: string | null) => {
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

const buildSolrPaginationParameters = (options: IOptions) => {
  if (!(options.page && options.itemsPerPage)) return null

  return {
    start: (options.page - 1) * options.itemsPerPage,
    rows: options.itemsPerPage,
  }
}

const buildSolrSortParameter = (
  options: IOptions,
  fields: { [key: string]: string }
) => {
  if (!(options.sortBy && options.sortDesc)) return null

  const orderBy = options.sortBy
    .map((field, i) => {
      // Support for multivalue fields #219
      if (fields?.[field]) {
        return fields[field]
          .split(',')
          .map((item) =>
            options.sortDesc?.[i] ? `${item} desc` : `${item} asc`
          )
          .join()
      }
      return options.sortDesc?.[i] ? `${field} desc` : `${field} asc`
    })
    .filter((item) => item)

  return { sort: orderBy.join(',') }
}

const createSolrFieldQuery = (
  field: string,
  value: string,
  lookUpType: string
) => {
  switch (lookUpType) {
    case LookupType.Contains:
      return `${field}:*${value}*`
    case LookupType.Equals:
      return `${field}:"${value}"`
    case LookupType.StartsWith:
      return `${field}:${value}*`
    case LookupType.EndsWith:
      return `${field}:*${value}`
    case LookupType.DoesNotContain:
      return `-${field}:${value}`
    case LookupType.GreaterThan:
      return `${field}:[${value} TO *]`
    case LookupType.SmallerThan:
      return `${field}:[* TO ${value}]`
    default:
      return `${field}:${value}`
  }
}

const buildSolrParameters = (filters: { [key: string]: Filter }) => {
  const initialObject = { fq: [] } as { fq: string[]; d?: number; pt?: string }

  const solrParameters = Object.entries(filters)
    .filter(([_, filter]) => isFilterValid(filter))
    .reduce((prev, [_, filter]): { fq: string[]; d?: number; pt?: string } => {
      switch (filter.type) {
        case FilterType.Text: {
          // eslint-disable-next-line no-useless-escape
          const pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g

          const values = filter.value.replace(pattern, '\\$1').split(' ')

          const solrFilter = filter.fields
            .map((field: string) => {
              return `(${values
                .map((value: string) => {
                  return createSolrFieldQuery(field, value, filter.lookUpType)
                })
                .join(' AND ')})`
            })
            .join(' OR ')
          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.Range: {
          const start = isNil(filter.value[0]) ? '*' : filter.value[0]
          const end = isNil(filter.value[1]) ? '*' : filter.value[1]

          const solrFilter = filter.fields
            .map((field: string) => `${field}:[${start} TO ${end}]`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.RangeAlt: {
          const value = isNil(filter.value)

          const solrFilter = `${filter.fields[0]}: [${value} TO *] AND ${filter.fields[1]}: [* TO ${value}]`

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.Boolean: {
          const solrFilter = filter.fields
            .map((field: string) => `${field}:${filter.value}`)
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.Object: {
          const solrFilter = filter.fields
            .map((field: string) =>
              createSolrFieldQuery(
                field,
                filter.value?.[filter.searchField],
                filter.lookUpType
              )
            )
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.List: {
          const solrFilter = filter.fields
            .map((field: string) => {
              return filter.value
                .map((v: any) => {
                  return `(${field}:${v?.value ?? v})`
                })
                .join(' AND ')
            })
            .join(' AND ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.ListOr: {
          const solrFilter = filter.fields
            .map((field: string) => {
              return filter.value
                .map((v: any) => {
                  return `(${field}:${v?.value ?? v})`
                })
                .join(' OR ')
            })
            .join(' OR ')

          return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
        }
        case FilterType.Geom: {
          if (filter.value.geometry.type === 'Polygon') {
            // LON LAT
            const value = cloneDeep(filter.value)

            // Polygon triangulation
            const data = earcut.flatten(value.geometry.coordinates)
            const triangles = earcut(data.vertices, data.holes, data.dimensions)

            // Reversing triangles to geo coordinates
            const coordinates = triangles.map((item: any) => {
              const startIndex = item * 2
              return [data.vertices[startIndex], data.vertices[startIndex + 1]]
            })
            const triangleCoordinates = coordinates.reduce(
              (prev: any, _: any, index: number, arr: any[]) => {
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
              .map((field: string) => `${field}:"isWithin(${wktString})"`)
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
              (field: string) => `{!geofilt sfield=${field}}`
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

  const result = {
    d: solrParameters.d,
    pt: solrParameters.pt,
  } as { fq?: string; d?: number; pt?: string }

  // Join fq array together if array has elements
  // If no elements in fq delete fq so that fq default parameter is not over written with null
  if (solrParameters.fq.length > 0) {
    result.fq = `(${solrParameters.fq.join(' AND ')})`
  }
  return result
}
