export const ANALYSIS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    sample_number: (locale) => 'sample_number',
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    method: (locale) =>
      locale === 'et' ? 'analysis_method' : 'analysis_method_en',
    method_details: (locale) =>
      locale === 'et' ? 'method_details' : 'method_details_en',
    agent: (locale) => 'agent',
    date: (locale) => 'date',
  },
}

export const ATTACHMENT = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    description: (locale) =>
      locale === 'et'
        ? 'attachment__description'
        : 'attachment__description_en',
    attachment__author__agent: (locale) => 'attachment__author__agent',
  },
}

export const SAMPLE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    number: (locale) => 'number',
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    collector: (locale) => 'collector',
    date_collected: (locale) => 'date_collected',
  },
}

export const SPECIMEN = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    specimen_number: (locale) => 'specimen_number',
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    fossilgroup: (locale) => 'fossilgroup',
    kind: (locale) => (locale === 'et' ? 'specimen_kind' : 'specimen_kind_en'),
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    taxon: (locale) => 'taxon',
  },
}

export const LOCALITY_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    reference: (locale) => 'reference__reference',
    reference__title: (locale) => 'reference__title',
    pages: (locale) => 'pages',
    remarks: (locale) => 'remarks',
  },
}

export const SAMPLE_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    reference: (locale) => 'reference__reference',
    reference__title: (locale) => 'reference__title',
    pages: (locale) => 'pages',
    remarks: (locale) => 'remarks',
  },
}

export const SITE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id',
    name: (locale) => (locale === 'et' ? 'name' : 'name_en'),
    x: (locale) => 'x',
    y: (locale) => 'y',
    z: (locale) => 'z',
    depth: (locale) => 'depth',
  },
}

export const PREPARATION = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    preparation_number: (locale) => 'preparation_number',
    locality: (locale) => (locale === 'et' ? 'locality' : 'locality_en'),
    depth: (locale) => 'depth',
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    agent: (locale) => 'agent',
    mass: (locale) => 'mass',
  },
}

export const LOCALITY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    locality: (locale) => (locale === 'et' ? 'locality' : 'locality_en'),
    country: (locale) => (locale === 'et' ? 'country' : 'country_en'),
    latitude: (locale) => 'latitude',
    longitude: (locale) => 'longitude',
  },
}

export const DRILLCORE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    drillcore: (locale) => (locale === 'et' ? 'drillcore' : 'drillcore_en'),
    depth: (locale) => 'depth',
    boxes: (locale) => 'boxes',
    box_numbers: (locale) => 'box_numbers',
    storage__location: (locale) => 'storage__location',
    year: (locale) => 'year',
    remarks: (locale) => 'remarks',
  },
}

export const STRATOTYPE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
  queryFields: {
    stratigraphy: (locale) =>
      locale === 'et'
        ? 'stratigraphy__stratigraphy'
        : 'stratigraphy__stratigraphy_en',
    type: (locale) =>
      locale === 'et' ? 'stratotype_type__value' : 'stratotype_type__value_en',
    reference: (locale) => 'reference__reference',
    remarks: (locale) => 'remarks',
    depth_top: (locale) => 'depth_top',
    depth_base: (locale) => 'depth_base',
  },
}

export const SYNONYM = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    synonym: (locale) => 'synonym',
    pages: (locale) => 'pages',
    reference__reference: (locale) => 'reference__reference',
    remarks: (locale) => 'remarks',
  },
}

export const DESCRIPTION = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['depth_top', 'depth_base'],
    sortDesc: [false, true],
  },
  queryFields: {
    rock: (locale) => {
      return locale === 'et' ? 'rock__name' : 'rock__name_en'
    },
    stratigraphy: (locale) => {
      return locale === 'et'
        ? 'stratigraphy__stratigraphy'
        : 'stratigraphy__stratigraphy_en'
    },
    description: (locale) => 'description',
    depth_top: (locale) => 'depth_top',
    depth_base: (locale) => 'depth_base',
    author: (locale) => 'reference__reference,agent__agent,author_free',
  },
}

export const TAXON = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    taxon: (locale) => 'taxon__taxon',
    name: (locale) => 'name',
    frequency: (locale) => 'frequency',
    agent_identified: (locale) =>
      'agent_identified__agent,agent_identified_txt',
    date_identified: (locale) => 'date_identified,date_identified_free',
    extra: (locale) => 'extra',
    remarks: (locale) => 'remarks',
  },
}

export const ANALYSIS_RESULT = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    parameter: (locale) => 'parameter',
    value: (locale) => 'value',
    value_txt: (locale) => 'value_txt',
    value_error: (locale) => 'value_error',
  },
}

export const DRILLCORE_BOX = {
  queryFields: {
    boxNumber: (locale) => 'drillcore_box__number',
    stratigraphyTop: (locale) =>
      locale === 'et'
        ? 'drillcore_box__stratigraphy_top__stratigraphy'
        : 'drillcore_box__stratigraphy_top__stratigraphy_en',
    stratigraphyBase: (locale) =>
      locale === 'et'
        ? 'drillcore_box__stratigraphy_base__stratigraphy'
        : 'drillcore_box__stratigraphy_base__stratigraphy_en',
  },
}
