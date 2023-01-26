import { SearchModuleState } from '../types'
import { SPECIMEN } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  BooleanFilter,
  GeomFilter,
  ListIdsFilter,
ListIdsMultiFilter,
  ListTextFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type SpecimenFilters = {
  number: ListTextFilter
  collection: ListIdsFilter
  rock: TextFilter
  hasImage: BooleanFilter
  hasCoordinates: BooleanFilter
  locality: ListIdsFilter
  reference: ListIdsFilter
  taxonHierarchy: ListIdsFilter
  taxonName: ListTextFilter
  stratigraphyHierarchy: ListIdsFilter
  fossilGroup: ListIdsFilter
  map: GeomFilter
  depth: RangeFilter
  country: ListIdsFilter
  rockHierarchy: ListIdsMultiFilter
  originalStatus: ListIdsFilter
  collector: ListTextFilter
}
export const initState = (): SearchModuleState<SpecimenFilters> => {
  return {
    name: 'specimen',
    items: [],
    count: 0,
    options: SPECIMEN.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      number: {
        value: [],
        type: FilterType.ListText,
        lookupType: 'none',
        fields: [
          'specimen_full_name',
          'specimen_number',
          'specimen_number_old',
        ],
      },
      collection: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['collection_id'],
        valueField: 'id',
        valueType: 'number',
      },
      originalStatus: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['original_status_id'],
        valueField: 'id',
        valueType: 'number',
      },
      rock: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['rock', 'rock_en', 'rock_txt', 'rock_txt_en'],
      },
      // stratigraphyHierarchy: {
      //   value: null,
      //   type: FilterType.Object,
      //   searchField: 'hierarchy_string',
      //   lookUpType: LookupType.StartsWith,
      //   label: 'specimen.stratigraphyHierarchy',
      //   fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
      // },
      hasImage: {
        value: false,
        type: FilterType.Boolean,
        fields: ['has_image'],
      },
      hasCoordinates: {
        value: false,
        type: FilterType.Boolean,
        fields: ['has_map'],
      },
      // mass: {
      //   type: 'range',
      //   lookUpType: 'range',
      //   value: [0, 1000000],
      //   label: 'sample.mass',
      //   placeholders: ['mass.min', 'mass.max'],
      //   fields: ['mass'],
      // },
      locality: {
        value: [],
        type: FilterType.ListIds,
        fields: ['locality_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      reference: {
        value: [],
        type: FilterType.ListIds,
        fields: ['specimen_references'],
        valueType: 'string',
        valueField: 'reference',
        lookupType: 'none',
      },
      taxonHierarchy: {
        value: [],
        type: FilterType.ListIds,
        fields: ['hierarchy_string'],
        valueType: 'string',
        valueField: 'hierarchy_string',
        lookupType: 'startswith',
      },
      rockHierarchy: {
        value: [],
        type: FilterType.ListIdsMulti,
        valueField: 'hierarchy_strings',
        fields: ['hierarchy_string_rock'],
        valueType: 'string',
        idValueField: 'id',
        lookupType: 'startswith',
      },
      taxonName: {
        value: [],
        type: FilterType.ListText,
        fields: ['taxon_txt'],
        lookupType: 'none',
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        fields: [
          'stratigraphy_hierarchy',
          'age_hierarchy',
          'lithostratigraphy_hierarchy',
        ],
        valueType: 'string',
        valueField: 'hierarchy_string',
        lookupType: 'startswith',
      },
      fossilGroup: {
        value: [],
        type: FilterType.ListIds,
        fields: ['fossilgroup_id'],
        valueField: 'id',
        valueType: 'number',
        lookupType: 'none',
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
      depth: {
        type: FilterType.Range,
        value: [null, null],
        fields: ['depth'],
        placeholders: ['depth.min', 'depth.max'],
      },
      country: {
        value: [],
        type: FilterType.ListIds,
        fields: ['country_id'],
        valueType: 'number',
        valueField: 'id',
        lookupType: 'none',
      },
      collector: {
        value: [],
        type: FilterType.ListText,
        fields: ['collector', 'collector_full_name'],
        lookupType: 'contains',
      },
    },
  }
}

export default initState
