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
  padding: 60px 0;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 0 20px;
}

.breadcrumb {
  margin-bottom: 60px;
  color: #9F9F9F;
  font-size: 16px;
}

.breadcrumb a {
  text-decoration: none;
  color: #000;
  margin-right: 8px;
}

.breadcrumb span {
  color: #000;
}

.about-content {
  display: flex;
  /* gap: 30px; */
  align-items: center;
}

.story-section {
  flex: 1;
  max-width: 500px;
  text-align: left;
  padding-right: 30px;
}

.story-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 30px;
}

.story-text {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  /* opacity: 0.8; */
  color: #9F9F9F;
}

.image-section {
  position: relative;
  margin-right: -40px;
  width: 50%;
  /* flex: 1;
  display: flex;
  justify-content: center;
  align-items: center; */
  /* background-color: #e107b2; Approximate background color from image */
  /* padding: 20px; */
  /* border-radius: 8px; */
  /* min-height: 400px; Ensure a minimum height for the image section */
}

.about-image {
  width: 100%;
  height: auto; 
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  display:block;
  margin-right: -40px;
}

@media (max-width: 992px) {

  .container {
    padding: 0 20px;
  }

  .about-content {
    flex-direction: column;
  }

  .story-section {
    max-width: 100%;
    text-align: center;
     padding-right: 0;
    margin-bottom: 40px;
  }

  .story-title {
    font-size: 36px;
  }

  .image-section {
    width: 100%;
    margin-right: -20px;
  }
}

@media (max-width: 768px) {
  .about-us-container {
    padding: 40px 0;
  }

   .container {
    padding: 0 20px;
  }

  .breadcrumb {
    margin-bottom: 40px;
    font-size: 14px;
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
    padding: 20px;
  }
}

@media (max-width: 480px) {
   .story-title {
    font-size: 28px;
  }
  
  .breadcrumb {
    margin-bottom: 30px;
  }

  .image-section {
    margin-right: -15px;
  }
}
</style>