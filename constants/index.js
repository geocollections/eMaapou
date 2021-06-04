export const ANALYSIS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_l',
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

export const ANALYTICAL_DATA = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id_l'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_l',
    analysis_method: (locale) =>
      locale === 'et' ? 'analysis_method' : 'analysis_method_en',
    sample_number: (locale) => 'sample_number,sample_id_sl',
    locality: (locale) => 'locality,locality_id_sl,site,site_id_sl',
    stratigraphy: (locale) =>
      locale === 'et'
        ? 'stratigraphy,stratigraphy_id_sl'
        : 'stratigraphy_en,stratigraphy_id_sl',
    lithostratigraphy: (locale) =>
      locale === 'et'
        ? 'lithostratigraphy,lithostratigraphy_id_sl'
        : 'lithostratigraphy_en,lithostratigraphy_id_sl',
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    rock: (locale) =>
      locale === 'et'
        ? 'rock,rock_txt,rock_id_sl'
        : 'rock_en,rock_en_txt,rock_id_sl',
    reference: (locale) => 'reference,reference_id_sl',
    dataset_id: (locale) => 'dataset_id_sl,dataset_name',
    analysis_id: (locale) => 'analysis_id_sl',
  },
}

export const DATASET_ANALYSIS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    analysis: (locale) => 'id_l',
    sample: (locale) => 'sample_id_sl',
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    lithostratigraphy: (locale) =>
      locale === 'et' ? 'lithostratigraphy' : 'lithostratigraphy_en',
    locality: (locale) => 'locality',
    depth: (locale) => 'depth',
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
    id: (locale) => 'id',
    format_value: (locale) => 'format_value',
    image_number: (locale) => 'image_number',
    agent: (locale) => 'agent',
    date: (locale) => 'date_created,date_created_free',
    reference: (locale) => 'reference',
    type: (locale) => 'type',
    image: (locale) => 'uuid_filename',
    description: (locale) =>
      locale === 'et'
        ? 'attachment__description'
        : 'attachment__description_en',
    attachment__author__agent: (locale) => 'attachment__author__agent',
  },
}

export const DATASET_AUTHORS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    // id: (locale) => 'id',
    // dataset: (locale) => 'dataset',
    // agent: (locale) => 'agent',
    affiliation: (locale) => 'affiliation',
    name: (locale) => 'agent__agent',
    remarks: (locale) => 'remarks',
    type: (locale) => 'agent_type__value',
  },
}

export const DATASET_GEOLOCATIONS = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    // id: (locale) => 'id',
    // dataset: (locale) => 'dataset',
    // agent: (locale) => 'agent',

    name: (locale) =>
      locale === 'et' ? 'locality__locality' : 'locality__locality_en',
    latitude: (locale) => 'point_latitude',
    longitude: (locale) => 'point_longitude',
  },
}

export const IMAGE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_sl',
    image_number: (locale) => 'image_number',
    agent: (locale) => 'agent',
    date: (locale) => 'date_created_dt,date_created_free',
    locality: (locale) => (locale === 'et' ? 'locality' : 'locality_en'),
    image_object: (locale) => 'image_object',
    tags: (locale) => 'tags',
  },
}

export const SAMPLE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_l',
    number: (locale) => 'number',
    locality: (locale) =>
      locale === 'et' ? 'locality,site_name' : 'locality_en,site_name_en',
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    lithostratigraphy: (locale) =>
      locale === 'et' ? 'lithostratigraphy' : 'lithostratigraphy_en',
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
    locality: (locale) => (locale === 'et' ? 'locality' : 'locality_en'),
    depth: (locale) => 'depth',
    depth_interval: (locale) => 'depth_interval',
    fossilgroup: (locale) => 'fossilgroup',
    kind: (locale) => (locale === 'et' ? 'specimen_kind' : 'specimen_kind_en'),
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    lithostratigraphy: (locale) =>
      locale === 'et' ? 'lithostratigraphy' : 'lithostratigraphy_en',
    taxon: (locale) => 'taxon',
    rock: (locale) => (locale === 'et' ? 'rock' : 'rock_en'),
    image: (locale) => 'image',
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

export const DATASET_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    reference: (locale) => 'reference__reference',
    title: (locale) => 'reference__title',
    pages: (locale) => 'reference__pages',
    journal: (locale) => 'reference__journal__journal_name',
  },
}

export const STRATIGRAPHY_REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['year'],
    sortDesc: [true],
  },
  queryFields: {
    reference: (locale) => 'reference__reference',
    year: (locale) => 'reference__year',
    pages: (locale) => 'pages',
    remarks: (locale) => 'remarks',
    content: (locale) => (locale === 'et' ? 'content' : 'content_en'),
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
    id: (locale) => 'id_l',
    name: (locale) => 'name',
    latitude: (locale) => 'latitude',
    longitude: (locale) => 'longitude',
    area: (locale) => (locale === 'et' ? 'area_name' : 'area_name_en'),
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
    depth: (locale) => 'depth,depth_interval',
    stratigraphy: (locale) =>
      locale === 'et'
        ? 'stratigraphy,lithostratigraphy'
        : 'stratigraphy_en,lithostratigraphy_en',
    agent: (locale) => 'agent',
    mass: (locale) => 'mass',
  },
}

export const LOCALITY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_l',
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
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'id_l',
    drillcore: (locale) => (locale === 'et' ? 'drillcore' : 'drillcore_en'),
    depth: (locale) => 'depth',
    boxes: (locale) => 'boxes',
    box_numbers: (locale) => 'box_numbers',
    core_repository: (locale) =>
      locale === 'et' ? 'core_repository' : 'core_repository_en',
    year: (locale) => 'year',
    acronym: (locale) => 'acronym',
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
    locality: (locale) =>
      locale === 'et' ? 'locality__locality' : 'locality__locality_en',
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
export const STRATIGRAPHY_SYNONYM = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    synonym: (locale) => 'synonym',
    language: (locale) =>
      locale === 'et' ? 'language__value' : 'language__value_en',
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

export const TAXON_LIST = {
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

export const TAXON = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    fossil_group: (locale) => 'fossil_group',
    taxon: (locale) => 'taxon',
    author_year: (locale) => 'author_year',
    parent_taxon: (locale) => 'parent_taxon',
    fad: (locale) => (locale === 'et' ? 'fad' : 'fad_en'),
    lad: (locale) => (locale === 'et' ? 'lad' : 'lad_en'),
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

export const ROCK = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    name: (locale) => 'name',
    name_en: (locale) => 'name_en',
    formula: (locale) => 'formula,formula_html',
    in_estonia: (locale) => 'in_estonia',
    mindat_id: (locale) => 'mindat_id',
  },
}

export const DOI = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    identifier: (locale) => 'identifier',
    creators: (locale) => 'creators',
    reference_year: (locale) => 'reference_year',
    title: (locale) => 'title',
    resource: (locale) => 'resource',
    datacite_created: (locale) => 'datacite_created',
  },
}

export const DATASET = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
  },
  queryFields: {
    id: (locale) => 'dataset_id',
    name: (locale) => (locale === 'et' ? 'name' : 'name_en'),
    date: (locale) => 'date,date_txt',
    database_acronym: (locale) => 'database_acronym',
  },
}

export const REFERENCE = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    reference: (locale) => 'reference',
    author: (locale) => 'author',
    year: (locale) => 'year',
    title: (locale) => 'title',
    journal: (locale) => 'journal__journal_name,book',
    pages: (locale) => 'pages',
    doi: (locale) => 'doi',
    remarks: (locale) => 'remarks',
  },
}

export const STRATIGRAPHY = {
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  queryFields: {
    id: (locale) => 'id',
    stratigraphy: (locale) =>
      locale === 'et' ? 'stratigraphy' : 'stratigraphy_en',
    index_main: (locale) => 'index_main',
    index_additional: (locale) => 'index_additional',
    stratigraphy_type: (locale) =>
      locale === 'et' ? 'stratigraphy_type' : 'stratigraphy_type_en',
    stratigraphy_rank: (locale) =>
      locale === 'et' ? 'stratigraphy_rank' : 'stratigraphy_rank_en',
    stratigraphy_scope: (locale) =>
      locale === 'et' ? 'stratigraphy_scope' : 'stratigraphy_scope_en',
    parent_stratigraphy: (locale) =>
      locale === 'et' ? 'parent_stratigraphy' : 'parent_stratigraphy_en',
    age_stratigraphy: (locale) =>
      locale === 'et' ? 'age_stratigraphy' : 'age_stratigraphy_en',
    age: (locale) => 'age_base,age_top',
    ageBase: (locale) => 'age_base',
    ageTop: (locale) => 'age_top',
  },
}
