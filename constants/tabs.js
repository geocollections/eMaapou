export const TABS_QUICK_SEARCH = {
  byIds: {
    locality: {
      id: 'locality',
      routeName: 'search-localities',
      title: 'landing.localities',
      isSolr: true,
      count: 0,
      props: {},
    },
    site: {
      id: 'site',
      routeName: 'search-sites',
      title: 'landing.sites',
      isSolr: true,
      count: 0,
      props: {},
    },
    drillcore: {
      id: 'drillcore',
      routeName: 'search',
      title: 'landing.drillcores',
      isSolr: true,
      count: 0,
      props: {},
    },
    sample: {
      id: 'sample',
      routeName: 'search-samples',
      title: 'landing.samples',
      isSolr: true,
      count: 0,
      props: {},
    },
    analysis: {
      id: 'analysis',
      routeName: 'search-analyses',
      title: 'landing.analyses',
      isSolr: true,
      count: 0,
      props: {},
    },
    preparation: {
      id: 'preparation',
      routeName: 'search-preparations',
      path: '/localities',
      title: 'landing.preparations',
      isSolr: true,
      count: 0,
      props: {},
    },
    reference: {
      id: 'reference',
      routeName: 'search-references',
      title: 'landing.references',
      isSolr: true,
      count: 0,
      props: {},
    },
    specimen: {
      id: 'specimen',
      routeName: 'search-specimens',
      title: 'landing.specimens',
      isSolr: true,
      count: 0,
      props: {},
    },
    doi: {
      id: 'doi',
      routeName: 'search-dois',
      title: 'landing.dois',
      isSolr: true,
      count: 0,
      props: {},
    },
    dataset: {
      id: 'dataset',
      routeName: 'search-datasets',
      title: 'landing.datasets',
      isSolr: true,
      count: 0,
      props: {},
    },
    attachment: {
      id: 'attachment',
      routeName: 'search-files',
      title: 'landing.attachments',
      isSolr: true,
      count: 0,
      props: {},
    },
    photo: {
      id: 'photo',
      table: 'attachment',
      routeName: 'search-photos',
      title: 'landing.photos',
      isSolr: true,
      count: 0,
      props: {},
    },
    taxon: {
      id: 'taxon',
      routeName: 'search-taxa',
      title: 'landing.taxa',
      isSolr: true,
      count: 0,
      props: {},
    },
    rock: {
      id: 'rock',
      routeName: 'search-rocks',
      title: 'landing.rocks',
      isSolr: true,
      count: 0,
      props: {},
    },
    stratigraphy: {
      id: 'stratigraphy',
      routeName: 'search-stratigraphy',
      title: 'landing.stratigraphy',
      isSolr: true,
      count: 0,
      props: {},
    },
    area: {
      id: 'area',
      routeName: 'search-areas',
      title: 'landing.areas',
      isSolr: true,
      count: 0,
      props: {},
    },
  },
  allIds: [
    'locality',
    'site',
    'drillcore',
    'sample',
    'analysis',
    'preparation',
    'reference',
    'specimen',
    'doi',
    'dataset',
    'attachment',
    'photo',
    'taxon',
    'rock',
    'stratigraphy',
    'area',
  ],
}

export const TABS_ANALYSIS = {
  byIds: {
    analysis_results: {
      id: 'analysis_results',
      isSolr: true,
      routeName: 'analysis-id-slug',
      title: 'analysis.results',
      count: 0,
      props: {},
    },
    attachment_link: {
      id: 'attachment_link',
      routeName: 'analysis-id-slug-attachments',
      title: 'analysis.attachments',
      count: 0,
      props: {},
    },
  },
  allIds: ['analysis_results', 'attachment_link'],
}

export const TABS_AREA = {
  byIds: {
    site: {
      id: 'site',
      isSolr: true,
      routeName: 'area-id-slug',
      title: 'area.sites',
      count: 0,
      props: {},
    },
    locality_reference: {
      id: 'locality_reference',
      routeName: 'area-id-slug-references',
      title: 'area.localityReferences',
      count: 0,
      props: {},
    },
    relatedArea: {
      id: 'relatedArea',
      table: 'area',
      routeName: 'area-id-slug-related-areas',
      title: 'area.relatedAreas',
      count: 0,
      props: {},
    },
    locality: {
      id: 'locality',
      table: 'locality',
      routeName: 'area-id-slug-localities',
      title: 'area.localities',
      count: 0,
      props: {},
    },
  },
  allIds: ['site', 'locality_reference', 'relatedArea', 'locality'],
}

export const TABS_COLLECTION = {
  byIds: {
    specimen: {
      id: 'specimen',
      isSolr: true,
      routeName: 'collection-id-slug',
      title: 'collection.specimens',
      count: 0,
      props: {},
    },
  },
  allIds: ['specimen'],
}

export const TABS_DATASET = {
  byIds: {
    dataset_analysis: {
      id: 'dataset_analysis',
      table: 'dataset_analysis',
      routeName: 'dataset-id-slug',
      title: 'dataset.analyses',
      count: 0,
      props: {},
    },
    dataset_reference: {
      id: 'dataset_reference',
      table: 'dataset_reference',
      routeName: 'dataset-id-slug-references',
      title: 'dataset.references',
      count: 0,
      props: {},
    },
    attachment_link: {
      id: 'attachment_link',
      table: 'attachment_link',
      routeName: 'dataset-id-slug-attachments',
      title: 'dataset.attachments',
      count: 0,
      props: {},
    },
    dataset_author: {
      id: 'dataset_author',
      table: 'dataset_author',
      routeName: 'dataset-id-slug-authors',
      title: 'dataset.authors',
      count: 0,
      props: {},
    },
    dataset_geolocation: {
      id: 'dataset_geolocation',
      table: 'dataset_geolocation',
      routeName: 'dataset-id-slug-geolocations',
      title: 'dataset.geolocations',
      count: 0,
      props: {},
    },
    sample_results: {
      id: 'sample_results',
      table: 'sample_data',
      isSolr: true,
      routeName: 'dataset-id-slug-sample-results',
      title: 'dataset.sampleResults',
      count: 0,
      props: {},
    },
    graphs: {
      table: 'analysis_results',
      id: 'analysis_results',
      isSolr: true,
      routeName: 'dataset-id-slug-graphs',
      title: 'locality.graphs',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'dataset_analysis',
    'dataset_reference',
    'attachment_link',
    'dataset_author',
    'dataset_geolocation',
    'sample_results',
    'graphs',
  ],
}

export const TABS_DRILLCORE = {
  byIds: {
    boxes: {
      routeName: 'drillcore-id-slug',
      title: 'drillcore.drillcoreBoxesTitle',
      count: 0,
      props: {},
    },
    locality_description: {
      id: 'locality_description',
      routeName: 'drillcore-id-slug-descriptions',
      title: 'drillcore.localityDescriptions',
      count: 0,
      props: {},
    },
    locality_reference: {
      id: 'locality_reference',
      routeName: 'drillcore-id-slug-references',
      title: 'drillcore.localityReferences',
      count: 0,
      props: {},
    },
    attachment_link: {
      id: 'attachment_link',
      routeName: 'drillcore-id-slug-attachments',
      title: 'drillcore.attachments',
      count: 0,
      props: {},
    },
    sample: {
      id: 'sample',
      isSolr: true,
      routeName: 'drillcore-id-slug-samples',
      title: 'drillcore.samples',
      count: 0,
      props: {},
    },
    analysis: {
      id: 'analysis',
      isSolr: true,
      routeName: 'drillcore-id-slug-analyses',
      title: 'drillcore.analyses',
      count: 0,
      props: {},
    },
    specimen: {
      id: 'specimen',
      isSolr: true,
      routeName: 'drillcore-id-slug-specimens',
      title: 'drillcore.specimens',
      count: 0,
      props: {},
    },
    analysis_results: {
      table: 'analysis_results',
      id: 'graphs',
      isSolr: true,
      routeName: 'drillcore-id-slug-graphs',
      title: 'locality.graphs',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'boxes',
    'locality_description',
    'locality_reference',
    'attachment_link',
    'sample',
    'analysis',
    'specimen',
    'analysis_results',
  ],
}

export const TABS_DRILLCORE_BOX = {
  byIds: {
    sample: {
      id: 'sample',
      routeName: 'drillcore-box-id-slug',
      isSolr: true,
      title: 'drillcore.samples',
      count: 0,
      props: {},
    },
    analysis: {
      id: 'analysis',
      routeName: 'drillcore-box-id-slug-analyses',
      title: 'drillcore.analyses',
      isSolr: true,
      count: 0,
      props: {},
    },
    specimen: {
      id: 'specimen',
      routeName: 'drillcore-box-id-slug-specimens',
      title: 'drillcore.specimens',
      isSolr: true,
      count: 0,
      props: {},
    },
  },
  allIds: ['sample', 'analysis', 'specimen'],
}

export const TABS_LOCALITY = {
  byIds: {
    locality_reference: {
      id: 'locality_reference',
      routeName: 'locality-id-slug',
      title: 'locality.references',
      count: 0,
      props: {},
    },
    locality_description: {
      id: 'locality_description',
      routeName: 'locality-id-slug-descriptions',
      title: 'locality.descriptions',
      count: 0,
      props: {},
    },
    attachment_link: {
      id: 'attachment_link',
      routeName: 'locality-id-slug-attachments',
      title: 'locality.attachments',
      count: 0,
      props: {},
    },
    sample: {
      id: 'sample',
      routeName: 'locality-id-slug-samples',
      title: 'locality.samples',
      isSolr: true,
      count: 0,
      props: {},
    },
    boxes: {
      routeName: 'locality-id-slug-drillcore-boxes',
      title: 'locality.drillcoreBoxes',
      count: 0,
      props: {},
    },
    specimen: {
      id: 'specimen',
      routeName: 'locality-id-slug-specimens',
      title: 'locality.specimens',
      isSolr: true,
      count: 0,
      props: {},
    },
    locality_synonym: {
      id: 'locality_synonym',
      routeName: 'locality-id-slug-synonyms',
      title: 'locality.synonyms',
      count: 0,
      props: {},
    },
    stratigraphy_stratotype: {
      id: 'stratigraphy_stratotype',
      routeName: 'locality-id-slug-stratotypes',
      title: 'locality.stratotypes',
      count: 0,
      props: {},
    },
    analysis: {
      id: 'analysis',
      isSolr: true,
      routeName: 'locality-id-slug-analyses',
      title: 'locality.analyses',
      count: 0,
      props: {},
    },
    analysis_results: {
      table: 'analysis_results',
      id: 'graphs',
      isSolr: true,
      routeName: 'locality-id-slug-graphs',
      title: 'locality.graphs',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'locality_reference',
    'locality_description',
    'attachment_link',
    'sample',
    'boxes',
    'specimen',
    'locality_synonym',
    'stratigraphy_stratotype',
    'analysis',
    'analysis_results',
  ],
}

export const TABS_PREPARATION = {
  byIds: {
    attachment_link: {
      id: 'attachment_link',
      routeName: 'preparation-id-slug',
      title: 'preparation.attachments',
      count: 0,
      props: {},
    },
    taxon_list: {
      id: 'taxon_list',
      isSolr: false,
      routeName: 'preparation-id-slug-taxa',
      title: 'preparation.taxa',
      count: 0,
      props: {},
    },
  },
  allIds: ['attachment_link', 'taxon_list'],
}

export const TABS_SAMPLE = {
  byIds: {
    analysis: {
      id: 'analysis',
      isSolr: true,
      routeName: 'sample-id-slug',
      title: 'sample.analyses',
      count: 0,
      props: {},
    },
    preparation: {
      id: 'preparation',
      isSolr: true,
      routeName: 'sample-id-slug-preparations',
      title: 'sample.preparations',
      count: 0,
      props: {},
    },
    taxon_list: {
      id: 'taxon_list',
      routeName: 'sample-id-slug-taxa',
      title: 'sample.taxa',
      count: 0,
      props: {},
    },
    attachment_link: {
      id: 'attachment_link',
      routeName: 'sample-id-slug-attachments',
      title: 'sample.attachments',
      count: 0,
      props: {},
    },
    sample_reference: {
      id: 'sample_reference',
      routeName: 'sample-id-slug-references',
      title: 'sample.sampleReferences',
      count: 0,
      props: {},
    },
    analysis_results: {
      id: 'analysis_results',
      isSolr: true,
      routeName: 'sample-id-slug-analysis-results',
      title: 'sample.analysisResults',
      count: 0,
      props: {},
    },
    graphs: {
      table: 'taxon_list',
      id: 'graphs',
      routeName: 'sample-id-slug-graphs',
      title: 'locality.graphs',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'analysis',
    'preparation',
    'taxon_list',
    'attachment_link',
    'sample_reference',
    'analysis_results',
    'graphs',
  ],
}

export const TABS_SITE = {
  byIds: {
    attachment_link: {
      id: 'attachment_link',
      routeName: 'site-id-slug',
      title: 'site.attachments',
      count: 0,
      props: {},
    },
    sample: {
      id: 'sample',
      isSolr: true,
      routeName: 'site-id-slug-samples',
      title: 'site.samples',
      count: 0,
      props: {},
    },
    locality_description: {
      id: 'locality_description',
      routeName: 'site-id-slug-descriptions',
      title: 'site.localityDescriptions',
      count: 0,
      props: {},
    },
    locality_reference: {
      id: 'locality_reference',
      routeName: 'site-id-slug-references',
      title: 'site.localityReferences',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'attachment_link',
    'sample',
    'locality_description',
    'locality_reference',
  ],
}

export const TABS_SPECIMEN = {
  byIds: {
    specimen_identification: {
      id: 'specimen_identification',
      table: 'specimen_identification',
      isSolr: false,
      routeName: 'specimen-id-slug',
      title: 'specimen.identifications',
      count: 0,
      props: {},
    },
    specimen_identification_geology: {
      id: 'specimen_identification_geology',
      table: 'specimen_identification_geology',
      isSolr: false,
      routeName: 'specimen-id-slug-rock-identifications',
      title: 'specimen.rockIdentifications',
      count: 0,
      props: {},
    },
    specimen_reference: {
      id: 'specimen_reference',
      table: 'specimen_reference',
      isSolr: false,
      routeName: 'specimen-id-slug-references',
      title: 'specimen.references',
      count: 0,
      props: {},
    },
  },
  allIds: [
    'specimen_identification',
    'specimen_identification_geology',
    'specimen_reference',
  ],
}

export const TABS_STRATIGRAPHY = {
  byIds: {
    stratigraphy_reference: {
      id: 'stratigraphy_reference',
      table: 'stratigraphy_reference',
      routeName: 'stratigraphy-id-slug',
      title: 'stratigraphy.references',
      count: 0,
      props: {},
      fields: 'reference_id',
    },
    stratigraphy_synonym: {
      id: 'stratigraphy_synonym',
      table: 'stratigraphy_synonym',
      routeName: 'stratigraphy-id-slug-synonyms',
      title: 'stratigraphy.synonyms',
      count: 0,
      props: {},
    },
    subunits: {
      id: 'subunits',
      table: 'stratigraphy',
      routeName: 'stratigraphy-id-slug-subunits',
      title: 'stratigraphy.subUnits',
      isSolr: true,
      count: 0,
      props: {},
    },
    lithostratigraphy: {
      id: 'lithostratigraphy',
      table: 'stratigraphy',
      routeName: 'stratigraphy-id-slug-related-units',
      title: 'stratigraphy.relatedUnits',
      isSolr: true,
      count: 0,
      props: {},
    },
    specimen: {
      id: 'specimen',
      table: 'specimen',
      routeName: 'stratigraphy-id-slug-specimens',
      title: 'stratigraphy.specimens',
      isSolr: true,
      count: 0,
      props: {},
    },
    sample: {
      id: 'sample',
      table: 'sample',
      routeName: 'stratigraphy-id-slug-samples',
      title: 'stratigraphy.samples',
      isSolr: true,
      count: 0,
      props: {},
    },
  },
  allIds: [
    'stratigraphy_reference',
    'stratigraphy_synonym',
    'subunits',
    'lithostratigraphy',
    'specimen',
    'sample',
  ],
}
