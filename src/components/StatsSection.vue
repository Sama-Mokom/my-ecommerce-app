<template>
  <div class="stats-section-container">
    <div class="container">
      <div class="stats-grid">
        <StatsCard 
        v-for="stat in stats"
        :key="stat.value"
        :icon="stat.icon"
        :value="stat.value"
        :description="stat.description"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatsCard from './StatsCard.vue';

const stats = [
  {icon:"src/assets/images/shop.png", value:"10.5K", description:"Sellers active on our site"},
  {icon:"src/assets/images/coin.png", value:"33K", description:"Monthly Product Sale"},
  {icon:"src/assets/images/bag.png", value:"45.5K", description:"Customers active on our site"},
  {icon:"src/assets/images/money-bag.png", value:"25K", description:"Annual gross sale on our site"}
]
</script>

<style scoped>
.stats-section-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 80px 0;
  background-color: #fff;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.stats-grid {
    padding: 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  justify-content: center;
}

.stat-card {
  width: 270px;
  height: 230px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.icon{
  width: 40px;
  height:40px;
}

.stat-card:hover {
  background-color: #db4444;
  color: #fff;
  border-color: #db4444;
}

.stat-card:hover img{
  filter: invert(1);
}

.stat-card.active .stat-icon-wrapper {
  background-color: #fff;
}

.stat-card.active .stat-icon-wrapper i {
  color: #000;
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.stat-icon-wrapper i {
  color: #fff;
  font-size: 32px;
  position: relative;
  z-index: 1;
}

.stat-icon-wrapper::before {
  content: '';
  position: absolute;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: #4d4d4d; /* Inner circle color */
  z-index: 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-description {
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.8;
}

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>