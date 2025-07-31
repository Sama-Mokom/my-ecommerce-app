<template>
  <div class="top-banner">
    <span>{{ bannerText }}</span>
    <a :href="shopLink" class="shop-now-link">ShopNow</a>
    <div class="language-selector">
      <span>English <i class="fas fa-chevron-down"></i></span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bannerText: { type: String, default: 'Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!' },
  shopLink: { type: String, default: '#' }
})
</script> 

<style scoped>

</style>