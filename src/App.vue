<script setup>
import TopBanner from './components/TopBanner.vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import HeroBanner from './components/HeroBanner.vue'
import FlashSales from './components/FlashSales.vue'
import Categories from './components/Categories.vue'
import BestSelling from './components/BestSelling.vue'
import MusicBanner from './components/MusicBanner.vue'
import JBLBoomboxImg from './assets/images/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png'
import ExploreProducts from './components/ExploreProducts.vue'
import NewArrival from './components/NewArrival.vue'
import Services from './components/Services.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <div>
    <TopBanner />
    <Header />
    <main class="main">
      <div class="container">
        <div class="main-layout">
          <Sidebar />
          <HeroBanner />
        </div>
      </div>
      <FlashSales />
      <Categories />
      <BestSelling />
      <MusicBanner :image="JBLBoomboxImg" />
      <ExploreProducts />
      <NewArrival />
      <Services />
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>

<style scoped>

</style>
