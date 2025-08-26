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
        <router-link v-for="cat in categories" :key="cat.label" :to="getCategoryRoute(cat)" class="category-link">
          <CategoryCard
            :icon="cat.icon"
            :label="cat.label"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import CategoryCard from "./CategoryCard.vue";

import Phones from "/src/assets/images/smartphone.png";
import Computers from "/src/assets/images/Monitor-logo.png";
import SmartWatch from "/src/assets/images/smartwatch.png";
import Camera from "/src/assets/images/camera.png";
import HeadPhones from "/src/assets/images/music.png";
import Gaming from "/src/assets/images/Gamepad-logo.png";

// const categories = [
//   { icon: Phones, label: "Phones", slug: "Phones" },
//   { icon: Computers, label: "Computers", slug: "Computers" },
//   { icon: SmartWatch, label: "SmartWatch", slug: "Smartwatch" },
//   { icon: Camera, label: "Camera", slug: "Camera" },
//   { icon: HeadPhones, label: "HeadPhones", slug: "Headphones" },
//   { icon: Gaming, label: "Gaming", slug: "Gaming" },
// ];

const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { icon: Phones, label: "Phones", slug: "Phones"  },
      { icon: Computers, label: "Computers", slug: "Computers" },
      { icon: SmartWatch, label: "SmartWatch", slug: "Smartwatch"},
      { icon: Camera, label: "Camera", slug: "Camera"  },
      { icon: HeadPhones, label: "HeadPhones", slug: "Headphones" },
      { icon: Gaming, label: "Gaming", slug: "Gaming" },
    ]
  }
})

const getCategoryRoute = (category) => {
  return {
    name: 'CategoryPage',
    params: { categoryName: category.slug || category.name }
  };
};
</script>

<style scoped>
.categories {
  margin-top: 40px;
  margin-bottom: 80px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 70px;
}

.section-header {
  margin-left: 70px;
  display: inline-block;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0px;
  /* padding-left: 42px; */
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}

.nav-arrows {
  margin-left: 660px;
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
  margin-left: 30px;
  margin-right: 20px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
  padding-left: 42px;
}

.category-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.category-link{
  color: black;
  text-decoration: none;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .categories {
    margin-top: 30px;
    margin-bottom: 60px;
    padding-bottom: 50px;
  }
  
  .section-header {
    margin-left: 40px;
  }
  
  .section-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .section-content h2 {
    font-size: 28px;
  }
  
  .nav-arrows {
    margin-left: 0;
  }
  
  .categories-grid {
    margin-left: 20px;
    margin-right: 20px;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding-left: 20px;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .categories {
    margin-top: 20px;
    margin-bottom: 40px;
    padding-bottom: 40px;
  }
  
  .section-header {
    margin-left: 20px;
  }
  
  .section-content h2 {
    font-size: 24px;
  }
  
  .nav-arrows {
    display: none; /* Hide arrows on mobile */
  }
  
  .categories-grid {
    margin-left: 15px;
    margin-right: 15px;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding-left: 15px;
  }
  
  .category-card {
    padding: 20px 15px;
    min-height: 100px;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .categories {
    margin-top: 15px;
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
  
  .section-header {
    margin-left: 15px;
  }
  
  .section-content h2 {
    font-size: 20px;
  }
  
  .categories-grid {
    margin-left: 10px;
    margin-right: 10px;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding-left: 10px;
  }
  
  .category-card {
    padding: 15px 10px;
    min-height: 80px;
  }
}

/* Very Small Mobile */
@media (max-width: 360px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .category-card {
    padding: 12px 8px;
    min-height: 70px;
  }
}

/* Red bar responsive */
@media (max-width: 768px) {
  .red-bar {
    width: 16px;
    height: 32px;
  }
  
  .section-label {
    font-size: 14px;
  }
}
@media (max-width: 480px) {
  .red-bar {
    width: 14px;
    height: 28px;
  }
  
  .section-label {
    font-size: 13px;
  }
}
</style>
