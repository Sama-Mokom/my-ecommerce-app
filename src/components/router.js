import { createWebHistory, createRouter } from "vue-router";
import { isAuthenticated } from "../services/api";

import HomeView from "./HomeView.vue";
import SignUp from "./SignUp.vue";
import SignIn from "./SignIn.vue";
import Contact from "./Contact.vue";
import AboutView from "./AboutView.vue";
// import SignUpv2 from "./SignUpv2.vue";


const routes = [
  {
     path: "/", 
     component: HomeView,
     name: "HomeView"
      
    },
    {
      path: "/signup",
      component: SignUp,
      name: "Signup",
      meta: {
        requiresGuest: true //This route is only accessible when not logged in
      }
    },
    {
      path: "/signin",
      component: SignIn,
      name: "SignIn",
      meta: {
        requiresGuest: true
      }
    },
    // Protected routes which will be used later on
    // {
    //   path: "/account",
    //   component: Account, //account component to be built later
    //   name: "Account",
    //   meta: {requiresAuth: true}
    // },
    // {
    //    path: "/orders",
    //   component: Orders, //orders component to be built later
    //   name: "Orders",
    //   meta: {requiresAuth: true}
    // },
    {
      path: "/contact",
      component: Contact,
      name: "Contact"
    },
    {
      path: "/about",
      component: AboutView,
      name: "AboutView"
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation gaurds for protected routes
router.beforeEach((to, from, next) =>{
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect the user to the login page
    next({
      name: 'Login',
      query: {redirect: to.fullPath}
    });
    return;
  }

  // Check if route is guest-only (login/signup) but user is authenticated
  if (to.meta.requiresGuest && isAuthenticated.value) {
    // Redirect authenticated users away from login/signup
    next({ name: 'HomeView' });
    return;
  }

  next();
})

export default router;
