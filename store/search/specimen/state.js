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
          fields: [
            'specimen_full_name',
            'specimen_number',
            'specimen_number_old',
          ],
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
        fossilName: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.fossilName',
          fields: ['taxon', 'taxon_txt', 'taxon_full'],
        },
        rock: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'specimen.rockName',
          fields: ['rock', 'rock_en', 'rock_txt', 'rock_txt_en'],
        },
        stratigraphyHierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'specimen.stratigraphyHierarchy',
          fields: ['stratigraphy_hierarchy', 'age_hierarchy'],
        },
        hierarchy: {
          value: null,
          type: 'object',
          searchField: 'hierarchy_string',
          lookUpType: 'startsWith',
          label: 'specimen.taxon',
          fields: ['hierarchy_string'],
        },
        reference: {
          value: null,
          type: 'object',
          searchField: 'reference',
          lookUpType: 'equals',
          label: 'specimen.reference',
          fields: ['specimen_references'],
        },
        has_image: {
          value: false,
          type: 'boolean',
          searchField: 'has_image',
          lookUpType: 'equals',
          label: 'specimen.has_image',
          fields: ['has_image'],
        },
        has_map: {
          value: false,
          type: 'boolean',
          searchField: 'has_map',
          lookUpType: 'equals',
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
