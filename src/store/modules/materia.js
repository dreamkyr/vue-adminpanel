import { sendGet } from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  materiaActivity: {}
}

const actions = {
  fetchMateriaActivity ({commit}, payload) {
    let page = payload['page'] || 1
    let count = payload['per-page'] || 10
    return new Promise((resolve, reject) => {
      sendGet('/activities/search?type[]=formula&type[]=herb&expand=user,object&page=' + page + '&per-page=' + count)
        .then((response) => {
          commit('FETCH_MATERIA_ACTIVITY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

const getters = {
  getMateriaActivity: (state) => {
    let items = clone(state.materiaActivity)
    items['items'] = filter(orderBy(state.materiaActivity.items, ['created_time'], ['desc']))
    return items
  }
}

const mutations = {
  FETCH_MATERIA_ACTIVITY (state, payload) {
    state.materiaActivity = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
