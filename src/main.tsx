import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './index.css';

// Register TechPanel globally so it remains available effortlessly
import TechPanel from './components/TechPanel.vue';

const app = createApp(App);

app.component('TechPanel', TechPanel);

app.use(store);
app.use(router);
app.use(ElementPlus);

app.mount('#root');
