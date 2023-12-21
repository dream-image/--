import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router';
import axios from 'axios'
import 'animate.css';
import { createPinia } from 'pinia';
import 'default-passive-events'
import VueLuckyCanvas from '@lucky-canvas/vue'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import {io} from'socket.io-client'
// const socket = new VueSocketIO({
//   debug: false, // debug调试，生产建议关闭
//   connection: SocketIO('http://localhost:3000',{autoConnect:false}),
//   });

const socket=io('ws://192.168.13.1:8082',{autoConnect:false})

axios.defaults.baseURL = 'http://192.168.13.1:8081'
axios.defaults.headers.post["Access-Control-Allow-Origin-Type"] = "*";
const app =createApp(App)

app.provide('$axios',axios);
app.provide('$socket',socket)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router)
app.use(ElementPlus)
app.use(createPinia());
app.use(VueLuckyCanvas)

app.mount('#app')

