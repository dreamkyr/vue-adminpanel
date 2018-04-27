import { sendGet, sendPost, sendDelete, sendPostJSON, sendPutJSON } from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  prepmethods: {},
  prepMethod: {
    id: '',
    name: '',
    description: '',
    category: 0,
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  },
  sort: ''
}

const actions = {
  createPrepMethod ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/preparations', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Preparation method created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  createPrepMethodCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/preparation-categories', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'PrepMethod created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchPrepMethods ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/preparations?expand=createdBy,modifiedBy,categories&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_PREPMETHODS', response)
          let items = clone(state.prepmethods)
          items['items'] = filter(orderBy(state.prepmethods.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  searchPrepMethods ({commit}, payload) {
    if (state.sort === '') {
      payload.sort = ''
    } else {
      payload.sort = 'letter=' + state.sort + '&'
    }
    return new Promise((resolve, reject) => {
      sendGet('/preparations/search?' + payload.sort + 'expand=createdBy,modifiedBy,categories&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_PREPMETHODS', response)
          let items = clone(state.prepmethods)
          items['items'] = filter(orderBy(state.prepmethods.items, ['created_at'], ['asc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchPrepTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/preparations?expand=createdBy,modifiedBy,categories&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_PREPMETHODS', response)
          let items = clone(state.prepmethods)
          items['items'] = filter(orderBy(state.prepmethods.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updatePrepMethod ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPutJSON('/preparations/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Preparation method is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deletePrepMethod ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/preparations/' + payload.id, null)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: response.name + ' is deleted!', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setPrepMethodValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_PREPMETHOD_VALUE', payload)
    })
  },
  setAlabetSort ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_ALPHABET_SORT', payload)
    })
  }
}

const getters = {
  getPrepMethods: (state) => {
    let items = clone(state.prepmethods)
    items['items'] = filter(orderBy(state.prepmethods.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getPrepMethod: (state) => {
    return state.prepMethod
  }
}

const mutations = {
  FETCH_PREPMETHODS (state, payload) {
    state.prepmethods = payload
  },
  SET_PREPMETHOD_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.prepMethod.id = payload.id
    }
    if (payload.hasOwnProperty('name')) {
      state.prepMethod.name = payload.name
    }
    if (payload.hasOwnProperty('description')) {
      state.prepMethod.description = payload.description
    }
    if (payload.hasOwnProperty('category')) {
      state.prepMethod.category = payload.category
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.prepMethod.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.prepMethod.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.prepMethod.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.prepMethod.created_time = payload.created_time
    }
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
