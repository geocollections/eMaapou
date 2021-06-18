import { SITE } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: SITE.options,
    useMap: true,
    useInstitutions: false,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.name',
          fields: ['name'],
        },
        area: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.area',
          fields: ['area_name', 'area_name_en'],
        },
        project: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'site.project',
          fields: ['project_name', 'project_name_en'],
        },
      },
      allIds: ['name'],
    },
  }
}

export default initState
