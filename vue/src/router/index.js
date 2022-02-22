import { createRouter, createWebHistory } from "vue-router";
import Dashboard from '../components/Dashboard.vue';
import Survey from '../components/Survey.vue';
import AppLayout from '../Layout/AppLayout.vue';
import store from "../store";
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import SurveyView from '../views/SurveyView.vue';

const routes = [
    {
        path: "/",
        redirect: "/dashboard",
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            { path: "/dashboard", name: "Dashboard", component: Dashboard },
            { path: "/survey", name: "Survey", component: Survey },
            { path: "/surveys/create", name: "SurveyCreate", component: SurveyView },
            { path: "/surveys/:id", name: "SurveyView", component: SurveyView },
        ],
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {isGuest: true},
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: {isGuest: true},
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.user.token) {
        next({ name: 'Login' });
    } else if(store.state.user.token && to.meta.isGuest){
        next({name:"Dashboard"})
    } else {
        next();
    }
})

export default router;
