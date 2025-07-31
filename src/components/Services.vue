<template>
  <div class="service-features">
    <div class="feature-item">
      <div class="icon-container">
        <img src="\src\assets\images\delivery-truck.png">
      </div>
      <h3 class="feature-title">FREE AND FAST DELIVERY</h3>
      <p class="feature-description">Free delivery for all orders over $140</p>
    </div>

    <div class="feature-item">
      <div class="icon-container">
        <img src="\src\assets\images\headphones.png">
      </div>
      <h3 class="feature-title">24/7 CUSTOMER SERVICE</h3>
      <p class="feature-description">Friendly 24/7 customer support</p>
    </div>

    <div class="feature-item">
      <div class="icon-container">
        <img src="\src\assets\images\protection.png">
      </div>
      <h3 class="feature-title">MONEY BACK GUARANTEE</h3>
      <p class="feature-description">We return money within 30 days</p>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.service-features {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  background-color: white;
}

.feature-item {
  text-align: center;
  flex: 1;
  max-width: 300px;
  margin: 0 20px;
}

.icon-container {
  width: 80px;
  height: 80px;
  background-color: #2c2c2c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);
}
.icon-container img{
  max-width: 40px;
  max-height: 40px;
  filter: invert(1);
}

.icon {
  width: 32px;
  height: 32px;
  color: white;
}

.feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
}

.feature-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .service-features {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-item {
    margin: 0 0 40px 0;
  }
  
  .feature-item:last-child {
    margin-bottom: 0;
  }
}
</style>