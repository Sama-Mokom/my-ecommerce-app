<template>
  <div class="team-members-container">
    <div class="container">
      <div class="team-grid">
        <div class="team-member-card">
          <div class="member-image-wrapper">
            <img src="http://googleusercontent.com/file_content/1" alt="Tom Cruise" class="member-image" />
          </div>
          <h3 class="member-name">Tom Cruise</h3>
          <p class="member-title">Founder & Chairman</p>
          <div class="social-icons">
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div class="team-member-card">
          <div class="member-image-wrapper">
            <img src="http://googleusercontent.com/file_content/2" alt="Emma Watson" class="member-image" />
          </div>
          <h3 class="member-name">Emma Watson</h3>
          <p class="member-title">Managing Director</p>
          <div class="social-icons">
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div class="team-member-card">
          <div class="member-image-wrapper">
            <img src="https://placehold.co/300x300/f5f5f5/a0a0a0?text=Will+Smith" alt="Will Smith" class="member-image" />
          </div>
          <h3 class="member-name">Will Smith</h3>
          <p class="member-title">Product Designer</p>
          <div class="social-icons">
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this static component
</script>

<style scoped>
.team-members-container {
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
}

.team-member-card {
  background-color: #fff;
  border-radius: 4px;
  text-align: left;
}

.member-image-wrapper {
  background-color: #f5f5f5; /* Light gray background for image area */
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 24px;
  height: 300px; /* Fixed height for image wrapper */
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.member-name {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 8px;
}

.member-title {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 16px;
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #000;
  font-size: 20px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #db4444;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #db4444;
}

@media (max-width: 992px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .team-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .member-name {
    font-size: 28px;
  }
}
</style>