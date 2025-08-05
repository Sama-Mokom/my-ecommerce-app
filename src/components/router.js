import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./HomeView.vue";
import SignUp from "./SignUp.vue";


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
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
