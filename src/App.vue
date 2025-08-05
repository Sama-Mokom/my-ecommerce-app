<script setup>
import TopBanner from './components/TopBanner.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'
import SignUp from "./components/SignUp.vue";
</script>

<template>
  <div>
    <TopBanner />
    <Header />
    <!-- <SignUp /> -->
    <RouterView />
    <Footer />
    <BackToTop />
  </div>
</template>

<style scoped>

</style>
