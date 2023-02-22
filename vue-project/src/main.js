import { createApp, VueElement } from 'vue'
import App from './App.vue'
import './assets/main.css'
import MsalService from './services/MsalService'
createApp(App).mount('#app')
var Vue = require('vue')
var VueCookie = require('vue-cookie')
Vue.use(VueCookie);
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
let token = JSON.parse(localStorage.getItem('Access_Token'))
if(token){
    window.axios.defaults.headers.common['Authorization'] = 'Bearer' + token
}
Vue.prototype.$msal = new MsalService();
