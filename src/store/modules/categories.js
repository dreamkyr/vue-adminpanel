import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  categories: {},
  definedCategories: {},
  sort: ''
}

const actions = {
  createCategory ({commit, dispatch}, payload) {
    if (payload.id) payload.id = ''
    return new Promise((resolve, reject) => {
      sendPost('/categories', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Category created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchCategories ({commit}, payload) {
    if (state.sort === 'All') {
      commit('SET_ALPHABET_SORT', '')
    }
    if (payload.type === 'prep') payload.type = 'preparation'
    let page = payload['page'] || 1
    let count = payload['per-page'] || 0
    return new Promise((resolve, reject) => {
      sendGet('/categories/search?type=' + payload.type + '&letter=' + state.sort + '&expand=createdBy,modifiedBy&page=' + page + '&per-page=' + count)
        .then((response) => {
          commit('FETCH_CATEGORIES', response)
          commit('FETCH_DEFINED_CATEGORIES', response)
          let items = clone(state.categories)
          items['items'] = filter(orderBy(state.categories.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateCategory ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/categories/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: payload.tabName + ' is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteCategory ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/categories/' + payload, null)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: response.name + ' is deleted!', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setAlabetSort ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_ALPHABET_SORT', payload)
    })
  }
}

const getters = {
  getCategories: (state) => {
    let items = clone(state.categories)
    items['items'] = filter(orderBy(state.categories.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getDefinedCategories: (state) => {
    let items = clone(state.definedCategories)
    items = filter(orderBy(state.definedCategories.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_CATEGORIES (state, payload) {
    state.categories = payload
  },
  FETCH_DEFINED_CATEGORIES (state, payload) {
    state.definedCategories = payload
  },
  SET_ALPHABET_SORT (state, payload) {
    state.sort = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
