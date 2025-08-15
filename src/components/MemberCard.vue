<template>
    <div class="team-member-card">
        <div class="member-image-wrapper">
            <img :src="image" class="member-image">
        </div>
        <h3 class="member-name">{{ name }}</h3>
        <p class="member-title">{{ title }}</p>
        <div class="social-icons">
            <a :href="twitterLink" class="social-link">
                <i class="fab fa-twitter"></i>
            </a>
            <a :href="instaLink" class="social-link">
                <i class="fab fa-instagram"></i>
            </a>
            <a :href="linkedLink" class="social-link">
                <i class="fab fa-linkedin-in"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  image: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  twitterLink: { type: String, required: true },
  instaLink: { type: String, required: true },
  linkedLink: { type: String, required: true },
});
</script>

<style scoped>
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
  margin-top: 40px;
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
</style>