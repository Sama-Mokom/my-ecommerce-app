<template>
  <div class="stats-section-container">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <i class="fas fa-store"></i>
          </div>
          <h3 class="stat-value">10.5k</h3>
          <p class="stat-description">Sellers active our site</p>
        </div>
        <div class="stat-card active">
          <div class="stat-icon-wrapper">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <h3 class="stat-value">33k</h3>
          <p class="stat-description">Monthly Product Sale</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <h3 class="stat-value">45.5k</h3>
          <p class="stat-description">Customer active in our site</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <h3 class="stat-value">25k</h3>
          <p class="stat-description">Annual gross sale in our site</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this static component
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

.stat-card:hover {
  background-color: #db4444;
  color: #fff;
  border-color: #db4444;
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