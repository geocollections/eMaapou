import { getField, updateField } from 'vuex-map-fields'
export const state = () => ({
  items: [],
  count: 0,
  options: {
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  },
  headers: [
    { text: 'locality.name', value: 'locality' },
    { text: 'locality.country', value: 'country' },
    { text: 'locality.latitude', value: 'latitude' },
    { text: 'locality.longitude', value: 'longitude' },
  ],
  search: {
    byIds: {
      name: {
        value: '',
        type: 'text',
        lookUpType: 'contains',
        label: 'locality.name',
        fields: ['locality', 'locality_en'],
      },
      country: {
        value: '',
        type: 'text',
        lookUpType: 'contains',
        label: 'locality.country',
        fields: ['country', 'country_en'],
      },
    },
    allIds: ['name', 'repository', 'country', 'storage', 'boxes'],
  },
})

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
}

export const actions = {
  async searchLocalities(
    { commit, rootState, state },
    options = { ...state.options, page: 1 }
  ) {
    commit('SET_OPTIONS', options)
    // TODO: move these functions somewhere where they are not created every time the action is called
    // TODO: Check is these are even used
    const queryFields = {
      drillcore: () =>
        this.$i18n.locale === 'et' ? 'drillcore' : 'drillcore_en',
      depth: () => 'depth',
      boxes: () => 'boxes',
      box_numbers: () => 'box_numbers',
      storage__location: () => 'storage__location',
      year: () => 'year',
      remarks: () => 'remarks',
    }

    const drillcoreResponse = await this.$services.sarvSolr.getResourceList(
      'locality',
      {
        tableOptions: options,
        search: rootState.landing.search,
        queryFields,
        searchFilters: state.search.byIds,
      }
    )
    commit('SET_ITEMS', drillcoreResponse.items)
    commit('SET_COUNT', drillcoreResponse.count)
  },
}
