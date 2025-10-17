import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// Global error handler for uncaught component errors
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error caught:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
  // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
}

app.use(createPinia())
app.use(router)

app.mount('#app')