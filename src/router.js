import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import NotFound from "./views/NotFound";

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/dashboard"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  else if (!requiresAuth && currentUser) next("dashboard");
  else next();
});

export default router;