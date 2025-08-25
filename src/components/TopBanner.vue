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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.banner-text{
  margin-left: 50px;
  margin-right: 10px;
}

.shop-now-link {
  color: #fff;
  text-decoration: underline;
  margin-left: 8px;
  white-space: nowrap;
}

.language-selector {
  margin-right: 75px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  white-space: nowrap;
}
/* Tablet styles (max-width: 1024px) */
@media (max-width: 1024px) {
  .banner-text {
    margin-left: 30px;
    font-size: 13px;
  }
  
  .language-selector {
    margin-right: 40px;
    right: 15px;
  }
}
/* Medium tablet styles (max-width: 768px) */
@media (max-width: 768px) {
  .top-banner {
    padding: 10px 0;
    font-size: 13px;
    justify-content: flex-start;
    padding-left: 15px;
  }
  
  .banner-text {
    margin-left: 0;
    margin-right: 8px;
    max-width: calc(100% - 140px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
    .shop-now-link {
    font-size: 13px;
  }
  
  .language-selector {
    margin-right: 20px;
    right: 10px;
    font-size: 13px;
  }
}
/* Mobile styles (max-width: 480px) */
@media (max-width: 480px) {
  .top-banner {
    padding: 8px 0;
    font-size: 12px;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  .banner-text {
    max-width: calc(100% - 110px);
    font-size: 11px;
  }
  .shop-now-link {
    font-size: 11px;
    margin-left: 5px;
  }
  
  .language-selector {
    margin-right: 5px;
    right: 5px;
    font-size: 11px;
  }
   .language-selector span {
    display: flex;
    align-items: center;
  }
  
  .language-selector i {
    font-size: 10px;
    margin-left: 2px;
  }
}
/* Small mobile styles (max-width: 360px) */
@media (max-width: 360px) {
  .top-banner {
    flex-direction: column;
    padding: 6px 0;
    gap: 4px;
  }
  
  .banner-text {
    max-width: 90%;
    text-align: center;
    margin: 0 auto;
    order: 1;
  }
  .shop-now-link {
    order: 2;
    margin-left: 0;
  }
  
  .language-selector {
    position: static;
    transform: none;
    order: 3;
    margin: 4px auto 0;
  }
}
</style>