<template>
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
</template>


<script setup>
import Sidebar from './Sidebar.vue'
import HeroBanner from './HeroBanner.vue'
import FlashSales from './FlashSales.vue'
import Categories from './Categories.vue'
import BestSelling from './BestSelling.vue'
import MusicBanner from './MusicBanner.vue'
import JBLBoomboxImg from '../assets/images/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png'
import ExploreProducts from './ExploreProducts.vue'
import NewArrival from './NewArrival.vue'
import Services from './Services.vue'
</script>