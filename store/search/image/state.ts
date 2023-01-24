import { SearchModuleState } from '../types'
import { IMAGE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ListTextFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type ImageFilters = {
  locality: ListIdsFilter
  people: ListTextFilter
  tags: ListTextFilter
  country: TextFilter
  date: RangeFilter
  dateFree: TextFilter
  imageNumber: TextFilter
  author: TextFilter
  imageSize: TextFilter
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
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: [
          'country',
          'country_en',
          'maakond',
          'maakond_en',
          'vald',
          'vald_en',
        ],
      },
      date: {
        type: FilterType.Range,
        value: [null, null],
        placeholders: ['boxes.min', 'boxes.max'],
        fields: ['date_created', 'date_created_free_year'],
      },
      dateFree: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['date_created_free'],
      },
      imageNumber: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['image_number'],
      },
      author: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['agent', 'author_free'],
      },
      imageSize: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.GreaterThan,
        fields: ['image_width', 'image_height'],
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
