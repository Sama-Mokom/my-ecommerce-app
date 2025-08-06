<template>
  <div class="about-us-container">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">Home</a> / <span>About</span>
      </div>
      <div class="about-content">
        <div class="story-section">
          <h1 class="story-title">Our Story</h1>
          <p class="story-text">
            Launched in 2015, Exclusive is South Asia's premier online shopping
            marketplace with an active presence in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive
            has 10,500 sellers and 300 brands and serves 3 millions customers
            across the region.
          </p>
          <p class="story-text">
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assortment in categories
            ranging from consumer.
          </p>
        </div>
        <div class="image-section">
          <img src="..\assets\images\portrait-two-african-females-holding-shopping-bags-while-reacting-something-their-smartphone 1.png" alt="Shopping illustration" class="about-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this static component
</script>

<style scoped>
.about-us-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 80px 0;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 80px;
  color: #a0a0a0;
}

.breadcrumb a {
  text-decoration: none;
  color: #000;
  margin-right: 8px;
}

.breadcrumb span {
  color: #a0a0a0;
}

.about-content {
  display: flex;
  gap: 70px;
  align-items: center;
}

.story-section {
  flex: 1;
  max-width: 500px;
}

.story-title {
  font-size: 48px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 40px;
}

.story-text {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.8;
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0b4c8; /* Approximate background color from image */
  padding: 20px;
  border-radius: 8px;
  min-height: 400px; /* Ensure a minimum height for the image section */
}

.about-image {
  max-width: 100%;
  max-height: 500px; /* Adjust as needed */
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 992px) {
  .about-content {
    flex-direction: column;
    text-align: center;
  }

  .story-section {
    max-width: 100%;
  }

  .story-title {
    font-size: 38px;
  }
}

@media (max-width: 768px) {
  .about-us-container {
    padding: 40px 0;
  }

  .breadcrumb {
    margin-bottom: 40px;
  }

  .story-title {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .story-text {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .image-section {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .story-title {
    font-size: 28px;
  }
}
</style>