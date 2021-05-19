import { getField, updateField } from 'vuex-map-fields'

const getDefaultState = () => {
  return {
    photo: {
      allFieldNames: null,
      tableHeaders: [
        { text: 'image.id', value: 'id', show: true },
        { text: 'image.number', value: 'image_number', show: true },
        { text: 'image.agent', value: 'agent', show: true },
        { text: 'image.date', value: 'date', show: true },
        { text: 'image.locality', value: 'locality', show: true },
        {
          text: 'image.imageObject',
          value: 'image_object',
          show: true,
        },
        { text: 'image.tags', value: 'tags', show: true },
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
  SET_TABLE_HEADERS(state, { module, headers }) {
    state[module].tableHeaders = [...state[module].tableHeaders, ...headers]
  },
  UPDATE_TABLE_HEADERS(state, { module, headers }) {
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
  setTableHeaders({ commit, state }, { module, fields }) {
    const tableHeaderValueList = state[module].tableHeaders.map(
      (item) => item.value
    )

    const headers = fields.reduce((prev, item) => {
      if (!tableHeaderValueList.includes(item)) {
        prev.push({
          text: `image.${item}`,
          value: item,
          show: false,
        })
      }
      return prev
    }, [])
    commit('SET_TABLE_HEADERS', { module, headers })
  },

  updateTableHeaders({ commit }, payload) {
    commit('UPDATE_TABLE_HEADERS', payload)
  },
}
