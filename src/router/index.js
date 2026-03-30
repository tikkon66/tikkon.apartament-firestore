import { createRouter, createWebHistory, useRouter} from "vue-router"
import Home from "../components/pages/Home.vue"
import FlatPage from "../components/pages/FlatPage.vue"
import PersonalOffice from "../components/pages/PersonalOffice.vue";
import Favorite from "../components/pages/Favorite.vue";
import Reserves from "../components/pages/Reserves.vue";
import MyComents from "../components/pages/MyComents.vue";
import ProfileEditor from "../components/pages/ProfileEditor.vue";
import AdminPanel from "../components/pages/AdminPanel.vue";


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

const router = createRouter({
    history: createWebHashHistory()(),
    routes
});

export default router
