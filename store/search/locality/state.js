import { LOCALITY } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: LOCALITY.options,
    useMap: true,
    useInstitutions: false,
    filters: {
      byIds: {
        name: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.name',
          fields: ['locality', 'locality_en'],
        },
        country: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.country',
          fields: ['country', 'country_en'],
        },
        stratigraphy: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.stratigraphy',
          fields: [
            'stratigraphy_base',
            'stratigraphy_base_en',
            'stratigraphy_base_free',
            'stratigraphy_top',
            'stratigraphy_top_en',
            'stratigraphy_top_free',
          ],
        },
        reference: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.reference',
          fields: ['locality_references'],
        },
      },
      allIds: ['name', 'country', 'stratigraphy', 'reference'],
    },
  }
}

export default initState
