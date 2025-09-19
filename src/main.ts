import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import i18n from './locales/index'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'

import 'ant-design-vue/dist/reset.css'
import './assets/global.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(Antd)
app.use(createPinia())


app.mount('#app')
