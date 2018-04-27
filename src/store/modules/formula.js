import { sendGet, sendPostJSON, sendDelete, sendPutJSON } from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'

const state = {
  formulas: {},
  totalFormulas: {},
  formula: {},
  selectedFormula: {
    id: '',
    pinyin: '',
    english_name: '',
    latin_name: '',
    traditional_chinese: '',
    simplified_chinese: '',
    pinyin_ton: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: '',
    created_at: '',
    modified_at: ''
  },
  formulaActivity: {},
  formulasCategories: {},
  currentCategories: [],
  formulaCategories: [],
  formulaActions: [],
  formulaSymptoms: [],
  formulaHerbs: [],
  formulaTexts: [],
  formulaPreps: [],
  sort: ''
}

const actions = {
  fetchFormulas ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/formulas?expand=categories,createdBy,modifiedBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_FORMULAS', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  searchFormulas ({commit}, payload) {
    if (state.sort === 'All') {
      commit('SET_ALPHABET_SORT', '')
    }
    return new Promise((resolve, reject) => {
      sendGet('/formulas/search?letter=' + state.sort + '&' + payload.query + '&expand=createdBy,modifiedBy,categories&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_FORMULAS', response)
          resolve(response)
        })
        .catch((error) => {
          console.log('error')
          reject(error)
        })
    })
  },
  fetchFormulaTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/formulas/search?' + payload.query + '&expand=createdBy,modifiedBy,categories&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_TOTAL_FORMULAS', response)
          resolve(response)
        })
        .catch((error) => {
          console.log('error')
          reject(error)
        })
    })
  },
  fetchFormula ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/formulas/' + payload.id + '?expand=categories,actions,symptoms,herbs,preparations,sources,createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_FORMULA', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchFormulaActivity ({commit}, payload) {
    let page = payload['page'] || 1
    let count = payload['per-page'] || 10
    return new Promise((resolve, reject) => {
      sendGet('/formulas/' + payload.id + '/activities?expand=user&page=' + page + '&per-page=' + count)
        .then((response) => {
          commit('FETCH_FORMULA_ACTIVITY', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchFormulasCategories ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/categories/search?type=formula&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_FORMULAS_CATEGORIES', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchFormulasActions ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/actions/search?type=formula&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_FORMULAS_ACTIONS', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchFormulasSymptoms ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/categories/search?type=formula&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_FORMULAS_SYMPTOMS', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createFormula ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formulas', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula created', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateFormula ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendPutJSON('/formulas/' + payload.id, payload.model)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula updated', alertClass: 'success'})
          commit('FETCH_FORMULA_WITHOUT_RELATIONS', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateFormulaRelations ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formulas/import', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula relations updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteFormula ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/formulas/' + payload.id)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula deleted', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createFormulaCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formula-categories', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateFormulaCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formulas/' + payload.formula_id + '/categories', payload.categories)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteFormulaCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/formula-categories/159' + payload.id)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  updateFormulaHerbs ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formulas/' + payload.formula_id + '/herbs', payload.herbs)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula herbs updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateFormulaPreps ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/formulas/' + payload.formula_id + '/preparations', payload.preps)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Formula preparations updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setFormulaValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_VALUE', payload)
    })
  },
  setFormulaCategories ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_CATEGORIES', payload)
    })
  },
  setFormularActions ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_ACTIONS', payload)
    })
  },
  setFormularSymptoms ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_SYMPTOMS', payload)
    })
  },
  setFormulaHerbs ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_HERBS', payload)
    })
  },
  setFormulaPreps ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_PREPS', payload)
    })
  },
  setFormulaTexts ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_FORMULA_TEXTS', payload)
    })
  },
  setAlabetSort ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_ALPHABET_SORT', payload)
    })
  }
}

const getters = {
  getFormulas: (state) => {
    let items = clone(state.formulas)
    items['items'] = filter(orderBy(state.formulas.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getTotalFormulas: (state) => {
    let items = clone(state.totalFormulas)
    items['items'] = filter(orderBy(state.totalFormulas.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getFormula: (state) => {
    return state.formula
  },
  getSelectedFormula: (state) => {
    return state.selectedFormula
  },
  getFormulaCategories: (state) => {
    return state.formulaCategories
  },
  getFormulaActions: (state) => {
    return state.formulaActions
  },
  getFormulaSymptoms: (state) => {
    return state.formulaSymptoms
  },
  getFormulaCategoryIds: (state) => {
    let formulaCategories = clone(state.formulaCategories)
    return reduce(formulaCategories, function (ids, category) {
      ids.push(category.id)
      return ids
    }, [])
  },
  getFormulaActionsIds: (state) => {
    let formulaActions = clone(state.formulaActions)
    return reduce(formulaActions, function (ids, action) {
      ids.push(action.id)
      return ids
    }, [])
  },
  getFormulaHerbs: (state) => {
    return state.formulaHerbs
  },
  getFormulaHerbIds: (state) => {
    let formulaHerbs = clone(state.formulaHerbs)
    return reduce(formulaHerbs, function (ids, herb) {
      ids.push(herb.id)
      return ids
    }, [])
  },
  getFormulaPreps: (state) => {
    return state.formulaPreps
  },
  getFormulaPrepIds: (state) => {
    let formulaPreps = clone(state.formulaPreps)
    return reduce(formulaPreps, function (ids, prep) {
      ids.push(prep.id)
      return ids
    }, [])
  },
  getFormulaTexts: (state) => {
    return state.formulaTexts
  },
  getFormulaTextIds: (state) => {
    let formulaTexts = clone(state.formulaTexts)
    return reduce(formulaTexts, function (ids, text) {
      ids.push(text.id)
      return ids
    }, [])
  },
  getFormulaActivity: (state) => {
    let items = clone(state.formulaActivity)
    items['items'] = filter(orderBy(state.formulaActivity.items, ['created_time'], ['desc']))
    return items
  },
  getFormulasCategories: (state) => {
    let items = clone(state.formulasCategories)
    items['items'] = filter(orderBy(state.formulasCategories, ['name'], ['asc']), {'is_deleted': 0})
    return items['items']
  },
  getFormulasActions: (state) => {
    let items = clone(state.formulasActions)
    items['items'] = filter(orderBy(state.formulasActions, ['name'], ['asc']), {'is_deleted': 0})
    return items['items']
  }
}

const mutations = {
  FETCH_FORMULAS (state, payload) {
    state.formulas = payload
  },
  FETCH_TOTAL_FORMULAS (state, payload) {
    state.totalFormulas = payload
  },
  FETCH_FORMULA (state, payload) {
    state.formula = payload
    state.formulaCategories = payload.categories
    state.formulaActions = payload.actions
    state.formulaSymptoms = payload.symptoms
    state.formulaHerbs = payload.herbs
    state.formulaPreps = payload.preparations
    state.formulaTexts = payload.sources
  },
  FETCH_FORMULA_WITHOUT_RELATIONS (state, payload) {
    state.formula = payload
  },
  SET_FORMULA_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.selectedFormula.id = payload.id
    }
    if (payload.hasOwnProperty('pinyin')) {
      state.selectedFormula.pinyin = payload.pinyin
    }
    if (payload.hasOwnProperty('english_name')) {
      state.selectedFormula.english_name = payload.english_name
    }
    if (payload.hasOwnProperty('latin_name')) {
      state.selectedFormula.latin_name = payload.latin_name
    }
    if (payload.hasOwnProperty('traditional_chinese')) {
      state.selectedFormula.traditional_chinese = payload.traditional_chinese
    }
    if (payload.hasOwnProperty('simplified_chinese')) {
      state.selectedFormula.simplified_chinese = payload.simplified_chinese
    }
    if (payload.hasOwnProperty('pinyin_ton')) {
      state.selectedFormula.pinyin_ton = payload.pinyin_ton
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.selectedFormula.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.selectedFormula.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.selectedFormula.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.selectedFormula.created_time = payload.created_time
    }
    if (payload.hasOwnProperty('created_at')) {
      state.selectedFormula.created_at = payload.created_at
    }
    if (payload.hasOwnProperty('modified_at')) {
      state.selectedFormula.modified_at = payload.modified_at
    }
  },
  FETCH_FORMULA_ACTIVITY (state, payload) {
    state.formulaActivity = payload
  },
  FETCH_FORMULAS_CATEGORIES (state, payload) {
    state.formulasCategories = payload
  },
  FETCH_FORMULAS_ACTIONS (state, payload) {
    state.formulaActions = payload
  },
  FETCH_FORMULAS_SYMPTOMS (state, payload) {
    state.formulaSymptoms = payload
  },
  PUSH_FORMULA_CATEGORY (state, payload) {
    state.currentCategories.push(payload)
  },
  SET_FORMULA_CATEGORIES (state, payload) {
    state.formula.categories = payload
    state.formulaCategories = payload
  },
  SET_FORMULA_ACTIONS (state, payload) {
    state.formula.actions = payload
    state.formulaActions = payload
  },
  SET_FORMULA_SYMPTOMS (state, payload) {
    state.formula.symptoms = payload
    state.formulaSymptoms = payload
  },
  SET_FORMULA_HERBS (state, payload) {
    state.formula.herbs = payload
    state.formulaHerbs = payload
  },
  SET_FORMULA_PREPS (state, payload) {
    state.formula.preparations = payload
    state.formulaPreps = payload
  },
  SET_FORMULA_TEXTS (state, payload) {
    state.formula.sources = payload
    state.formulaTexts = payload
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
