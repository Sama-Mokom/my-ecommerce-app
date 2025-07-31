import { createApp } from 'vue'
import './style.css'
import './assets/style.css'
import App from './App.vue'
import VueSplide from '@splidejs/vue-splide'
import '@splidejs/splide/dist/css/splide.min.css'

createApp(App).mount('#app')
App.use(VueSplide);