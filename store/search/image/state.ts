import { SearchModuleState } from '../types'
import { IMAGE } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import { RangeFilter, TextFilter } from '~/types/filters'

export type ImageFilters = {
  locality: TextFilter
  people: TextFilter
  tags: TextFilter
  country: TextFilter
  date: RangeFilter
  dateFree: TextFilter
  imageNumber: TextFilter
  author: TextFilter
  imageSize: TextFilter
}
type ImageSearchModuleState = SearchModuleState<ImageFilters> & {
  currentView: string // TODO: this can/should be a enum
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
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.locality',
        fields: ['locality', 'locality_en'],
      },
      people: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.people',
        fields: ['image_people'],
      },
      tags: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.tags',
        fields: ['tags'],
      },
      country: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.countryCountyParish',
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
        label: 'photo.date',
        placeholders: ['boxes.min', 'boxes.max'],
        fields: ['date_created', 'date_created_free_year'],
      },
      dateFree: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.dateFree',
        fields: ['date_created_free'],
      },
      imageNumber: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.imageNumber',
        fields: ['image_number'],
      },
      author: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        label: 'photo.author',
        fields: ['agent', 'author_free'],
      },
      imageSize: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.GreaterThan,
        label: 'photo.size',
        fields: ['image_width', 'image_height'],
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
