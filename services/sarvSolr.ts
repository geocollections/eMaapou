import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import { stringify } from 'qs'
// @ts-ignore
import * as Wkt from 'wicket'
import earcut from 'earcut'
import type { NuxtAxiosInstance } from '@nuxtjs/axios'

import type { IOptions } from '.'
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
      options: IOptions
      search?: string | null
      fields?: { [key: string]: string }
      defaultParams?: { [key: string]: any }
      searchFilters?: { [key: string]: any }
    }
  ) {
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
  if (options?.page && options?.itemsPerPage) {
    return {
      start: (options.page - 1) * options.itemsPerPage,
      rows: options.itemsPerPage,
    }
  }
  return null
}

const buildSolrSortParameter = (
  options: IOptions,
  fields: { [key: string]: string }
) => {
  if (!(options?.sortBy && options?.sortDesc)) return null

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
      } else return options.sortDesc?.[i] ? `${field} desc` : `${field} asc`
    })
    .filter((item) => item)

  return { sort: orderBy.join(',') }
}
enum LookUpType {
  Contains = 'contains',
  Equals = 'equals',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  DoesNotContain = 'doesNotContain',
  GreaterThan = 'greaterThan',
  SmallerThan = 'smallerThan',
}
const createSolrFieldQuery = (
  field: string,
  value: string,
  lookUpType: string
) => {
  switch (lookUpType) {
    case LookUpType.Contains:
      return `${field}:*${value}*`
    case LookUpType.Equals:
      return `${field}:"${value}"`
    case LookUpType.StartsWith:
      return `${field}:${value}*`
    case LookUpType.EndsWith:
      return `${field}:*${value}`
    case LookUpType.DoesNotContain:
      return `-${field}:${value}`
    case LookUpType.GreaterThan:
      return `${field}:[${value} TO *]`
    case LookUpType.SmallerThan:
      return `${field}:[* TO ${value}]`
    default:
      return `${field}:${value}`
  }
}

enum FilterType {
  Range = 'range',
  Text = 'text',
  RangeAlt = 'range_alt',
  Select = 'select',
  Object = 'object',
  List = 'list',
  ListOr = 'list_or',
  Boolean = 'boolean',
}

const isFilterValid = (filter: any) => {
  if (
    filter.type === FilterType.Range &&
    isNil(filter.value[0]) &&
    isNil(filter.value[1])
  )
    return false
  if (
    (filter.type === FilterType.Text || filter.type === FilterType.RangeAlt) &&
    (!filter.value || filter.value.trim().length <= 0)
  )
    return false
  if (
    filter.type === FilterType.Select &&
    (filter.value === null || filter.value.length < 1)
  )
    return false
  if (
    filter.type === FilterType.Object &&
    (typeof filter.value !== 'object' || !filter.value?.[filter.searchField])
  )
    return false
  if (
    (filter.type === FilterType.List || filter.type === FilterType.ListOr) &&
    isEmpty(filter.value)
  )
    return false
  if (
    filter.type === FilterType.Boolean &&
    (typeof filter.value !== 'boolean' || !filter.value)
  )
    return false
  return filter.value !== null
}

const buildSolrParameters = (filters: { [key: string]: any }) => {
  const initialObject = { fq: [] } as { fq: string[]; d?: number; pt?: string }

  const solrParameters = Object.entries(filters)
    .filter(([_, filter]) => isFilterValid(filter))
    .reduce(
      (
        prev,
        [_, filter]: [string, any]
      ): { fq: string[]; d?: number; pt?: string } => {
        switch (filter.type) {
          case 'text': {
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
          case 'range': {
            const start = isNil(filter.value[0]) ? '*' : filter.value[0]
            const end = isNil(filter.value[1]) ? '*' : filter.value[1]

            const solrFilter = filter.fields
              .map((field: string) => `${field}:[${start} TO ${end}]`)
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
              .map((field: string) => `${field}:${filter.value}`)
              .join(' OR ')

            return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
          }
          case 'select': {
            const solrFilter = filter.fields
              .map((field: string) => `${field}:(${filter.value.join(' ')})`)
              .join(' OR ')

            return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
          }
          case 'raw': {
            const solrFilter = filter.fields
              .map((field: string) => `${field}:${filter.value}`)
              .join(' OR ')

            return { ...prev, fq: [...prev.fq, `(${solrFilter})`] }
          }
          case 'object': {
            const solrFilter = filter.fields
              .map((field: string) =>
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
          case 'list_or': {
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
          case 'geom': {
            if (filter.value.geometry.type === 'Polygon') {
              // LON LAT
              const value = cloneDeep(filter.value)

              // Polygon triangulation
              const data = earcut.flatten(value.geometry.coordinates)
              const triangles = earcut(
                data.vertices,
                data.holes,
                data.dimensions
              )

              // Reversing triangles to geo coordinates
              const coordinates = triangles.map((item: any) => {
                const startIndex = item * 2
                return [
                  data.vertices[startIndex],
                  data.vertices[startIndex + 1],
                ]
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
      },
      initialObject
    )

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
