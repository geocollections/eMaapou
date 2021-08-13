import { getField, updateField } from 'vuex-map-fields'

import {
  SET_ALL_FIELD_NAMES,
  SET_TABLE_HEADERS,
  UPDATE_TABLE_HEADERS,
} from './mutation_types'

const getDefaultState = () => {
  return {
    analysis: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'analysis.id', value: 'id', show: true },
        { text: 'analysis.sampleNumber', value: 'sample_number', show: true },
        { text: 'analysis.locality', value: 'locality', show: true },
        { text: 'analysis.depth', value: 'depth', show: true },
        { text: 'analysis.depthInterval', value: 'depth_interval', show: true },

        { text: 'analysis.method', value: 'method', show: true },
        {
          text: 'analysis.methodDetails',
          value: 'method_details',
          show: true,
        },
        { text: 'analysis.analysedBy', value: 'agent', show: true },
        { text: 'analysis.date', value: 'date', show: true },
      ],
    },
    analyticalData: {
      allFieldNames: null,
      tableHeaders: [
        {
          text: 'analyticalData.id',
          value: 'id_l',
          translate: true,
        },
        {
          text: 'analyticalData.analysisMethod',
          value: 'analysis_method',
          translate: true,
        },
        {
          text: 'analyticalData.sample',
          value: 'sample_number',
          translate: true,
        },
        { text: 'analyticalData.locality', value: 'locality', translate: true },
        {
          text: 'analyticalData.stratigraphy',
          value: 'stratigraphy',
          translate: true,
        },
        {
          text: 'analyticalData.lithostratigraphy',
          value: 'lithostratigraphy',
          translate: true,
        },

        { text: 'analyticalData.depth', value: 'depth', translate: true },
        {
          text: 'analyticalData.depthInterval',
          value: 'depth_interval',
          translate: true,
        },
        {
          text: 'analyticalData.rock',
          value: 'rock',
          translate: true,
        },
        {
          text: 'analyticalData.reference',
          value: 'reference',
          translate: true,
        },
        {
          text: 'analyticalData.dataset',
          value: 'dataset_id',
          translate: true,
        },
        {
          text: 'analyticalData.analysis',
          value: 'analysis_id',
          translate: true,
        },
      ],
    },
    dataset: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'dataset.id', value: 'id', show: true },
        { text: 'dataset.name', value: 'name', show: true },
        { text: 'dataset.date', value: 'date', show: true },
        { text: 'dataset.database', value: 'database_acronym', show: true },
      ],
    },
    drillcore: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'drillcore.id', value: 'id', show: true },
        { text: 'drillcore.name', value: 'drillcore', show: true },
        { text: 'drillcore.depth', value: 'depth', show: true },
        { text: 'drillcore.boxes', value: 'boxes', show: true },
        { text: 'drillcore.boxNumbers', value: 'box_numbers', show: true },
        { text: 'drillcore.year', value: 'year', show: true },
        { text: 'drillcore.storage', value: 'core_repository', show: true },
        { text: 'drillcore.acronym', value: 'acronym', show: true },
      ],
    },
    locality: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'locality.id', value: 'id', show: true },
        { text: 'locality.name', value: 'locality', show: true },
        { text: 'locality.country', value: 'country', show: true },
        { text: 'locality.latitude', value: 'latitude', show: true },
        { text: 'locality.longitude', value: 'longitude', show: true },
      ],
    },
    photo: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'photo.id', value: 'id', show: true },
        { text: 'photo.number', value: 'image_number', show: true },
        { text: 'photo.agent', value: 'agent', show: true },
        { text: 'photo.date', value: 'date', show: true },
        { text: 'photo.locality', value: 'locality', show: true },
        {
          text: 'photo.imageObject',
          value: 'image_object',
          show: true,
        },
        { text: 'photo.tags', value: 'tags', show: true },
      ],
    },
    sample: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'sample.id', value: 'id', show: true },
        { text: 'sample.number', value: 'number', show: true },
        { text: 'sample.locality', value: 'locality', show: true },
        { text: 'sample.depth', value: 'depth', show: true },
        { text: 'sample.depthInterval', value: 'depth_interval', show: true },
        { text: 'sample.stratigraphy', value: 'stratigraphy', show: true },
        {
          text: 'sample.lithostratigraphy',
          value: 'lithostratigraphy',
          show: true,
        },
        { text: 'sample.collector', value: 'collector', show: true },
        { text: 'sample.dateCollected', value: 'date_collected', show: true },
      ],
    },
    site: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'site.id', value: 'id', show: true },
        { text: 'site.name', value: 'name', show: true },
        { text: 'site.area', value: 'area', show: true },
        { text: 'site.latitude', value: 'latitude', show: true },
        { text: 'site.longitude', value: 'longitude', show: true },
        {
          text: 'site.elevation',
          value: 'z',
          show: true,
        },
        { text: 'site.depth', value: 'depth', show: true },
      ],
    },
    taxon: {
      allFieldNames: null,
      tableHeaders: [
        {
          text: 'taxon.fossilGroup',
          value: 'fossil_group',
          show: true,
        },
        { text: 'taxon.taxon', value: 'taxon', show: true },
        {
          text: 'taxon.locality',
          value: 'locality',
          show: true,
        },
        {
          text: 'taxon.fad',
          value: 'fad',
          show: true,
        },
        {
          text: 'taxon.lad',
          value: 'lad',
          show: true,
        },
      ],
    },
    specimen: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'specimen.id', value: 'id', show: true },
        { text: 'specimen.number', value: 'specimen_full_name', show: true },
        { text: 'specimen.locality', value: 'locality', show: true },
        { text: 'specimen.depth', value: 'depth', show: true },
        { text: 'specimen.depthInterval', value: 'depth_interval', show: true },
        { text: 'specimen.stratigraphy', value: 'stratigraphy', show: true },
        {
          text: 'sample.lithostratigraphy',
          value: 'lithostratigraphy',
          show: true,
        },
        // { text: this.$t('specimen.kind'), value: 'kind' },
        // { text: this.$t('specimen.fossilGroup'), value: 'fossilgroup' },
        { text: 'specimen.taxon', value: 'taxon', show: true },
        { text: 'specimen.rock', value: 'rock', show: true },
        { text: 'specimen.image', value: 'image', show: true },
      ],
    },
    stratigraphy: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'stratigraphy.id', value: 'id', show: true },
        {
          text: 'stratigraphy.stratigraphy',
          value: 'stratigraphy',
          show: true,
        },
        { text: 'stratigraphy.index_main', value: 'index_main', show: true },
        {
          text: 'stratigraphy.index_additional',
          value: 'index_additional',
          show: true,
        },
        {
          text: 'stratigraphy.stratigraphy_type',
          value: 'stratigraphy_type',
          show: true,
        },
        {
          text: 'stratigraphy.stratigraphy_rank',
          value: 'stratigraphy_rank',
          show: true,
        },
        {
          text: 'stratigraphy.stratigraphy_scope',
          value: 'stratigraphy_scope',
          show: true,
        },
        {
          text: 'stratigraphy.parent_stratigraphy',
          value: 'parent_stratigraphy',
          show: true,
        },

        { text: 'stratigraphy.ageBase', value: 'ageBase', show: true },
        { text: 'stratigraphy.ageTop', value: 'ageTop', show: true },
        {
          text: 'stratigraphy.age_stratigraphy',
          value: 'age_stratigraphy',
          show: true,
        },
      ],
    },
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
}

export const mutations = {
  updateField,
  [SET_ALL_FIELD_NAMES](state, { module, rawFields }) {
    state[module].allFieldNames = rawFields
  },
  [SET_TABLE_HEADERS](state, { module, headers }) {
    state[module].tableHeaders = [...state[module].tableHeaders, ...headers]
  },
  [UPDATE_TABLE_HEADERS](state, { module, headers }) {
    const newHeaders = [...state[module].tableHeaders]

    newHeaders.forEach((item) => {
      item.show = headers.includes(item.value)
    })

    state[module] = {
      ...state[module],
      tableHeaders: newHeaders,
    }
  },
}

export const actions = {
  setTableHeaders({ commit, state }, { module, rawFields, fields }) {
    const tableHeaderValueList = state[module].tableHeaders.map(
      (item) => item.value
    )

    const headers = fields.reduce((prev, item) => {
      if (!tableHeaderValueList.includes(item)) {
        prev.push({
          text: `${module}.${item}`,
          value: item,
          show: false,
        })
      }
      return prev
    }, [])
    commit(SET_ALL_FIELD_NAMES, { module, rawFields })
    commit(SET_TABLE_HEADERS, { module, headers })
  },

  updateTableHeaders({ commit }, payload) {
    commit(UPDATE_TABLE_HEADERS, payload)
  },
}
