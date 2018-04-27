import {sendGet} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  cultivations: {},
  all_cultivations: {}
}

const actions = {
  fetchCultivationsTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/cultivations?expand=createdBy,modifiedBy,categories&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_CULTIVATIONS', response)
          let items = clone(state.cultivations)
          items['items'] = filter(orderBy(state.cultivations.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllCultivations ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/cultivations?per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_ALL_CULTIVATIONS', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

const getters = {
  getCultivations: (state) => {
    let items = clone(state.cultivations)
    items['items'] = filter(orderBy(state.cultivations, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllCultivations: (state) => {
    let items = clone(state.all_cultivations)
    items['items'] = filter(orderBy(state.all_cultivations.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_CULTIVATIONS (state, payload) {
    state.cultivations = payload
  },
  FETCH_ALL_CULTIVATIONS (state, payload) {
    state.all_cultivations = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
