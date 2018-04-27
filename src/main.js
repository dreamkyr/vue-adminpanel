import Vue from 'vue'
import lodash from 'lodash'
import store from './store'
import App from './App'
import swal from 'sweetalert2'
import Dialog from 'hsy-vue-dialog'
import router from './router'
import momentjs from 'moment'
import VeeValidate from 'vee-validate'
import jQuery from 'jquery'
import validate from './config/validate'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import VueMoment from 'vue-moment'
import './assets/files'

const EventBus = new Vue()
let auth = false

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: () => {
      return EventBus
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title(to) + '\xa0 - \xa0' + store.getters.getAppName
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth) {
      next({
        path: '/signin',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
window.jQuery = jQuery
Vue.use(VeeValidate, validate)
Vue.use(VueMoment)
Vue.use(Dialog)
Vue.config.productionTip = false
Vue.prototype.$lodash = lodash
Vue.prototype.$momentjs = momentjs
Vue.prototype.$swal = swal
Vue.component('ClipLoader', ClipLoader)
if (store.getters.getIsLoggedIn) {
  auth = true
} else {
  auth = false
}
Vue.prototype.$jQuery = jQuery
Vue.filter('fullUserName', (value) => {
  if (!value) return ''
  return value.firstname + ' ' + value.lastname
})
Vue.filter('toNumber', (value) => {
  return lodash.toNumber(value)
})
Vue.filter('toDate', function (value) {
  let format = 'D MMMM YYYY h:mm A'
  if (!value) return ''
  let date = new Date(value * 1000)
  let now = new Date()
  let diff = ((now - date) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 60 * 5) return 'A few minutes ago'
  if (date.toDateString() === now.toDateString()) format = '[Today] h:mm A'
  if (date.toDateString() === new Date(Date.now() - 864e5).toDateString()) format = '[Yesterday] h:mm A'
// eslint-disable-next-line new-cap
  return new momentjs(date).format(format)
})
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
global.vm = vm
/* TODO
  1. Fix datatables +
  2. Make good pagination +
  3. Make universal modal and alert
  4. Optimize memory
  DeadLine: 1 Nov
 */
