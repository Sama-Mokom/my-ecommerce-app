<template>
  <section class="categories">
    <div class="container">
      <div class="section-header">
        <div class="section-title">
          <div class="red-bar"></div>
          <span class="section-label">Categories</span>
        </div>
        <div class="section-content">
          <h2>Browse By Category</h2>
          <div class="nav-arrows">
            <button class="nav-arrow"><i class="fas fa-arrow-left"></i></button>
            <button class="nav-arrow">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="categories-grid">
        <CategoryCard
          v-for="cat in categories"
          :key="cat.label"
          :icon="cat.icon"
          :label="cat.label"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import CategoryCard from "./CategoryCard.vue";

const categories = [
  { icon: "/src/assets/images/smartphone.png", label: "Phones" },
  { icon: "/src/assets/images/Monitor-logo.png", label: "Computers" },
  { icon: "/src/assets/images/smartwatch.png", label: "SmartWatch" },
  { icon: "/src/assets/images/camera.png", label: "Camera" },
  { icon: "/src/assets/images/music.png", label: "HeadPhones" },
  { icon: "/src/assets/images/Gamepad-logo.png", label: "Gaming" },
];
</script>

<style scoped>
.section-header {
  display: inline-block;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0px;
  padding-left: 42px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}

.nav-arrows {
  margin-left: 690px;
  display: flex;
  gap: 8px;
}

.section-content {
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 55px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  padding-left: 42px;
}
</style>
