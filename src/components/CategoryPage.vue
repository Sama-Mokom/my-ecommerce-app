<template>
  <div class="category-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-item">Home</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item current">{{ formattedCategoryName }}</span>
    </nav>

    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="section-title">
          <div class="red-bar"></div>
          <span class="section-label">Category</span>
        </div>
        <h1 class="page-title">{{ formattedCategoryName }} Products</h1>
        <p class="page-subtitle">
          Explore our {{ formattedCategoryName.toLowerCase() }} collection
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>

      <!-- No Products State -->
      <div v-else-if="products.length === 0" class="no-products">
        <div class="no-products-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h3>No products found</h3>
        <p>No products are currently available in this category</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-container">
        <div class="results-info">
          <p class="results-count">
            Showing {{ products.length }} products
          </p>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :showAddToCart="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import apiService from '../services/api.js';
import ProductCard from './ProductCard.vue';

const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Format category name for display
const formattedCategoryName = computed(() => {
  if (!route.params.categoryName) return '';
  return route.params.categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

// Function to fetch products based on the route parameter
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!route.params.categoryName) {
      throw new Error('Category not specified');
    }

    const data = await apiService.getProductsByCategory(route.params.categoryName);
    products.value = Array.isArray(data) ? data : (data.products || []);
    loading.value = false;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error.value = err.message || "Failed to load products. Please try again.";
    loading.value = false;
  }
};

// Fetch products initially and whenever the route parameter changes
watch(
  () => route.params.categoryName,
  (newCategory) => {
    if (newCategory) {
      fetchProducts();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  padding: 20px 0 40px 0;
  background: #fff;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin: 0 60px 30px 60px;
  font-size: 14px;
  padding: 20px 0;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #e74c3c;
}

.breadcrumb-item.current {
  color: #000;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
}

/* Page Header */
.page-header {
  text-align: left;
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.red-bar {
  width: 20px;
  height: 40px;
  background: #e74c3c;
  border-radius: 4px;
}

.section-label {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #000;
}

.page-subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Results Info */
.results-info {
  margin-bottom: 25px;
  padding: 0 5px;
}

.results-count {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

/* Loading, Error, No Products States */
.loading-state,
.error-state,
.no-products {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner,
.error-icon,
.no-products-icon {
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.loading-spinner i {
  color: #e74c3c;
}

.error-state p,
.no-products p {
  color: #666;
  font-size: 16px;
  margin: 10px 0;
}

.no-products h3 {
  color: #333;
  font-size: 24px;
  margin: 20px 0 10px 0;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  margin-top: 20px;
}

.retry-btn:hover {
  background: #c0392b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .breadcrumb {
    margin: 0 20px 20px 20px;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 28px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .breadcrumb {
    margin: 0 15px 15px 15px;
    font-size: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
  }
}
</style>