<script setup>
import TopBanner from './components/TopBanner.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <div>
    <TopBanner />
    <Header />
    <RouterView />
    <Footer />
    <BackToTop />
  </div>
</template>

<style scoped>

</style>
