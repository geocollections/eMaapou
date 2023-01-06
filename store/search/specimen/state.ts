import { SearchModuleState } from '../types'
import { SPECIMEN } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type SpecimenFilters =
  | 'locality'
  | 'number'
  | 'collectionNumber'
  | 'fossil'
  | 'fossilName'
  | 'rock'
  | 'hierarchy'
  | 'reference'
  | 'hasImage'
  | 'hasCoordinates'
  | 'localities'
  | 'references'
  | 'taxonHierarchy'
  | 'taxonName'
  | 'stratigraphyHierarchy'
  | 'fossilGroups'
  | 'map'

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
      byIds: {
        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.locality',
          fields: ['locality', 'locality_en'],
        },
        number: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.number',
          fields: [
            'specimen_full_name',
            'specimen_number',
            'specimen_number_old',
          ],
        },
        collectionNumber: {
          value: [],
          type: FilterType.ListText,
          lookupType: 'none',
          label: 'specimen.collectionNr',
          fields: ['collection_number'],
        },
        fossil: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.fossilGroup',
          fields: ['fossilgroup'],
        },
        fossilName: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.fossilName',
          fields: ['taxon', 'taxon_txt', 'taxon_full'],
        },
        rock: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'specimen.rockName',
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
        hierarchy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'specimen.taxon',
          fields: ['hierarchy_string'],
        },
        reference: {
          value: null,
          type: FilterType.Object,
          searchField: 'reference',
          lookUpType: LookupType.Equals,
          label: 'specimen.reference',
          fields: ['specimen_references'],
        },
        hasImage: {
          value: false,
          type: FilterType.Boolean,
          label: 'specimen.has_image',
          fields: ['has_image'],
        },
        hasCoordinates: {
          value: false,
          type: FilterType.Boolean,
          label: 'specimen.has_map',
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
        localities: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['locality_id'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        references: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['specimen_references'],
          valueType: 'string',
          valueField: 'reference',
          lookupType: 'none',
        },
        taxonHierarchy: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['hierarchy_string'],
          valueType: 'string',
          valueField: 'hierarchy_string',
          lookupType: 'startswith',
        },
        taxonName: {
          value: [],
          type: FilterType.ListText,
          label: '',
          fields: ['taxon_txt'],
          lookupType: 'none',
        },
        stratigraphyHierarchy: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: [
            'stratigraphy_hierarchy',
            'age_hierarchy',
            'lithostratigraphy_hierarchy',
          ],
          valueType: 'string',
          valueField: 'hierarchy_string',
          lookupType: 'startswith',
        },
        fossilGroups: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['fossilgroup_id'],
          valueField: 'id',
          valueType: 'number',
          lookupType: 'none',
        },
        map: {
          type: FilterType.Geom,
          value: null,
          label: '',
          fields: ['latlong'],
        },
      },
      allIds: [
        'number',
        'collectionNr',
        'fossilName',
        'fossil',
        'stratigraphyHierarchy',
        'hierarchy',
        'has_image',
        'has_map',
      ],
    },
  }
}

export default initState
