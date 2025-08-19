import { createWebHistory, createRouter } from "vue-router";
import { isAuthenticated } from "../../stores/auth";
import { watch } from "vue";

import HomeView from "./HomeView.vue";
import SignUp from "./SignUp.vue";
import SignIn from "./SignIn.vue";
import Contact from "./Contact.vue";
import AboutView from "./AboutView.vue";
import Wishlist from "./Wishlist.vue";
import Cart from "./Cart.vue";
import CheckOut from './CheckOut.vue';
import Account from './Account.vue';
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
    {
      path: "/wishlist",
      component: Wishlist,
      name: "Wishlist",
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/cart",
      component: Cart,
      name: "Cart",
      meta: {
        requiresAuth: true
      }
    },
    {
  path: '/checkout',
  component: CheckOut,
  name: 'CheckOut',
  meta: {
    requiresAuth: true
  }
},
    // Protected routes which will be used later on
    {
      path: "/account",
      component: Account, //account component to be built later
      name: "Account",
      meta: {requiresAuth: true}
    },
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
router.beforeEach(async (to, from, next) => {
  // Import authStore here to avoid circular dependency issues
  const { authStore } = await import('../../stores/auth.js');
  
  // If authentication is still loading, wait for it to complete
  if (authStore.isLoading) {
    // Wait for authentication to complete
    await new Promise(resolve => {
      const unwatch = watch(() => authStore.isLoading, (loading) => {
        if (!loading) {
          unwatch();
          resolve();
        }
      });
    });
  }

  if (to.meta.requiresAuth && !authStore.user) {
    // Redirect the user to the login page
    next({
      name: 'SignIn',
      query: {redirect: to.fullPath}
    });
    return;
  }

  // Check if route is guest-only (login/signup) but user is authenticated
  if (to.meta.requiresGuest && authStore.user) {
    // Redirect authenticated users away from login/signup
    next({ name: 'HomeView' });
    return;
  }

  next();
})

export default router;
