import { SearchModuleState } from '../types'
import { ANALYTICAL_DATA } from '~/constants'
import { FilterType, LookupType } from '~/types/enums'

type AnalyticalDataSearchModuleState = SearchModuleState & {
  defaultParameters: string[]
  parameters: { [K: string]: any }
  parameterFilters: {
    byIds: { [K: string]: any }
    allIds: string[]
  }
}

export const initState = (): AnalyticalDataSearchModuleState => {
  return {
    name: 'analytical_data',
    items: [],
    count: 0,
    options: ANALYTICAL_DATA.options,
    useMap: true,
    useInstitutions: true,
    query: '',
    filters: {
      byIds: {
        locality: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.locality',
          fields: [
            'locality',
            'locality_en',
            'locality_id_s',
            'site',
            'site_id_s',
          ],
        },
        depth: {
          type: FilterType.Range,
          value: [null, null],
          label: 'analyticalData.depth',
          placeholders: ['analyticalData.depthMin', 'analyticalData.depthMin'],
          fields: ['depth', 'depth_interval'],
        },
        stratigraphy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.Contains,
          label: 'analyticalData.stratigraphy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
        },
        lithostratigraphy: {
          value: null,
          type: FilterType.Object,
          searchField: 'hierarchy_string',
          lookUpType: LookupType.Contains,
          label: 'analyticalData.lithostratigraphy',
          fields: ['lithostratigraphy_hierarchy'],
        },
        analysis: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.analysis',
          fields: ['id'],
        },
        method: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.method',
          fields: ['analysis_method', 'analysis_method_en', 'method_details'],
        },
        lab: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.lab',
          fields: ['lab', 'lab_en'],
        },
        agentAnalysed: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.agentAnalysed',
          fields: ['agent_analysed', 'agent_analysed_free'],
        },
        reference: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.reference',
          fields: ['reference', 'reference_id_s'],
        },
        dataset: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.dataset',
          fields: ['dataset_name', 'dataset_id_s'],
        },
        stratigraphyBed: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.stratigraphyBed',
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
          label: 'analyticalData.rock',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_en_txt', 'rock_id_s'],
        },
        sample: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Contains,
          label: 'analyticalData.sample',
          fields: ['sample_id_s', 'sample_number', 'sample_type'],
        },
        project: {
          value: '',
          type: FilterType.Text,
          lookUpType: LookupType.Equals,
          label: 'analyticalData.project',
          fields: ['project_name', 'project_name_en'],
        },
      },
      allIds: [
        'stratigraphy',
        'lithostratigraphy',
        'method',
        'reference',
        'dataset',
        'stratigraphyBed',
        'rock',
        'sample',
      ],
    },
    defaultParameters: ['CaO_pct', 'MgO_pct', 'SiO2_pct', 'Al2O3_pct'],
    parameters: {},
    parameterFilters: {
      byIds: {},
      allIds: [],
    },
  }
}

export default initState
