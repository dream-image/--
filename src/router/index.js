import { createRouter, createWebHashHistory } from "vue-router"


import Login from '../pages/Login.vue'
import Wrap from '../pages/Wrap.vue'
import Class from '../pages/Class.vue'
import Draw from '../pages/Draw.vue'
import Register from '../pages/Register.vue'
import Result from '../pages/Result.vue'
import DrawPage from '../pages/DrawPage.vue'
const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        meta: { pageName: '登陆' }
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register,
        meta: { pageName: '注册' }
    }
    ,
    {
        path: '/Homepage',
        name: 'Homepage',
        component: Wrap,
        meta: { pageName: '主页' },
        children: [
            {
                path: '/Class',
                name: 'Class',
                component: Class,
                meta: {

                }
            },
            {
                path: '/Draw',
                name: 'Draw',
                component: Draw,
                meta: {

                }
            },
            {
                path: '/Result',
                name: 'Result',
                component: Result,
                meta: {

                }
            },
        ]
    },
    {
        path: '/DrawPage',
        name: 'DrawPage',
        component: DrawPage
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
export default router