import { IOptions } from '~/services'

export * from './tabs'
export * from './headers'
export * from './chart'
export * from './browse'
export * from './services'

type ResourceDefaults = {
  options: IOptions
}

export const ANALYSIS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ANALYTICAL_DATA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const AREA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_ANALYSIS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ATTACHMENT: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ATTACHMENT_LINK: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_AUTHORS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_GEOLOCATIONS: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const IMAGE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
}

export const SAMPLE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const LOCALITY_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const STRATIGRAPHY_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['year'],
    sortDesc: [true],
  },
}

export const SAMPLE_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SITE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const PREPARATION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const LOCALITY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DRILLCORE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const STRATOTYPE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
}

export const SYNONYM: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}
export const STRATIGRAPHY_SYNONYM: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DESCRIPTION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
}

export const TAXON_LIST: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const TAXON: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ANALYSIS_RESULT: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const ROCK: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DOI: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const DATASET: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const STRATIGRAPHY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN_IDENTIFICATION: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN_IDENTIFICATION_GEOLOGY: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SPECIMEN_REFERENCE: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}

export const SAMPLE_DATA: ResourceDefaults = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
}
