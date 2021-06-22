import { SAMPLE } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: SAMPLE.options,
    useMap: true,
    useInstitutions: true,
    filters: {
      byIds: {
        number: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.number',
          fields: ['number'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.locality',
          fields: ['locality', 'locality_en', 'site_name', 'site_name_en'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.stratigraphy',
          fields: ['stratigraphy', 'stratigraphy_en'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'sample.hierarchy',
          fields: [
            'stratigraphy_hierarchy',
            'age_hierarchy',
            'lithostratigraphy_hierarchy',
          ],
        },
        collector: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'sample.collector',
          fields: ['collector', 'collector_full_name'],
        },
        depth: {
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: 'sample.depth',
          placeholders: ['depth.min', 'depth.max'],
          fields: ['depth'],
        },
        mass: {
          value: '',
          type: 'text',
          lookUpType: 'equals',
          label: 'sample.mass',
          fields: ['mass'],
        },
        project: {
          value: '',
          type: 'text',
          lookUpType: 'equals',
          label: 'sample.project',
          fields: ['project_name', 'project_name_en'],
        },
        // mass: {
        //   type: 'range',
        //   lookUpType: 'range',
        //   value: [0, 1000000],
        //   label: 'sample.mass',
        //   placeholders: ['mass.min', 'mass.max'],
        //   fields: ['mass'],
        // },
      },
      allIds: ['number', 'stratigraphy', 'hierarchy'],
    },
  }
}

export default initState
