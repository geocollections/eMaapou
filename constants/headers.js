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
