const { createApp } = require('vue');
import App from './App.vue';
import Balerts from "./components/Balerts.vue"
import toast from "./components/toast.vue"

//import listItem from "./components/listItem.vue";
import { BAlert } from 'bootstrap-vue-3'
const app = createApp(App)
app.component('b-alert', BAlert)
app.component('Balerts', Balerts)
app.component('toast', toast)

.mount('#app');


