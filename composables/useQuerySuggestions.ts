import { ComputedRef, useContext } from '@nuxtjs/composition-api'
import { Filter, DefaultFilterObject } from '~/types/filters'

export const useQuerySuggestions = () => {
  const { $services } = useContext()
  return <
    FilterObject extends {
      id: number | string
      count: number
      [K: string]: any
    } = DefaultFilterObject
  >(
    config: {
      resource: string
      pivot: string[]
      pivotOffsetField: string
      countResourceRelatedKey: string
      countHierarchical: boolean
      excludeFilterKey: string
      filters?: ComputedRef<{ [key: string]: Filter }>
    },
    parseFunc: (
      items: any,
      counts: { [K: string]: number }
    ) => FilterObject[] = (items, counts) => {
      return items.map((item: any) => {
        return {
          id: item.value as number,
          count: counts[item.value] as number,
          text: item.pivot?.[0].value ?? item.value,
          text_en:
            item.pivot?.[0].pivot?.[0].value ??
            item.pivot?.[0].value ??
            item.value,
        } as unknown as FilterObject
      })
    }
  ) => {
    return async (
      search: string,
      options = { rows: 10, start: 0 }
    ): Promise<FilterObject[]> => {
      const pivotStr = config.pivot.join(',')
      let items = (
        await $services.sarvSolr.getResourceList(config.resource, {
          search,
          searchFilters: config.filters?.value,
          tags: {
            [config.excludeFilterKey]: 'dt',
          },
          defaultParams: {
            rows: 0,
            start: 0,
            facet: true,
            'facet.pivot': `{!ex=dt}${pivotStr}`,
            [`f.${config.pivotOffsetField}.facet.offset`]: options.start,
            'facet.limit': options.rows,
          },
        })
      ).facet.facet_pivot[pivotStr]
      const facetQueries = items
        .map((item: any) => item.value)
        .reduce((prev: { [K: string]: any }, id: any) => {
          return {
            ...prev,
            [`{!ex=dt}${config.countResourceRelatedKey}:${id}${
              config.countHierarchical ? '*' : ''
            }`]: id,
          }
        }, {})

      const facetQueriesResponse = await $services.sarvSolr.getResourceList(
        config.resource,
        {
          searchFilters: config.filters?.value,
          tags: {
            [config.excludeFilterKey]: 'dt',
          },
          defaultParams: {
            'facet.query': Object.keys(facetQueries),
            rows: 0,
            start: 0,
            facet: true,
          },
        }
      )

      const counts = Object.keys(
        facetQueriesResponse.facet.facet_queries
      ).reduce((prev: { [K: string]: any }, curr): { [K: string]: any } => {
        return {
          ...prev,
          [facetQueries[curr]]: facetQueriesResponse.facet.facet_queries[curr],
        }
      }, {})
      items = items.map((item: any) => ({
        ...item,
        count: counts[item[config.countResourceRelatedKey]],
      }))

      return parseFunc(items, counts)
    }
  }
}

export const useQuerySuggestionsMulti = () => {
  const { $services } = useContext()
  return <
    FilterObject extends {
      id: number | string
      count: number
      [K: string]: any
    } = DefaultFilterObject
  >(
    config: {
      resource: string
      pivot: string[]
      pivotOffsetField: string
      countResourceRelatedKey: string
      countHierarchical: boolean
      excludeFilterKey: string
      filters?: ComputedRef<{ [key: string]: Filter }>
    },
    parseFunc: (
      items: any,
      counts: { [K: string]: number }
    ) => FilterObject[] = (items, counts) => {
      return items.map((item: any) => {
        return {
          id: item.value as number,
          count: counts[item.value] as number,
          text: item.pivot?.[0].value ?? item.value,
          text_en:
            item.pivot?.[0].pivot?.[0].value ??
            item.pivot?.[0].value ??
            item.value,
        } as unknown as FilterObject
      })
    }
  ) => {
    return async (
      search: string,
      options = { rows: 10, start: 0 }
    ): Promise<FilterObject[]> => {
      const pivotStr = config.pivot.join(',')
      let items = (
        await $services.sarvSolr.getResourceList(config.resource, {
          search,
          searchFilters: config.filters?.value,
          tags: {
            [config.excludeFilterKey]: 'dt',
          },
          defaultParams: {
            rows: 0,
            start: 0,
            facet: true,
            'facet.pivot': `{!ex=dt}${pivotStr}`,
            [`f.${config.pivotOffsetField}.facet.offset`]: options.start,
            'facet.limit': options.rows,
          },
        })
      ).facet.facet_pivot[pivotStr]

      const ids = items.map((item: any) => item.value)
      const hierarchStringResponse = (
        await $services.sarvSolr.getResourceList('rock', {
          defaultParams: {
            fq: ids.map((id: any) => `id:${id}`).join(' OR '),
            rows: ids.length,
            fl: 'id,hierarchy_strings,name,name_en',
          },
        })
      ).items.map((item: any) => {
        if (item.hierarchy_strings) return item

        return {
          ...item,
          hierarchy_strings: [item.id],
        }
      })

      const facetQueries = hierarchStringResponse.reduce(
        (prev: { [K: string]: any }, item: any) => {
          const query = item.hierarchy_strings
            .map((s: string) => {
              return `${config.countResourceRelatedKey}:${s}*`
            })
            .join(' OR ')
          return {
            ...prev,
            [`{!ex=dt}(${query})`]: item.id,
          }
        },
        {}
      )

      const facetQueriesResponse = await $services.sarvSolr.getResourceList(
        config.resource,
        {
          searchFilters: config.filters?.value,
          tags: {
            [config.excludeFilterKey]: 'dt',
          },
          defaultParams: {
            'facet.query': Object.keys(facetQueries),
            rows: 0,
            start: 0,
            facet: true,
          },
        }
      )

      const counts = Object.keys(
        facetQueriesResponse.facet.facet_queries
      ).reduce((prev: { [K: string]: any }, curr): { [K: string]: any } => {
        return {
          ...prev,
          [facetQueries[curr]]: facetQueriesResponse.facet.facet_queries[curr],
        }
      }, {})
      items = items.map((item: any) => ({
        ...item,
        count: counts[item[config.countResourceRelatedKey]],
      }))

      return parseFunc(hierarchStringResponse, counts)
    }
  }
}

export const useQuerySuggestionsStatic = () => {
  const { $services } = useContext()
  return (config: {
    resource: string
    pivot: string[]
    excludeFilterKey: string
    limit: number
    filters?: ComputedRef<{ [K: string]: Filter }>
  }) => {
    return async (search: string) => {
      const pivotStr = config.pivot.join(',')
      const items = await $services.sarvSolr.getResourceList(config.resource, {
        search,
        searchFilters: config.filters?.value,
        tags: {
          [config.excludeFilterKey]: 'dt',
        },
        defaultParams: {
          rows: 0,
          start: 0,
          facet: true,
          'facet.pivot': `{!ex=dt}${pivotStr}`,
          'facet.limit': 200,
        },
      })
      return items.facet.facet_pivot[pivotStr].map((item: any) => {
        return {
          id: item.value as number,
          count: item.count,
          text: item.pivot?.[0].value ?? item.value,
          text_en:
            item.pivot?.[0].pivot?.[0].value ??
            item.pivot?.[0].value ??
            item.value,
        }
      })
    }
  }
}
