import { SearchModuleState } from '../types'
import { IMAGE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
ListDateFilter,
  ListIdsFilter,
  ListTextFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type ImageFilters = {
  locality: ListIdsFilter
  people: ListTextFilter
  tags: ListTextFilter
  country: ListIdsFilter
  date: ListDateFilter
  dateFree: TextFilter
  number: ListTextFilter
  author: ListTextFilter
  imageSize: RangeFilter
  map: GeomFilter
}
type ImageSearchModuleState = SearchModuleState<ImageFilters> & {
  currentView: string // TODO: this can/should be a enum/string union
  persistantFilters: {
    [K: string]: any
  }
}

export const initState = (): ImageSearchModuleState => {
  return {
    name: 'image',
    items: [],
    count: 0,
    options: IMAGE.options,
    currentView: 'image',
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      locality: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['locality_id'],
        valueField: 'id',
        valueType: 'number',
      },
      people: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'contains',
        fields: ['image_people'],
      },
      tags: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'contains',
        fields: ['tags'],
      },
      country: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: [
          'country_id',
        ],
        valueType: 'number',
        valueField: 'id'
      },
      date: {
        type: FilterType.ListDate,
        value: [],
        fields: ['date_created'],
      },
      dateFree: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['date_created_free'],
      },
      number: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'contains',
        fields: ['image_number'],
      },
      author: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'contains',
        fields: ['agent', 'author_free'],
      },
      imageSize: {
        value: [null, null],
        type: FilterType.Range,
        fields: ['image_width', 'image_height'],
        placeholders: ['boxes.min', 'boxes.max']
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
    },
    // NOTE: Because this filter does not ever change, it was separated from the rest.
    // So that the hasActiveFilter does not return false positives.
    persistantFilters: {
      specimenImageAttachment: {
        value: '2',
        type: FilterType.Text,
        lookUpType: LookupType.Equals,
        fields: ['specimen_image_attachment'],
      },
    },
  }
}

export default initState
