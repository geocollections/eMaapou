import { SearchModuleState } from '../types'
import { ANALYTICAL_DATA } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'
import {
  GeomFilter,
  ListIdsFilter,
  ParameterFilter,
  RangeFilter,
  TextFilter,
} from '~/types/filters'

export type AnalyticalDataFilters = {
  locality: ListIdsFilter
  site: ListIdsFilter
  depth: RangeFilter
  stratigraphyHierarchy: ListIdsFilter
  lithostratigraphyHierarchy: ListIdsFilter
  analysis: TextFilter
  method: ListIdsFilter
  lab: ListIdsFilter
  agentAnalysed: TextFilter
  reference: ListIdsFilter
  dataset: ListIdsFilter
  stratigraphyBed: TextFilter
  rock: TextFilter
  sample: ListIdsFilter
  project: ListIdsFilter
  parameter: ParameterFilter
  map: GeomFilter
}

type AnalyticalDataSearchModuleState =
  SearchModuleState<AnalyticalDataFilters> & {
    defaultParameters: string[]
    parameters: { [K: string]: any }
    parameterFilters: {
      byId: { [K: string]: any }
      allIds: string[]
    }
  }

export const initState = (): AnalyticalDataSearchModuleState => {
  return {
    name: 'analyticalData',
    items: [],
    count: 0,
    options: ANALYTICAL_DATA.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      parameter: {
        value: [{ value: [null, null], parameter: null }],
        type: FilterType.Parameter,
      },
      locality: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['locality_id'],
      },
      site: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['site_id'],
      },
      depth: {
        type: FilterType.Range,
        value: [null, null],
        placeholders: ['analyticalData.depthMin', 'analyticalData.depthMin'],
        fields: ['depth', 'depth_interval'],
      },
      stratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        valueField: 'hierarchy_string',
        valueType: 'string',
        lookupType: 'startswith',
        fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
      },
      lithostratigraphyHierarchy: {
        value: [],
        type: FilterType.ListIds,
        valueField: 'hierarchy_string',
        valueType: 'string',
        lookupType: 'startswith',
        fields: ['lithostratigraphy_hierarchy'],
      },
      analysis: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['id'],
      },
      method: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['method_id'],
      },
      lab: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['lab_id'],
      },
      agentAnalysed: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['agent_analysed', 'agent_analysed_free'],
      },
      reference: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['reference_id'],
        valueField: 'id',
        valueType: 'number',
      },
      dataset: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['dataset_id'],
      },
      stratigraphyBed: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: [
          'stratigraphy',
          'stratigraphy_en',
          'stratigraphy_id_s',
          'lithostratigraphy',
          'lithostratigraphy_en',
          'lithostratigraphy_id_s',
        ],
      },
      rock: {
        value: '',
        type: FilterType.Text,
        lookUpType: LookupType.Contains,
        fields: ['rock', 'rock_en', 'rock_txt', 'rock_en_txt', 'rock_id_s'],
      },
      sample: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        fields: ['sample_id'],
        valueField: 'id',
        valueType: 'number',
      },
      project: {
        value: [],
        type: FilterType.ListIds,
        lookupType: 'none',
        valueField: 'id',
        valueType: 'number',
        fields: ['project_id'],
      },
      map: {
        type: FilterType.Geom,
        value: null,
        fields: ['latlong'],
      },
    },
    defaultParameters: ['CaO_pct', 'MgO_pct', 'SiO2_pct', 'Al2O3_pct'],
    parameters: {},
    parameterFilters: {
      byId: {},
      allIds: [],
    },
  }
}

export default initState
