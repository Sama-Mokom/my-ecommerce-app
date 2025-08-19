<script setup>
import TopBanner from './components/TopBanner.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'
import AuthLoading from './components/AuthLoading.vue'
</script>

<template>
  <div class="main-container">
    <AuthLoading />
    <TopBanner />
    <Header />
    <RouterView />
    <Footer />
    <BackToTop />
  </div>
</template>

<style scoped>
.main-container{
  overflow: hidden;
}
</style>
