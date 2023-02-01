import Vue from 'vue';
import VueRouter from 'vue-router';
const RouterEntry = () => import ('@/views/RouterEntry');
const LoginIndex = () => import ('@/views/LoginIndex');
// const ApplicationEntry = () => import ('@/views/ApplicationEntry');
const PublicEntry = () => import ('@/views/PublicEntry');
const ProfilePage = () => import ('@/views/ProfilePage');
const ApplicationEntry = () => import("@/views/ApplicationEntry");
const DashboardIndex = () => import("@/views/DashboardIndex");


Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    linkExactActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            component: RouterEntry,
            name: 'Entry',
            redirect: 'dashboard',
            meta: {
                title: 'Developer Test',
                header: 'Developer Test'
            },
            children: [
                {
                    path: '',
                    component: PublicEntry,
                    name: 'Public Entry',
                    redirect: 'login',
                    children: [
                        {
                            path: 'login',
                            component: LoginIndex,
                            name: 'Login',
                            meta: {
                                title: 'Social Places | Login'
                            }
                        },
                    ]
                },
                {
                    path: '',
                    component: ApplicationEntry,
                    name: 'Application Entry',
                    redirect: 'dashboard',
                    children: [
                        {
                            path: 'dashboard',
                            component: DashboardIndex,
                            name: 'Dashboard',
                            meta: {
                                title: 'Social Places | Dashboard'
                            }
                        },
                        {
                            path: 'profile',
                            component: ProfilePage,
                            name: 'Profile',
                            meta: {
                                title: 'Social Places | Profile'
                            }
                        },
                    ]
                }
            ]
        },
        {path: '*', redirect: '/404'},
    ],
    scrollBehavior() { // ensures page is scrolled to top on navigation
        return {x: 0, y: 0};
    },
});

export default router;
