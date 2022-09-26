/*
  DOCS: File for the headers of each tabels.

  byIds - definitions of table headers.
  allIds - array of keys found in byIds. Defines the order in which the headers appear in the table

  Header definition:
  key: {
    text: String (key to the i18n translation)
    value: String ()
    show: Boolean (field indicating if the field should be shown when table first rendered)
    field: String/Object (API field that are used when sorting and searching is done)
    **vuetify DataTableHeader properties https://vuetifyjs.com/en/api/v-data-table/#props
  }
  NOTE: If in the future there is a need for text fields that should not be translated using i18n, add a boolean field to check if text needs to be translated
*/

export const HEADERS_ANALYSIS_RESULT = {
  byIds: {
    parameter: {
      text: 'analysisResult.parameter',
      value: 'parameter',
      show: true,
      apiFieldValue: 'parameter',
    },
    analysis_method: {
      text: 'analysisResult.method',
      value: 'analysis_method',
      show: true,
      apiFieldValue: 'analysis_method',
    },
    depth: {
      text: 'analysisResult.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    depth_interval: {
      text: 'analysisResult.depthInterval',
      value: 'depth_interval',
      show: true,
      apiFieldValue: 'depth_interval',
    },
    value: { text: 'analysisResult.value', value: 'value', show: true },
    value_txt: {
      text: 'analysisResult.valueText',
      value: 'value_txt',
      show: true,
      apiFieldValue: 'value_txt',
    },
    value_error: {
      text: 'analysisResult.valueError',
      value: 'value_error',
      show: true,
      apiFieldValue: 'value_error',
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
    id: { text: 'analysis.id', value: 'id', show: true, apiFieldValue: 'id_l' },
    sample_number: {
      text: 'analysis.sampleNumber',
      value: 'sample_number',
      show: true,
      apiFieldValue: 'sample_number',
    },
    locality: {
      text: 'analysis.locality',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality', en: 'locality_en' },
    },
    depth: {
      text: 'analysis.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    depth_interval: {
      text: 'analysis.depthInterval',
      value: 'depth_interval',
      show: true,
      apiFieldValue: 'depth_interval',
    },
    method: {
      text: 'analysis.method',
      value: 'method',
      show: true,
      apiFieldValue: { et: 'analysis_method', en: 'analysis_method_en' },
    },
    method_details: {
      text: 'analysis.methodDetails',
      value: 'method_details',
      show: true,
      apiFieldValue: { et: 'method_details', en: 'method_details_en' },
    },
    agent: {
      text: 'analysis.analysedBy',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent',
    },
    date: {
      text: 'analysis.date',
      value: 'date',
      show: true,
      apiFieldValue: 'date',
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
      apiFieldValue: 'id_l',
    },
    analysis_method: {
      text: 'analyticalData.analysisMethod',
      value: 'analysis_method',
      show: true,
      apiFieldValue: { et: 'analysis_method', en: 'analysis_method_en' },
    },
    sample_number: {
      text: 'analyticalData.sample',
      value: 'sample_number',
      show: true,
      apiFieldValue: 'sample_number,sample_id_sl',
    },
    locality: {
      text: 'analyticalData.locality',
      value: 'locality',
      show: true,
      apiFieldValue: 'locality,locality_id_sl,site,site_id_sl',
    },
    stratigraphy: {
      text: 'analyticalData.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: {
        et: 'stratigraphy,stratigraphy_id_sl',
        en: 'stratigraphy_en,stratigraphy_id_sl',
      },
    },
    lithostratigraphy: {
      text: 'analyticalData.lithostratigraphy',
      value: 'lithostratigraphy',
      show: true,
      apiFieldValue: {
        et: 'lithostratigraphy,lithostratigraphy_id_sl',
        en: 'lithostratigraphy_en,lithostratigraphy_id_sl',
      },
    },
    depth: {
      text: 'analyticalData.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    depth_interval: {
      text: 'analyticalData.depthInterval',
      value: 'depth_interval',
      show: true,
      apiFieldValue: 'depth_interval',
    },
    rock: {
      text: 'analyticalData.rock',
      value: 'rock',
      show: true,
      apiFieldValue: {
        et: 'rock,rock_txt,rock_id_sl',
        en: 'rock_en,rock_en_txt,rock_id_sl',
      },
    },
    reference: {
      text: 'analyticalData.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference,reference_id_sl',
    },
    dataset_id: {
      text: 'analyticalData.dataset',
      value: 'dataset_id',
      show: true,
      apiFieldValue: 'dataset_id_sl,dataset_name',
    },
    analysis_id: {
      text: 'analyticalData.analysis',
      value: 'analysis_id',
      show: true,
      apiFieldValue: 'analysis_id_sl',
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
export const HEADERS_AREA = {
  byIds: {
    id: {
      text: 'area.id',
      value: 'id',
      show: true,
      apiFieldValue: 'id',
    },
    name: {
      text: 'area.name',
      value: 'name',
      show: true,
      apiFieldValue: { et: 'name', en: 'name_en' },
    },
    county: {
      text: 'area.county',
      value: 'county',
      show: true,
      apiFieldValue: { et: 'maakond', en: 'maakond_en' },
    },
    type: {
      text: 'area.areaType',
      value: 'type',
      show: true,
      apiFieldValue: { et: 'area_type', en: 'area_type_en' },
    },
  },
  allIds: ['id', 'name', 'county', 'type'],
}

export const HEADERS_ATTACHMENT_SOLR = {
  byIds: {
    id: { text: 'attachment.id', value: 'id', show: true, apiFieldValue: 'id' },
    format_value: {
      text: 'attachment.format',
      value: 'format_value',
      show: true,
      apiFieldValue: 'format_value',
    },
    image_number: {
      text: 'attachment.image_number',
      value: 'image_number',
      show: true,
      apiFieldValue: 'image_number',
    },
    agent: {
      text: 'attachment.author',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent',
    },
    date: {
      text: 'attachment.date',
      value: 'date',
      show: true,
      apiFieldValue: 'date_created,date_created_free',
    },
    reference: {
      text: 'attachment.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference',
    },
    type: {
      text: 'attachment.type',
      value: 'type',
      show: true,
      apiFieldValue: 'type',
    },
    image: {
      text: 'attachment.image',
      value: 'image',
      show: true,
      apiFieldValue: 'uuid_filename',
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
      apiFieldValue: {
        et: 'attachment__description',
        en: 'attachment__description_en',
      },
    },
    agent: {
      text: 'attachment.author',
      value: 'agent',
      show: true,
      apiFieldValue: 'attachment__author__agent',
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
      apiFieldValue: 'dataset_id',
    },
    name: {
      text: 'dataset.name',
      value: 'name',
      show: true,
      apiFieldValue: { et: 'name', en: 'name_en' },
    },
    date: {
      text: 'dataset.date',
      value: 'date',
      show: true,
      apiFieldValue: 'date,date_txt',
    },
    database: {
      text: 'dataset.database',
      value: 'database_acronym',
      show: true,
      apiFieldValue: 'database_acronym',
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
      apiFieldValue: 'id_l',
    },
    sample: {
      text: 'datasetAnalysis.sampleNumber',
      value: 'sample',
      show: true,
      apiFieldValue: 'sample_id_sl',
    },
    locality: {
      text: 'datasetAnalysis.locality',
      value: 'locality',
      show: true,
      apiFieldValue: 'locality',
    },
    stratigraphy: {
      text: 'datasetAnalysis.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
    analysis_method: {
      text: 'datasetAnalysis.analysisMethod',
      value: 'analysis_method',
      show: true,
      apiFieldValue: { et: 'analysis_method', en: 'analysis_method_en' },
    },
    lab: {
      text: 'datasetAnalysis.lab',
      value: 'lab',
      show: true,
      apiFieldValue: { et: 'lab', en: 'lab_en' },
    },
  },
  allIds: [
    'analysis',
    'sample',
    'locality',
    'stratigraphy',
    'analysis_method',
    'lab',
  ],
}

export const HEADERS_DATASET_AUTHOR = {
  byIds: {
    name: {
      text: 'datasetAuthor.name',
      value: 'name',
      show: true,
      apiFieldValue: 'agent__agent',
    },
    affiliation: {
      text: 'datasetAuthor.affiliation',
      value: 'affiliation',
      show: true,
      apiFieldValue: 'affiliation',
    },
    type: {
      text: 'datasetAuthor.type',
      value: 'type',
      show: true,
      apiFieldValue: 'agent_type_value',
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
      apiFieldValue: { et: 'locality__locality', en: 'locality__locality_en' },
    },
    longitude: {
      text: 'datasetGeolocation.longitude',
      value: 'longitude',
      show: true,
      apiFieldValue: 'point_latitude',
    },
    latitude: {
      text: 'datasetGeolocation.latitude',
      value: 'latitude',
      show: true,
      apiFieldValue: 'point_longitude',
    },
    is_polygon: {
      text: 'datasetGeolocation.isPolygon',
      value: 'is_polygon',
      sortable: false,
      show: true,
    },
  },
  allIds: ['name', 'longitude', 'latitude', 'is_polygon'],
}

export const HEADERS_DATASET_REFERENCE = {
  byIds: {
    reference: {
      text: 'reference.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    title: {
      text: 'reference.title',
      value: 'title',
      show: true,
      apiFieldValue: 'reference__title',
    },
    journal: {
      text: 'reference.journalBook',
      value: 'journal',
      show: true,
      apiFieldValue: 'reference__pages',
    },
    pages: {
      text: 'reference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'reference__journal__journal_name',
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
      apiFieldValue: 'depth_top',
    },
    depth_base: {
      text: 'localityDescription.depthBase',
      value: 'depth_base',
      show: true,
      apiFieldValue: 'depth_base',
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
      apiFieldValue: { et: 'rock__name', en: 'rock__name_en' },
    },
    stratigraphy: {
      text: 'localityDescription.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: {
        et: 'stratigraphy__stratigraphy',
        en: 'stratigraphy__stratigraphy_en',
      },
    },
    author: {
      text: 'localityDescription.author',
      value: 'author',
      sortable: false,
      show: true,
      apiFieldValue: 'reference__reference,agent__agent,author_free',
    },
    expand: {
      text: 'localityDescription.details',
      value: 'expand',
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
      apiFieldValue: 'identfier',
    },
    creator: {
      text: 'doi.creators',
      value: 'creators',
      show: true,
      apiFieldValue: 'creators',
    },
    reference_year: {
      text: 'doi.reference_year',
      value: 'reference_year',
      show: true,
      apiFieldValue: 'reference_year',
    },
    title: {
      text: 'doi.table_title',
      value: 'title',
      show: true,
      apiFieldValue: 'title',
    },
    resource: {
      text: 'doi.resource',
      value: 'resource',
      show: true,
      apiFieldValue: 'resource',
    },
    datacite_created: {
      text: 'doi.datacite_created',
      value: 'datacite_created',
      show: true,
      apiFieldValue: 'datacite_created',
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
    id: {
      text: 'drillcore.id',
      value: 'id',
      show: true,
      apiFieldValue: 'id_l',
    },
    drillcore: {
      text: 'drillcore.name',
      value: 'drillcore',
      show: true,
      apiFieldValue: { et: 'drillcore', en: 'drillcore_en' },
    },
    depth: {
      text: 'drillcore.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    boxes: {
      text: 'drillcore.boxes',
      value: 'boxes',
      show: true,
      apiFieldValue: 'boxes',
    },
    box_numbers: {
      text: 'drillcore.boxNumbers',
      value: 'box_numbers',
      show: true,
      apiFieldValue: 'box_numbers',
    },
    year: {
      text: 'drillcore.year',
      value: 'year',
      show: true,
      apiFieldValue: 'year',
    },
    core_repository: {
      text: 'drillcore.storage',
      value: 'core_repository',
      show: true,
      apiFieldValue: { et: 'core_repository', en: 'core_repository_en' },
    },
    acronym: {
      text: 'drillcore.acronym',
      value: 'acronym',
      show: true,
      apiFieldValue: 'acronym',
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
    id: { text: 'locality.id', value: 'id', show: true, apiFieldValue: 'id_l' },
    locality: {
      text: 'locality.name',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality', en: 'locality_en' },
    },
    country: {
      text: 'locality.country',
      value: 'country',
      show: true,
      apiFieldValue: { et: 'country', en: 'country_en' },
    },
    latitude: {
      text: 'locality.latitude',
      value: 'latitude',
      show: true,
      apiFieldValue: 'latitude',
    },
    longitude: {
      text: 'locality.longitude',
      value: 'longitude',
      show: true,
      apiFieldValue: 'longitude',
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
      apiFieldValue: 'reference__reference',
    },
    title: {
      text: 'localityReference.referenceTitle',
      value: 'title',
      show: true,
      apiFieldValue: 'reference__title',
    },
    pages: {
      text: 'localityReference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'pages',
    },
    remarks: {
      text: 'localityReference.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: ['reference', 'title', 'pages', 'remarks'],
}

export const HEADERS_PHOTO = {
  byIds: {
    id: { text: 'photo.id', value: 'id', show: true, apiFieldValue: 'id_sl' },
    image_number: {
      text: 'photo.number',
      value: 'image_number',
      show: true,
      apiFieldValue: 'image_number',
    },
    agent: {
      text: 'photo.agent',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent',
    },
    date: {
      text: 'photo.date',
      value: 'date',
      show: true,
      apiFieldValue: 'date_created_dt,date_created_free',
    },
    locality: {
      text: 'photo.locality',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality', en: 'locality_en' },
    },
    image_object: {
      text: 'photo.imageObject',
      value: 'image_object',
      show: true,
      apiFieldValue: 'image_object',
    },
    tags: {
      text: 'photo.tags',
      value: 'tags',
      show: true,
      apiFieldValue: 'tags',
    },
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
    id: {
      text: 'preparation.id',
      value: 'id',
      show: true,
      apiFieldValue: 'id_l',
    },
    preparation_number: {
      text: 'preparation.preparation_number',
      value: 'preparation_number',
      show: true,
      apiFieldValue: 'preparation_number',
    },
    locality: {
      text: 'preparation.locality',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality', en: 'locality_en' },
    },
    depth: {
      text: 'preparation.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth,depth_interval',
    },
    stratigraphy: {
      text: 'preparation.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: {
        et: 'stratigraphy,lithostratigraphy',
        en: 'stratigraphy_en,lithostratigraphy_en',
      },
    },
    agent: {
      text: 'preparation.agent',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent',
    },
    mass: {
      text: 'preparation.mass',
      value: 'mass',
      show: true,
      apiFieldValue: 'mass',
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

export const HEADERS_REFERENCE = {
  byIds: {
    id: { text: 'reference.id', value: 'id', show: true, apiFieldValue: 'id' },
    reference: {
      text: 'reference.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference',
    },
    author: {
      text: 'reference.author',
      value: 'author',
      show: true,
      apiFieldValue: 'author',
    },
    year: {
      text: 'reference.year',
      value: 'year',
      show: true,
      apiFieldValue: 'year',
    },
    title: {
      text: 'reference.title',
      value: 'title',
      show: true,
      apiFieldValue: 'title',
    },
    journal: {
      text: 'reference.journalBook',
      value: 'journal',
      show: true,
      apiFieldValue: 'journal__journal_name,book',
    },
    pages: {
      text: 'reference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'pages',
    },
    doi: {
      text: 'reference.doi',
      value: 'doi',
      show: true,
      apiFieldValue: 'doi',
    },
    remarks: {
      text: 'reference.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
    pdf: {
      text: 'reference.pdf',
      value: 'pdf',
      show: true,
      apiFieldValue: 'pdf',
    },
  },
  allIds: [
    'id',
    'reference',
    'author',
    'year',
    'title',
    'journal',
    'doi',
    'remarks',
    'pdf',
  ],
}

export const HEADERS_ROCK = {
  byIds: {
    id: { text: 'rock.id', value: 'id', show: true, apiFieldValue: 'id' },
    name: {
      text: 'rock.name',
      value: 'name',
      show: true,
      apiFieldValue: 'name',
    },
    name_en: {
      text: 'rock.name_en',
      value: 'name_en',
      show: true,
      apiFieldValue: 'name_en',
    },
    formula: {
      text: 'rock.formula',
      value: 'formula',
      show: true,
      apiFieldValue: 'formula,formula_html',
    },
    in_estonia: {
      text: 'rock.in_estonia',
      value: 'in_estonia',
      show: true,
      apiFieldValue: 'in_estonia',
    },
    mindat_id: {
      text: 'rock.mindat',
      value: 'mindat_id',
      show: true,
      apiFieldValue: 'mindat_id',
    },
  },
  allIds: ['id', 'name', 'name_en', 'formula', 'in_estonia', 'mindat_id'],
}
export const HEADERS_SAMPLE = {
  byIds: {
    id: { text: 'sample.id', value: 'id', show: true, apiFieldValue: 'id_l' },
    number: {
      text: 'sample.number',
      value: 'number',
      show: true,
      apiFieldValue: 'number',
    },
    locality: {
      text: 'sample.locality',
      value: 'locality',
      show: true,
      apiFieldValue: {
        et: 'locality,site_name',
        en: 'locality_en,site_name_en',
      },
    },
    depth: {
      text: 'sample.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    depth_interval: {
      text: 'sample.depthInterval',
      value: 'depth_interval',
      show: true,
      apiFieldValue: 'depth_interval',
    },
    stratigraphy: {
      text: 'sample.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
    lithostratigraphy: {
      text: 'sample.lithostratigraphy',
      value: 'lithostratigraphy',
      show: true,
      apiFieldValue: { et: 'lithostratigraphy', en: 'lithostratigraphy_en' },
    },
    collector: {
      text: 'sample.collector',
      value: 'collector',
      show: true,
      apiFieldValue: 'collector',
    },
    date_collected: {
      text: 'sample.dateCollected',
      value: 'date_collected',
      show: true,
      apiFieldValue: 'date_collected',
    },
  },
  allIds: [
    'id',
    'number',
    'locality',
    'depth',
    'depth_interval',
    'stratigraphy',
    'lithostratigraphy',
    'collector',
    'date_collected',
  ],
}

export const HEADERS_SAMPLE_REFERENCE = {
  byIds: {
    reference: {
      text: 'sampleReference.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    reference__title: {
      text: 'sampleReference.referenceTitle',
      value: 'reference__title',
      show: true,
      apiFieldValue: 'reference__title',
    },
    pages: {
      text: 'sampleReference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'pages',
    },
    remarks: {
      text: 'sampleReference.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: ['reference', 'reference__title', 'pages', 'remarks'],
}

export const HEADERS_SAMPLE_DATA = {
  byIds: {
    sample: {
      text: 'sampleData.sampleNumber',
      value: 'sample',
      show: true,
      apiFieldValue: 'sample_number',
    },
    latitude: {
      text: 'sampleData.latitude',
      value: 'latitude',
      show: false,
      apiFieldValue: 'latitude',
    },
    longitude: {
      text: 'sampleData.longitude',
      value: 'longitude',
      show: false,
      apiFieldValue: 'longitude',
    },
    locality: {
      text: 'datasetAnalysis.locality',
      value: 'locality',
      show: true,
      apiFieldValue: 'locality',
    },
    stratigraphy: {
      text: 'datasetAnalysis.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
  },
  allIds: ['sample', 'locality', 'latitude', 'longitude', 'stratigraphy'],
}

export const HEADERS_SITE = {
  byIds: {
    id: { text: 'site.id', value: 'id', show: true, apiFieldValue: 'id_l' },
    name: {
      text: 'site.name',
      value: 'name',
      show: true,
      apiFieldValue: 'name',
    },
    area: {
      text: 'site.area',
      value: 'area',
      show: true,
      apiFieldValue: 'latitude',
    },
    latitude: {
      text: 'site.latitude',
      value: 'latitude',
      show: true,
      apiFieldValue: 'longitude',
    },
    longitude: {
      text: 'site.longitude',
      value: 'longitude',
      show: true,
      apiFieldValue: { et: 'area_name', en: 'area_name_en' },
    },
    z: {
      text: 'site.elevation',
      value: 'z',
      show: true,
      apiFieldValue: 'z',
    },
    depth: {
      text: 'site.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
  },
  allIds: ['id', 'name', 'area', 'latitude', 'longitude', 'z', 'depth'],
}

export const HEADERS_SPECIMEN = {
  byIds: {
    id: { text: 'specimen.id', value: 'id', show: true, apiFieldValue: 'id' },
    specimen_full_name: {
      text: 'specimen.number',
      value: 'specimen_full_name',
      show: true,
      apiFieldValue: 'specimen_full_name',
    },
    locality: {
      text: 'specimen.locality',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality', en: 'locality_en' },
    },
    depth: {
      text: 'specimen.depth',
      value: 'depth',
      show: true,
      apiFieldValue: 'depth',
    },
    depth_interval: {
      text: 'specimen.depthInterval',
      value: 'depth_interval',
      show: true,
      apiFieldValue: 'depth_interval',
    },
    stratigraphy: {
      text: 'specimen.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
    lithostratigraphy: {
      text: 'sample.lithostratigraphy',
      value: 'lithostratigraphy',
      show: true,
      apiFieldValue: { et: 'lithostratigraphy', en: 'lithostratigraphy_en' },
    },
    name: {
      text: 'specimen.name',
      value: 'name',
      show: true,
      sortable: false,
      class: 'static-cell-header',
      apiFieldValue: { et: 'rock', en: 'rock_en' },
    },
    image: {
      text: 'specimen.image',
      value: 'image',
      show: true,
      apiFieldValue: 'image',
    },
  },
  allIds: [
    'id',
    'specimen_full_name',
    'locality',
    'depth',
    'depth_interval',
    'stratigraphy',
    'lithostratigraphy',
    'name',
    'image',
  ],
}

export const HEADERS_SPECIMEN_IDENTIFICATION = {
  byIds: {
    name: {
      text: 'specimenIdentification.name',
      value: 'name',
      show: true,
      apiFieldValue: 'taxon__taxon',
    },
    agent: {
      text: 'specimenIdentification.agent',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent__agent',
    },
    dateIdentified: {
      text: 'specimenIdentification.dateIdentified',
      value: 'dateIdentified',
      show: true,
      apiFieldValue: 'date_identified',
    },
    reference: {
      text: 'specimenIdentification.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    type: {
      text: 'specimenIdentification.type',
      value: 'type',
      show: true,
      apiFieldValue: {
        et: 'identification_type__value',
        en: 'identification_type__value_en',
      },
    },
    remarks: {
      text: 'specimenIdentification.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
    current: {
      text: 'specimenIdentification.current',
      value: 'current',
      show: true,
      apiFieldValue: 'current',
    },
  },
  allIds: [
    'name',
    'agent',
    'dateIdentified',
    'reference',
    'type',
    'remarks',
    'current',
  ],
}

export const HEADERS_SPECIMEN_IDENTIFICATION_GEOLOGY = {
  byIds: {
    rock: {
      text: 'specimenIdentification.rock',
      value: 'rock',
      show: true,
      apiFieldValue: 'rock__name,rock__name_en',
    },
    name: {
      text: 'specimenIdentification.name',
      value: 'name',
      show: true,
      apiFieldValue: 'name',
    },
    name_en: {
      text: 'specimenIdentification.name_en',
      value: 'name_en',
      show: true,
      apiFieldValue: 'name_en',
    },
    agent: {
      text: 'specimenIdentification.agent',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent__agent',
    },
    dateIdentified: {
      text: 'specimenIdentification.dateIdentified',
      value: 'dateIdentified',
      show: true,
      apiFieldValue: 'date_identified',
    },
    reference: {
      text: 'specimenIdentification.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    type: {
      text: 'specimenIdentification.type',
      value: 'type',
      show: true,
      apiFieldValue: { et: 'type__value', en: 'type__value_en' },
    },
    remarks: {
      text: 'specimenIdentification.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
    current: {
      text: 'specimenIdentification.current',
      value: 'current',
      show: true,
      apiFieldValue: 'current',
    },
    // pages: {
    //   text: 'stratigraphyReference.pages',
    //   value: 'pages',
    //   show: true,
    // },
  },
  allIds: [
    'rock',
    'name',
    'name_en',
    'agent',
    'dateIdentified',
    'reference',
    'type',
    'remarks',
    'current',
  ],
}

export const HEADERS_SPECIMEN_REFERENCE = {
  byIds: {
    reference: {
      text: 'specimenReference.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    pages: {
      text: 'specimenReference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'pages',
    },
    figures: {
      text: 'specimenReference.figures',
      value: 'figures',
      show: true,
      apiFieldValue: 'figures',
    },
    remarks: {
      text: 'specimenReference.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: ['reference', 'pages', 'figures', 'remarks'],
}

export const HEADERS_STRATIGRAPHY = {
  byIds: {
    id: {
      text: 'stratigraphy.id',
      value: 'id',
      show: true,
      apiFieldValue: 'id',
    },
    stratigraphy: {
      text: 'stratigraphy.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: { et: 'stratigraphy', en: 'stratigraphy_en' },
    },
    index_main: {
      text: 'stratigraphy.index_main',
      value: 'index_main',
      show: true,
      apiFieldValue: 'index_main',
    },
    index_additional: {
      text: 'stratigraphy.index_additional',
      value: 'index_additional',
      show: true,
      apiFieldValue: 'index_additional',
    },
    stratigraphy_type: {
      text: 'stratigraphy.stratigraphy_type',
      value: 'stratigraphy_type',
      show: true,
      apiFieldValue: { et: 'stratigraphy_type', en: 'stratigraphy_type_en' },
    },
    stratigraphy_rank: {
      text: 'stratigraphy.stratigraphy_rank',
      value: 'stratigraphy_rank',
      show: true,
      apiFieldValue: { et: 'stratigraphy_rank', en: 'stratigraphy_rank_en' },
    },
    stratigraphy_scope: {
      text: 'stratigraphy.stratigraphy_scope',
      value: 'stratigraphy_scope',
      show: true,
      apiFieldValue: { et: 'stratigraphy_scope', en: 'stratigraphy_scope_en' },
    },
    parent_stratigraphy: {
      text: 'stratigraphy.parent_stratigraphy',
      value: 'parent_stratigraphy',
      show: true,
      apiFieldValue: {
        et: 'parent_stratigraphy',
        en: 'parent_stratigraphy_en',
      },
    },
    ageBase: {
      text: 'stratigraphy.ageBase',
      value: 'ageBase',
      show: true,
      apiFieldValue: 'age_base',
    },
    ageTop: {
      text: 'stratigraphy.ageTop',
      value: 'ageTop',
      show: true,
      apiFieldValue: 'age_top',
    },
    age_stratigraphy: {
      text: 'stratigraphy.age_stratigraphy',
      value: 'age_stratigraphy',
      show: true,
      apiFieldValue: { et: 'age_stratigraphy', en: 'age_stratigraphy_en' },
    },
  },
  allIds: [
    'id',
    'stratigraphy',
    'index_main',
    'index_additional',
    'stratigraphy_type',
    'stratigraphy_rank',
    'stratigraphy_scope',
    'parent_stratigraphy',
    'ageBase',
    'ageTop',
    'age_stratigraphy',
  ],
}

export const HEADERS_STRATIGRAPHY_REFERENCE = {
  byIds: {
    reference: {
      text: 'stratigraphyReference.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    content: {
      text: 'stratigraphyReference.content',
      value: 'content',
      show: true,
      apiFieldValue: 'reference__year',
    },
    year: {
      text: 'stratigraphyReference.year',
      value: 'year',
      show: true,
      apiFieldValue: 'pages',
    },
    pages: {
      text: 'stratigraphyReference.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'remarks',
    },
    remarks: {
      text: 'stratigraphyReference.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: { et: 'content', en: 'content_en' },
    },
  },
  allIds: ['reference', 'content', 'year', 'pages', 'remarks'],
}

export const HEADERS_STRATIGRAPHY_STRATOTYPE = {
  byIds: {
    locality: {
      text: 'stratotype.locality',
      value: 'locality',
      show: true,
      apiFieldValue: { et: 'locality__locality', en: 'locality_locality_en' },
    },
    type: {
      text: 'stratotype.type',
      value: 'type',
      show: true,
      apiFieldValue: {
        et: 'stratotype_type__value',
        en: 'stratotype_type__value_en',
      },
    },
    depth_top: {
      text: 'stratotype.depthTop',
      value: 'depth_top',
      show: true,
      apiFieldValue: 'depth_top',
    },
    depth_base: {
      text: 'stratotype.depthBase',
      value: 'depth_base',
      show: true,
      apiFieldValue: 'depth_base',
    },
    reference: {
      text: 'stratotype.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    remarks: {
      text: 'stratotype.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: [
    'locality',
    'type',
    'depth_top',
    'depth_base',
    'reference',
    'remarks',
  ],
}

export const HEADERS_STRATIGRAPHY_SYNONYM = {
  byIds: {
    synonym: {
      text: 'stratigraphySynonym.synonym',
      value: 'synonym',
      show: true,
      apiFieldValue: 'synonym',
    },
    language: {
      text: 'stratigraphySynonym.language',
      value: 'language',
      show: true,
      apiFieldValue: { et: 'language__value', en: 'language__value_en' },
    },
    reference: {
      text: 'stratigraphySynonym.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    remarks: {
      text: 'stratigraphySynonym.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: ['synonym', 'language', 'reference', 'remarks'],
}

export const HEADERS_STRATOTYPE = {
  byIds: {
    stratigraphy: {
      text: 'stratotype.stratigraphy',
      value: 'stratigraphy',
      show: true,
      apiFieldValue: {
        et: 'stratigraphy__stratigraphy',
        en: 'stratigraphy__stratigraphy_en',
      },
    },
    type: {
      text: 'stratotype.type',
      value: 'type',
      show: true,
      apiFieldValue: {
        et: 'stratotype_type__value',
        en: 'stratotype_type__value_en',
      },
    },
    depth_top: {
      text: 'stratotype.depthTop',
      value: 'depth_top',
      show: true,
      apiFieldValue: 'depth_top',
    },
    depth_base: {
      text: 'stratotype.depthBase',
      value: 'depth_base',
      show: true,
      apiFieldValue: 'depth_base',
    },
    reference: {
      text: 'stratotype.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    remarks: {
      text: 'stratotype.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: [
    'stratigraphy',
    'type',
    'depth_top',
    'depth_base',
    'reference',
    'remarks',
  ],
}

export const HEADERS_SYNONYM = {
  byIds: {
    synonym: {
      text: 'localitySynonym.synonym',
      value: 'synonym',
      show: true,
      apiFieldValue: 'synonym',
    },
    pages: {
      text: 'localitySynonym.pages',
      value: 'pages',
      show: true,
      apiFieldValue: 'pages',
    },
    reference: {
      text: 'localitySynonym.reference',
      value: 'reference',
      show: true,
      apiFieldValue: 'reference__reference',
    },
    remarks: {
      text: 'localitySynonym.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: ['synonym', 'pages', 'reference', 'remarks'],
}

export const HEADERS_TAXON_LIST = {
  byIds: {
    taxon: {
      text: 'taxon.taxon',
      value: 'taxon',
      show: true,
      apiFieldValue: 'taxon__taxon',
    },
    name: {
      text: 'taxon.name',
      value: 'name',
      show: true,
      apiFieldValue: 'name',
    },
    frequency: {
      text: 'taxon.frequency',
      value: 'frequency',
      show: true,
      apiFieldValue: 'frequency',
    },
    agent: {
      text: 'taxon.agent_identified',
      value: 'agent',
      show: true,
      apiFieldValue: 'agent_identified__agent,agent_identified_txt',
    },
    date_identified: {
      text: 'taxon.date_identified',
      value: 'date_identified',
      show: true,
      apiFieldValue: 'date_identified,date_identified_free',
    },
    extra: {
      text: 'taxon.extra',
      value: 'extra',
      show: true,
      apiFieldValue: 'extra',
    },
    remarks: {
      text: 'taxon.remarks',
      value: 'remarks',
      show: true,
      apiFieldValue: 'remarks',
    },
  },
  allIds: [
    'taxon',
    'name',
    'frequency',
    'agent',
    'date_identified',
    'extra',
    'remarks',
  ],
}

export const HEADERS_TAXON = {
  byIds: {
    id: { text: 'taxon.id', value: 'id', show: true, apiFieldValue: 'id' },
    taxon: {
      text: 'taxon.taxon',
      value: 'taxon',
      show: true,
      apiFieldValue: 'taxon',
    },
    parent_taxon: {
      text: 'taxon.parentTaxon',
      value: 'parent_taxon',
      show: true,
      apiFieldValue: 'parent_taxon',
    },
    fossil_group: {
      text: 'taxon.fossilGroup',
      value: 'fossil_group',
      show: true,
      apiFieldValue: 'fossil_group',
    },
  },
  allIds: ['id', 'taxon', 'parent_taxon', 'fossil_group'],
}
