import { createApp } from 'vue'
import './style.css'
import './assets/style.css'
import App from './App.vue'
import VueSplide from '@splidejs/vue-splide'
import '@splidejs/splide/dist/css/splide.min.css'
import router from '/src/components/router'
import { authActions } from '../stores/auth'


const initializeApp = async () =>{
    try {
      await authActions.initAuth()
    } catch (error) {
      console.log('Failed to initialize auth: ', error);
    }  
}

const app = createApp(App)

app.use(router)
app.use(VueSplide)

initializeApp().then(() => {
    app.mount('#app')
})
