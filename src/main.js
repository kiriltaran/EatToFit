import Vue from 'vue'
import VueFire from 'vuefire'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-default/index.css'

import App from './App.vue'

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(ElementUI)

export const bus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
})