import { TAXON } from '~/constants'

export const initState = () => {
  return {
    items: [],
    count: 0,
    options: TAXON.options,
    useMap: true,
    useInstitutions: false,
    filters: {
      byIds: {
        species: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.species',
          fields: ['taxon'],
        },
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.locality',
          fields: ['locality', 'locality_en'],
        },
        stratigraphyHierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'taxon.stratigraphyHierarchy',
          fields: ['stratigraphy_hierarchy'],
        },
        taxonHierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'taxon.taxonHierarchy',
          fields: ['taxon_hierarchy'],
        },

        // hierarchy: {
        //   value: null,
        //   type: 'object',
        //   searchField: 'hierarchy_string',
        //   lookUpType: 'startsWith',
        //   label: 'taxon.hierarchy',
        //   fields: [
        //     'stratigraphy_hierarchy',
        //     'age_hierarchy',
        //     'lithostratigraphy_hierarchy',
        //   ],
        // },
        author: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'taxon.author',
          fields: ['author_year'],
        },
      },
      allIds: [
        'species',
        'stratigraphyHierarchy',
        'taxonHierarchy',
        'stratigraphy',
        'locality',
        'author',
      ],
    },
  }
}

export default initState
