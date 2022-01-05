import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ViewView from '../views/ViewView.vue';
import ViewMint from '@/views/ViewMint.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: ViewMint,
  },

  
  {
    path: '/view/mint/:mint',
    name: 'ViewMint',
    component: ViewView,
  },
  {
    path: '/mint',
    name: 'Mint',
    component: ViewMint,
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
