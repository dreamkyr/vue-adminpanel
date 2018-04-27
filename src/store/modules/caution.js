import {sendGet} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  cautions: {},
  all_cautions: {}
}

const actions = {
  fetchCautionsTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/cautions?expand=createdBy,modifiedBy,categories&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_CULTIVATIONS', response)
          let items = clone(state.cautions)
          items['items'] = filter(orderBy(state.cautions.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllCautions ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/cautions?per-page=0&query=' + payload.query, null, null)
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
  getCautions: (state) => {
    let items = clone(state.cautions)
    items['items'] = filter(orderBy(state.cautions, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllCautions: (state) => {
    let items = clone(state.all_cautions)
    items['items'] = filter(orderBy(state.all_cautions.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_CULTIVATIONS (state, payload) {
    state.cautions = payload
  },
  FETCH_ALL_CULTIVATIONS (state, payload) {
    state.all_cautions = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
