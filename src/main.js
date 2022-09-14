import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const Swal = require('sweetalert2')

createApp(App).use(router, Swal).mount('#app')
