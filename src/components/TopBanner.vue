<template>
  <div class="top-banner">
    <span class="banner-text">{{ bannerText }}</span>
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


/* Top Banner */
.top-banner {
  background: #000;
  color: #fff;
  padding: 12px 0;
  text-align: center;
  font-size: 14px;
  position: relative;
}

.banner-text{
  margin-left: 50px;
}

.shop-now-link {
  color: #fff;
  text-decoration: underline;
  margin-left: 8px;
}

.language-selector {
  margin-right: 75px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}


</style>