export * from './tabs'
export * from './headers'
export * from './chart'

export const ANALYSIS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const ANALYTICAL_DATA = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id_l'],
    sortDesc: [true],
  },
}

export const DATASET_ANALYSIS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ATTACHMENT = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ATTACHMENT_LINK = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_AUTHORS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_GEOLOCATIONS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const IMAGE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const SAMPLE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const SPECIMEN = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const LOCALITY_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const STRATIGRAPHY_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['year'],
    sortDesc: [true],
  },
}

export const SAMPLE_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SITE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const PREPARATION = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const LOCALITY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const DRILLCORE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const STRATOTYPE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
}

export const SYNONYM = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}
export const STRATIGRAPHY_SYNONYM = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DESCRIPTION = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
}

export const TAXON_LIST = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const TAXON = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ANALYSIS_RESULT = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ROCK = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DOI = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const STRATIGRAPHY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN_IDENTIFICATION = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN_IDENTIFICATION_GEOLOGY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    rock: (locale) => 'rock__name,rock__name_en',
    name: (locale) => 'name',
    name_en: (locale) => 'name_en',
    agent: (locale) => 'agent__agent',
    dateIdentified: (locale) => 'date_identified',
    reference: (locale) => 'reference__reference',
    type: (locale) => (locale === 'et' ? 'type__value' : 'type__value_en'),
    remarks: (locale) => 'remarks',
    current: (locale) => 'current',
  },
}

export const SPECIMEN_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}
