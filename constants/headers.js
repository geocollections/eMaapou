export const HEADERS_ANALYSIS_RESULT = {
  byIds: {
    parameter: {
      text: 'analysisResult.parameter',
      value: 'parameter',
      show: true,
      sortValue: 'parameter',
    },
    analysis_method: {
      text: 'analysisResult.method',
      value: 'analysis_method',
      show: true,
      sortValue: 'analysis_method',
    },
    depth: {
      text: 'analysisResult.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth',
    },
    depth_interval: {
      text: 'analysisResult.depthInterval',
      value: 'depth_interval',
      show: true,
      sortValue: 'depth_interval',
    },
    value: { text: 'analysisResult.value', value: 'value', show: true },
    value_txt: {
      text: 'analysisResult.valueText',
      value: 'value_txt',
      show: true,
      sortValue: 'value_txt',
    },
    value_error: {
      text: 'analysisResult.valueError',
      value: 'value_error',
      show: true,
      sortValue: 'value_error',
    },
  },
  allIds: [
    'parameter',
    'analysis_method',
    'depth',
    'depth_interval',
    'value',
    'value_txt',
    'value_error',
  ],
}

export const HEADERS_ANALYSIS = {
  byIds: {
    id: { text: 'analysis.id', value: 'id', show: true, sortValue: 'id_l' },
    sample_number: {
      text: 'analysis.sampleNumber',
      value: 'sample_number',
      show: true,
      sortValue: 'sample_number',
    },
    locality: {
      text: 'analysis.locality',
      value: 'locality',
      show: true,
      sortValue: { et: 'locality', en: 'locality_en' },
    },
    depth: {
      text: 'analysis.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth',
    },
    depth_interval: {
      text: 'analysis.depthInterval',
      value: 'depth_interval',
      show: true,
      sortValue: 'depth_interval',
    },
    method: {
      text: 'analysis.method',
      value: 'method',
      show: true,
      sortValue: { et: 'analysis_method', en: 'analysis_method_en' },
    },
    method_details: {
      text: 'analysis.methodDetails',
      value: 'method_details',
      show: true,
      sortValue: { et: 'method_details', en: 'method_details_en' },
    },
    agent: {
      text: 'analysis.analysedBy',
      value: 'agent',
      show: true,
      sortValue: 'agent',
    },
    date: {
      text: 'analysis.date',
      value: 'date',
      show: true,
      sortValue: 'date',
    },
  },
  allIds: [
    'id',
    'sample_number',
    'locality',
    'depth',
    'depth_interval',
    'method',
    'method_details',
    'agent',
    'date',
  ],
}

export const HEADERS_ANALYTICAL_DATA = {
  byIds: {
    id_l: {
      text: 'analyticalData.id',
      value: 'id_l',
      show: true,
      sortValue: 'id_l',
    },
    analysis_method: {
      text: 'analyticalData.analysisMethod',
      value: 'analysis_method',
      show: true,
      sortValue: { et: 'analysis_method', en: 'analysis_method_en' },
    },
    sample_number: {
      text: 'analyticalData.sample',
      value: 'sample_number',
      show: true,
      sortValue: 'sample_number,sample_id_sl',
    },
    locality: {
      text: 'analyticalData.locality',
      value: 'locality',
      show: true,
      sortValue: 'locality,locality_id_sl,site,site_id_sl',
    },
    stratigraphy: {
      text: 'analyticalData.stratigraphy',
      value: 'stratigraphy',
      show: true,
      sortValue: {
        et: 'stratigraphy,stratigraphy_id_sl',
        en: 'stratigraphy_en,stratigraphy_id_sl',
      },
    },
    lithostratigraphy: {
      text: 'analyticalData.lithostratigraphy',
      value: 'lithostratigraphy',
      show: true,
      sortValue: {
        et: 'lithostratigraphy,lithostratigraphy_id_sl',
        en: 'lithostratigraphy_en,lithostratigraphy_id_sl',
      },
    },
    depth: {
      text: 'analyticalData.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth',
    },
    depth_interval: {
      text: 'analyticalData.depthInterval',
      value: 'depth_interval',
      show: true,
      sortValue: 'depth_interval',
    },
    rock: {
      text: 'analyticalData.rock',
      value: 'rock',
      show: true,
      sortValue: {
        et: 'rock,rock_txt,rock_id_sl',
        en: 'rock_en,rock_en_txt,rock_id_sl',
      },
    },
    reference: {
      text: 'analyticalData.reference',
      value: 'reference',
      show: true,
      sortValue: 'reference,reference_id_sl',
    },
    dataset_id: {
      text: 'analyticalData.dataset',
      value: 'dataset_id',
      show: true,
      sortValue: 'dataset_id_sl,dataset_name',
    },
    analysis_id: {
      text: 'analyticalData.analysis',
      value: 'analysis_id',
      show: true,
      sortValue: 'analysis_id_sl',
    },
  },
  allIds: [
    'id_l',
    'analysis_method',
    'sample_number',
    'locality',
    'stratigraphy',
    'lithostratigraphy',
    'depth',
    'depth_interval',
    'rock',
    'reference',
    'dataset_id',
    'analysis_id',
  ],
}

export const HEADERS_ATTACHMENT_SOLR = {
  byIds: {
    id: { text: 'attachment.id', value: 'id', show: true, sortValue: 'id' },
    format_value: {
      text: 'attachment.format',
      value: 'format_value',
      show: true,
      sortValue: 'format_value',
    },
    image_number: {
      text: 'attachment.image_number',
      value: 'image_number',
      show: true,
      sortValue: 'image_number',
    },
    agent: {
      text: 'attachment.author',
      value: 'agent',
      show: true,
      sortValue: 'agent',
    },
    date: {
      text: 'attachment.date',
      value: 'date',
      show: true,
      sortValue: 'date_created,date_created_free',
    },
    reference: {
      text: 'attachment.reference',
      value: 'reference',
      show: true,
      sortValue: 'reference',
    },
    type: {
      text: 'attachment.type',
      value: 'type',
      show: true,
      sortValue: 'type',
    },
    image: {
      text: 'attachment.image',
      value: 'image',
      show: true,
      sortValue: 'uuid_filename',
      sortable: false,
    },
  },
  allIds: [
    'id',
    'format_value',
    'image_number',
    'agent',
    'date',
    'reference',
    'type',
    'image',
  ],
}

export const HEADERS_ATTACHMENT = {
  byIds: {
    file: {
      text: 'attachment.file',
      value: 'file',
      width: '120px',
      show: true,
      sortable: false,
    },
    description: {
      text: 'attachment.description',
      value: 'description',
      show: true,
      sortValue: {
        et: 'attachment__description',
        en: 'attachment__description_en',
      },
    },
    agent: {
      text: 'attachment.author',
      value: 'agent',
      show: true,
      sortValue: 'attachment__author__agent',
    },
  },
  allIds: ['file', 'description', 'agent'],
}

export const HEADERS_DATASET = {
  byIds: {
    id: {
      text: 'dataset.id',
      value: 'id',
      show: true,
      sortValue: 'dataset_id',
    },
    name: {
      text: 'dataset.name',
      value: 'name',
      show: true,
      sortValue: { et: 'name', en: 'name_en' },
    },
    date: {
      text: 'dataset.date',
      value: 'date',
      show: true,
      sortValue: 'date,date_txt',
    },
    database: {
      text: 'dataset.database',
      value: 'database_acronym',
      show: true,
      sortValue: 'database_acronym',
    },
  },
  allIds: ['id', 'name', 'date', 'database'],
}

export const HEADERS_DATASET_ANALYSIS = {
  byIds: {
    analysis: {
      text: 'datasetAnalysis.analysis',
      value: 'analysis',
      show: true,
      sortValue: 'id_l',
    },
    sample: {
      text: 'datasetAnalysis.sampleNumber',
      value: 'sample',
      show: true,
      sortValue: 'sample_id_sl',
    },
    locality: {
      text: 'datasetAnalysis.locality',
      value: 'locality',
      show: true,
      sortValue: 'locality',
    },
    stratigraphy: {
      text: 'datasetAnalysis.stratigraphy',
      value: 'stratigraphy',
      show: true,
      sortValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
    lithostratigraphy: {
      text: 'datasetAnalysis.lithostratigraphy',
      value: 'lithostratigraphy',
      show: true,
      sortValue: { et: 'lithostratigraphy', en: 'lithostratigraphy_en' },
    },
    depth: {
      text: 'datasetAnalysis.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth',
    },
  },
  allIds: ['sample', 'locality', 'stratigraphy', 'lithostratigraphy', 'depth'],
}

export const HEADERS_DATASET_AUTHOR = {
  byIds: {
    name: {
      text: 'datasetAuthor.name',
      value: 'name',
      show: true,
      sortValue: 'agent__agent',
    },
    affiliation: {
      text: 'datasetAuthor.affiliation',
      value: 'affiliation',
      show: true,
      sortValue: 'affiliation',
    },
    type: {
      text: 'datasetAuthor.type',
      value: 'type',
      show: true,
      sortValue: 'agent_type_value',
    },
  },
  allIds: ['name', 'affiliation', 'type'],
}

export const HEADERS_DATASET_GEOLOCATION = {
  byIds: {
    name: {
      text: 'datasetGeolocation.name',
      value: 'name',
      show: true,
      sortValue: { et: 'locality__locality', en: 'locality__locality_en' },
    },
    longitude: {
      text: 'datasetGeolocation.longitude',
      value: 'longitude',
      show: true,
      sortValue: 'point_latitude',
    },
    latitude: {
      text: 'datasetGeolocation.latitude',
      value: 'latitude',
      show: true,
      sortValue: 'point_longitude',
    },
    is_polygon: {
      text: 'datasetGeolocation.isPolygon',
      value: 'is_polygon',
      sortable: false,
      show: true,
    },
  },
  allIds: [],
}

export const HEADERS_DATASET_REFERENCE = {
  byIds: {
    reference: {
      text: 'reference.reference',
      value: 'reference',
      show: true,
      sortValue: 'reference__reference',
    },
    title: {
      text: 'reference.title',
      value: 'title',
      show: true,
      sortValue: 'reference__title',
    },
    journal: {
      text: 'reference.journalBook',
      value: 'journal',
      show: true,
      sortValue: 'reference__pages',
    },
    pages: {
      text: 'reference.pages',
      value: 'pages',
      show: true,
      sortValue: 'reference__journal__journal_name',
    },
  },
  allIds: ['reference', 'title', 'journal', 'pages'],
}

export const HEADERS_DESCRIPTION = {
  byIds: {
    depth_top: {
      text: 'localityDescription.depthTop',
      value: 'depth_top',
      show: true,
      sortValue: 'depth_top',
    },
    depth_base: {
      text: 'localityDescription.depthBase',
      value: 'depth_base',
      show: true,
      sortValue: 'depth_base',
    },
    thickness: {
      text: 'localityDescription.thickness',
      value: 'thickness',
      sortable: false,
      class: 'static-cell-header',
      cellClass: 'static-cell',
      show: true,
    },
    rock: {
      text: 'localityDescription.rock',
      value: 'rock',
      show: true,
      sortValue: { et: 'rock_name', en: 'rock_name_en' },
    },
    stratigraphy: {
      text: 'localityDescription.stratigraphy',
      value: 'stratigraphy',
      show: true,
      sortValue: {
        et: 'stratigraphy__stratigraphy',
        en: 'stratigraphy__stratigraphy_en',
      },
    },
    author: {
      text: 'localityDescription.author',
      value: 'author',
      sortable: false,
      show: true,
      sortValue: 'reference__reference,agent__agent,author_free',
    },
    expand: {
      text: 'localityDescription.details',
      value: 'data-table-expand',
      align: 'center',
      sortable: false,
      show: true,
    },
  },
  allIds: [
    'depth_top',
    'depth_base',
    'thickness',
    'rock',
    'stratigraphy',
    'author',
    'expand',
  ],
}

export const HEADERS_DOI = {
  byIds: {
    identifier: {
      text: 'doi.identifier',
      value: 'identifier',
      show: true,
      sortValue: 'identfier',
    },
    creator: {
      text: 'doi.creators',
      value: 'creators',
      show: true,
      sortValue: 'creators',
    },
    reference_year: {
      text: 'doi.reference_year',
      value: 'reference_year',
      show: true,
      sortValue: 'reference_year',
    },
    title: {
      text: 'doi.table_title',
      value: 'title',
      show: true,
      sortValue: 'title',
    },
    resource: {
      text: 'doi.resource',
      value: 'resource',
      show: true,
      sortValue: 'resource',
    },
    datacite_created: {
      text: 'doi.datacite_created',
      value: 'datacite_created',
      show: true,
      sortValue: 'datacite_created',
    },
  },
  allIds: [
    'identifier',
    'creator',
    'reference_year',
    'title',
    'resource',
    'datacite_created',
  ],
}

export const HEADERS_DRILLCORE = {
  byIds: {
    id: { text: 'drillcore.id', value: 'id', show: true, sortValue: 'id_l' },
    drillcore: {
      text: 'drillcore.name',
      value: 'drillcore',
      show: true,
      sortValue: { et: 'drillcore', en: 'drillcore_en' },
    },
    depth: {
      text: 'drillcore.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth',
    },
    boxes: {
      text: 'drillcore.boxes',
      value: 'boxes',
      show: true,
      sortValue: 'boxes',
    },
    box_numbers: {
      text: 'drillcore.boxNumbers',
      value: 'box_numbers',
      show: true,
      sortValue: 'box_numbers',
    },
    year: {
      text: 'drillcore.year',
      value: 'year',
      show: true,
      sortValue: 'year',
    },
    core_repository: {
      text: 'drillcore.storage',
      value: 'core_repository',
      show: true,
      sortValue: { et: 'core_repository', en: 'core_repository_en' },
    },
    acronym: {
      text: 'drillcore.acronym',
      value: 'acronym',
      show: true,
      sortValue: 'acronym',
    },
  },
  allIds: [
    'id',
    'drillcore',
    'depth',
    'boxes',
    'box_numbers',
    'year',
    'core_repository',
    'acronym',
  ],
}

export const HEADERS_LOCALITY = {
  byIds: {
    id: { text: 'locality.id', value: 'id', show: true, sortValue: 'id_l' },
    locality: {
      text: 'locality.name',
      value: 'locality',
      show: true,
      sortValue: { et: 'locality', en: 'locality_en' },
    },
    country: {
      text: 'locality.country',
      value: 'country',
      show: true,
      sortValue: { et: 'country', en: 'country_en' },
    },
    latitude: {
      text: 'locality.latitude',
      value: 'latitude',
      show: true,
      sortValue: 'latitude',
    },
    longitude: {
      text: 'locality.longitude',
      value: 'longitude',
      show: true,
      sortValue: 'longitude',
    },
  },
  allIds: ['id', 'locality', 'country', 'latitude', 'longitude'],
}

export const HEADERS_LOCALITY_REFERENCE = {
  byIds: {
    reference: {
      text: 'localityReference.reference',
      value: 'reference',
      show: true,
      sortValue: 'reference__reference',
    },
    title: {
      text: 'localityReference.referenceTitle',
      value: 'title',
      show: true,
      sortValue: 'reference__title',
    },
    pages: {
      text: 'localityReference.pages',
      value: 'pages',
      show: true,
      sortValue: 'pages',
    },
    remarks: {
      text: 'localityReference.remarks',
      value: 'remarks',
      show: true,
      sortValue: 'remarks',
    },
  },
  allIds: ['reference', 'title', 'pages', 'remarks'],
}

export const HEADERS_PHOTO = {
  byIds: {
    id: { text: 'photo.id', value: 'id', show: true, sortValue: 'id_sl' },
    image_number: {
      text: 'photo.number',
      value: 'image_number',
      show: true,
      sortValue: 'image_number',
    },
    agent: {
      text: 'photo.agent',
      value: 'agent',
      show: true,
      sortValue: 'agent',
    },
    date: {
      text: 'photo.date',
      value: 'date',
      show: true,
      sortValue: 'date_created_dt,date_created_free',
    },
    locality: {
      text: 'photo.locality',
      value: 'locality',
      show: true,
      sortValue: { et: 'locality', en: 'locality_en' },
    },
    image_object: {
      text: 'photo.imageObject',
      value: 'image_object',
      show: true,
      sortValue: 'image_object',
    },
    tags: { text: 'photo.tags', value: 'tags', show: true, sortValue: 'tags' },
  },
  allIds: [
    'id',
    'image_number',
    'agent',
    'date',
    'locality',
    'image_object',
    'tags',
  ],
}

export const HEADERS_PREPARATION = {
  byIds: {
    id: { text: 'preparation.id', value: 'id', show: true, sortValue: 'id' },
    preparation_number: {
      text: 'preparation.preparation_number',
      value: 'preparation_number',
      show: true,
      sortValue: 'preparation_number',
    },
    locality: {
      text: 'preparation.locality',
      value: 'locality',
      show: true,
      sortValue: { et: 'locality', en: 'locality_en' },
    },
    depth: {
      text: 'preparation.depth',
      value: 'depth',
      show: true,
      sortValue: 'depth,depth_interval',
    },
    stratigraphy: {
      text: 'preparation.stratigraphy',
      value: 'stratigraphy',
      show: true,
      sortValue: {
        et: 'stratigraphy,lithostratigraphy',
        en: 'stratigraphy_en,lithostratigraphy_en',
      },
    },
    agent: {
      text: 'preparation.agent',
      value: 'agent',
      show: true,
      sortValue: 'agent',
    },
    mass: {
      text: 'preparation.mass',
      value: 'mass',
      show: true,
      sortValue: 'mass',
    },
  },
  allIds: [
    'id',
    'preparation_number',
    'locality',
    'depth',
    'stratigraphy',
    'agent',
    'mass',
  ],
}
