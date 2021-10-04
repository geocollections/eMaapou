import { ANALYTICAL_DATA } from '~/constants'

export const initState = () => {
  return {
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
          type: 'text',
          lookUpType: 'contains',
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
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: 'analyticalData.depth',
          placeholders: ['analyticalData.depthMin', 'analyticalData.depthMin'],
          fields: ['depth', 'depth_interval'],
        },
        stratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.stratigraphy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
        },
        lithostratigraphy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'contains',
          label: 'analyticalData.lithostratigraphy',
          fields: ['lithostratigraphy_hierarchy'],
        },
        analysis: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.analysis',
          fields: ['id'],
        },
        method: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.method',
          fields: ['analysis_method', 'analysis_method_en', 'method_details'],
        },
        lab: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.lab',
          fields: ['lab', 'lab_en'],
        },
        agentAnalysed: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.agentAnalysed',
          fields: ['agent_analysed', 'agent_analysed_free'],
        },
        reference: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.reference',
          fields: ['reference', 'reference_id_s'],
        },
        dataset: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.dataset',
          fields: ['dataset_name', 'dataset_id_s'],
        },
        stratigraphyBed: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
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
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.rock',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_en_txt', 'rock_id_s'],
        },
        sample: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'analyticalData.sample',
          fields: ['sample_id_s', 'sample_number', 'sample_type'],
        },
        project: {
          value: '',
          type: 'text',
          lookUpType: 'equals',
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

    parameters: {},
    parameterFilters: {
      byIds: {},
      allIds: [],
    },
  }
}

export default initState
