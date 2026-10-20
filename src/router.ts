import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import AppDashboard from './components/AppDashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: AppDashboard
  }
];

// 使用 hash 模式：大屏多为静态部署/内嵌 iframe，hash 路由无需服务端 history 回退，
// 可避免“打开黑屏”问题（createWebHistory 在无回退的环境下路由不匹配导致白屏）。
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
