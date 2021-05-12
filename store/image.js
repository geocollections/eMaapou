import { getField, updateField } from 'vuex-map-fields'
import { IMAGE } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: IMAGE.options,
    filters: {
      byIds: {
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'locality.name',
          fields: ['locality', 'locality_en'],
        },
        people: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'image.people',
          fields: ['image_people'],
        },
      },
      allIds: ['locality', 'people'],
    },
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
}

export const mutations = {
  updateField,
  SET_ITEMS(state, items) {
    state.items = items
  },
  SET_COUNT(state, count) {
    state.count = count
  },
  SET_OPTIONS(state, options) {
    state.options = options
  },
  RESET_FILTERS(state) {
    const defaultState = getDefaultState()

    state.filters = defaultState.filters
    state.options = { ...state.options, page: defaultState.options.page }
  },
}

export const actions = {
  resetImageFilters({ commit }) {
    commit('RESET_FILTERS')
  },
  async quickSearchImages(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const imageResponse = await this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(IMAGE.queryFields),
        searchFilters: {},
        defaultParams: {
          fq: 'specimen_image_attachment:2',
        },
      }
    )
    commit('SET_ITEMS', imageResponse.items)
    commit('SET_COUNT', imageResponse.count)
  },
  async searchImages(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)

    const imageResponse = await this.$services.sarvSolr.getResourceList(
      'attachment',
      {
        options,
        search: rootState.landing.search,
        queryFields: this.$getQueryFields(IMAGE.queryFields),
        searchFilters: state.filters.byIds,
        defaultParams: {
          fq: 'specimen_image_attachment:2',
        },
      }
    )
    commit('SET_ITEMS', imageResponse.items)
    commit('SET_COUNT', imageResponse.count)
  },
}
