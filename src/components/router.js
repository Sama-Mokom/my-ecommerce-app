import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./HomeView.vue";
import SignUp from "./SignUp.vue";
import SignIn from "./SignIn.vue";


const routes = [
  {
     path: "/", 
     component: HomeView,
     name: "HomeView"
      
    },
    {
      path: "/signup",
      component: SignUp,
      name: "Signup"
    },
    {
      path: "/signin",
      component: SignIn,
      name: "SignIn"
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
