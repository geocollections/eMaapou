import { getField, updateField } from 'vuex-map-fields'
import { isEmpty, isNil } from 'lodash'
import { IMAGE } from '~/constants'

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: IMAGE.options,
    currentView: 'image',
    filters: {
      byIds: {
        locality: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.locality',
          fields: ['locality', 'locality_en'],
        },
        people: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.people',
          fields: ['image_people'],
        },
        tags: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.tags',
          fields: ['tags'],
        },
        country: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.countryCountyParish',
          fields: [
            'country',
            'country_en',
            'maakond',
            'maakond_en',
            'vald',
            'vald_en',
          ],
        },
        date: {
          type: 'range',
          lookUpType: 'range',
          value: [null, null],
          label: 'photo.date',
          placeholders: ['boxes.min', 'boxes.max'],
          fields: ['date_created', 'date_created_free_year'],
        },
        dateFree: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.dateFree',
          fields: ['date_created_free'],
        },
        imageNumber: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.imageNumber',
          fields: ['image_number'],
        },
        author: {
          value: '',
          type: 'text',
          lookUpType: 'contains',
          label: 'photo.author',
          fields: ['agent', 'author_free'],
        },
        imageSize: {
          value: '',
          type: 'text',
          lookUpType: 'greaterThan',
          label: 'photo.size',
          fields: ['image_width', 'image_height'],
        },
        specimenImageAttachment: {
          value: '2',
          type: 'text',
          lookUpType: 'equals',
          fields: ['specimen_image_attachment'],
        },
      },
      allIds: ['locality', 'people'],
    },
  }
}

export const state = () => getDefaultState()

export const getters = {
  getField,
  hasActiveFilters(state) {
    return Object.values(state.filters.byIds).some((filter) => {
      if (Array.isArray(filter.value))
        return filter.value.some(function (v) {
          return v !== null
        })
      return !isEmpty(filter.value) && !isNil(filter.value)
    })
  },
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
  resetImageFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('globalSearch/resetGlobalSearchFilters', null, { root: true })
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
        searchFilters: {
          ...state.filters.byIds,
          ...rootState.globalSearch.filters.byIds,
        },
      }
    )
    commit('SET_ITEMS', imageResponse.items)
    commit('SET_COUNT', imageResponse.count)
  },
}
