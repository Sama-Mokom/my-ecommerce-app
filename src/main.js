import { createApp } from 'vue'
import './style.css'
import './assets/style.css'
import App from './App.vue'
import VueSplide from '@splidejs/vue-splide'
import '@splidejs/splide/dist/css/splide.min.css'
import router from './components/router.js'
import { authActions } from '../stores/auth'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';


const initializeApp = async () => {
    try {
      await authActions.initAuth()
      console.log('Authentication initialization completed');
    } catch (error) {
      console.log('Failed to initialize auth: ', error);
    }  
}

const app = createApp(App)

app.use(router)
app.use(VueSplide)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
});

// Wait for authentication to complete before mounting
initializeApp().then(() => {
    console.log('Mounting app...');
    app.mount('#app')
}).catch(error => {
    console.error('Failed to initialize app:', error);
    // Still mount the app even if auth fails
    app.mount('#app')
})
