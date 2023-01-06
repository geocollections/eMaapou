import { SearchModuleState } from '../types'
import { ANALYSIS } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

export type AnalysisFilters =
  | 'id'
  | 'depth'
  | 'stratigraphy'
  | 'method'
  | 'agent'
  | 'dataset'
  | 'lab'
  | 'sample'
  | 'locality'
  | 'labs'
  | 'methods'
  | 'localities'
  | 'map'

export const initState = (): SearchModuleState<AnalysisFilters> => {
  return {
    name: 'analysis',
    items: [],
    count: 0,
    options: ANALYSIS.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        id: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.id',
          fields: ['id'],
        },
        depth: {
          value: [null, null],
          type: FilterType.Range,
          label: 'analysis.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
        stratigraphy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.StartsWith,
          label: 'analysis.stratigraphy',
          fields: [
            'stratigraphy_hierarchy',
            'lithostratigraphy_hierarchy',
            'age_hierarchy',
          ],
        },
        method: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.method',
          fields: ['analysis_method', 'analysis_method_en'],
        },
        agent: {
          value: [],
          type: FilterType.ListText,
          label: '',
          fields: ['agent'],
          lookupType: 'startswith',
        },
        dataset: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.dataset',
          fields: ['dataset_ids'],
        },
        lab: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.lab',
          fields: ['lab', 'lab_en'],
        },
        sample: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['sample_id', 'sample_number'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },

        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analysis.locality',
          fields: ['locality', 'locality_en'],
        },
        labs: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['lab_id'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        methods: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['method'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        localities: {
          value: [],
          type: FilterType.ListIds,
          label: '',
          fields: ['locality_id'],
          valueType: 'number',
          valueField: 'id',
          lookupType: 'none',
        },
        map: {
          type: FilterType.Geom,
          value: null,
          label: '',
          fields: ['latlong'],
        },
      },
      allIds: ['id', 'depth'],
    },
  }
}

export default initState
