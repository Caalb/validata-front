import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'

import App from './App.vue'
import router from './router'

// Configuração do tema
import { themeOverrides } from './theme/theme'

// Configuração de variáveis CSS personalizadas
const style = document.createElement('style')
style.textContent = `
  :root {
    --primary-color-50: #fff0f0;
    --primary-color-100: #ffdddd;
    --primary-color-200: #ffc0c0;
    --primary-color-300: #ff9494;
    --primary-color-400: #ff5757;
    --primary-color-500: #ff2323;
    --primary-color-600: #ff0000;
    --primary-color-700: #d70000;
    --primary-color-800: #b10303;
    --primary-color-900: #920a0a;

    --secondary-color-50: #fef2f2;
    --secondary-color-100: #fee2e2;
    --secondary-color-200: #fecaca;
    --secondary-color-300: #fca5a5;
    --secondary-color-400: #f87171;
    --secondary-color-500: #ef4444;
    --secondary-color-600: #dc2626;
    --secondary-color-700: #b91c1c;
    --secondary-color-800: #991b1b;
    --secondary-color-900: #7f1d1d;
  }
`
document.head.appendChild(style)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

// Configuração do tema global
app.provide('themeOverrides', themeOverrides)

app.mount('#app')
