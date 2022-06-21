import { SPECIMEN } from '~/constants'

export const initState = () => {
  return {
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
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.locality',
          fields: ['locality', 'locality_en'],
        },
        number: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.number',
          fields: ['specimen_full_name'],
        },
        collectionNr: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.collectionNr',
          fields: ['collection_number'],
        },
        fossil: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.fossilGroup',
          fields: ['fossilgroup'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'specimen.hierarchy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
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
      allIds: ['number', 'collectionNr', 'fossil', 'hierarchy'],
    },
  }
}

export default initState
