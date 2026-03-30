import { createRouter, createWebHashHistory } from 'vue-router' // Оставляем только Hash
import Home from "../components/pages/Home.vue"
import FlatPage from "../components/pages/FlatPage.vue"
import PersonalOffice from "../components/pages/PersonalOffice.vue";
import Favorite from "../components/pages/Favorite.vue";
import Reserves from "../components/pages/Reserves.vue";
import MyComents from "../components/pages/MyComents.vue";
import ProfileEditor from "../components/pages/ProfileEditor.vue";
import AdminPanel from "../components/pages/AdminPanel.vue";

// 1. Сначала определяем маршруты
const routes = [
    { path: "/", component: Home },
    { path: '/product/:id', name: 'FlatPage', component: FlatPage },
    { path: '/personal', name: 'PersonalOffice', component: PersonalOffice },
    { path: '/liked/:id', name: 'Favorite', component: Favorite },
    { path: '/booked/:id', name: 'Reserves', component: Reserves },
    { path: '/coments/:id', name: 'MyComents', component: MyComents },
    { path: '/editor/:id', name: 'ProfileEditor', component: ProfileEditor },
    { path: '/adminPanel/', name: 'AdminPanel', component: AdminPanel },
]

// 2. Затем создаем роутер и ПЕРЕДАЕМ в него routes
const router = createRouter({
  history: createWebHashHistory(), 
  routes: routes // Или просто routes, если названия совпадают
})

console.log("Router initialized with routes");

export default router
