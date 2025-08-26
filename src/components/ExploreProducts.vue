<template>
  <section class="explore-products">
    <div class="container">
      <div class="section-header">
        <div class="section-title">
          <div class="red-bar"></div>
          <span class="section-label">Our Products</span>
        </div>
        <div class="section-content">
          <h2>Explore Our Products</h2>
          <div class="nav-arrows">
            <button class="nav-arrow"><i class="fas fa-arrow-left"></i></button>
            <button class="nav-arrow">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p>Error Loading products: {{ error }}</p>
        <button @click="fetchProducts()" class="view-all-btn">Retry</button>
      </div>
      <!-- Display products State -->
      <div
        v-else-if="products && products.length > 0"
        class="products-grid large-grid"
      >
        <ProductCard
          v-for="product in limitedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <!-- No Products State -->
      <div v-else class="no-products">
        <p>No products available in Explore.</p>
      </div>
      <div class="view-all-container">
        <router-link to="/products"
          ><button class="view-all-btn">All Products</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import apiService from "../services/api.js";
import { ref, onMounted, computed } from "vue";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Computed property to make sure just 8 products are displayed at a time in the home page
const limitedProducts = computed(() => {
  return products.value.slice(0, 8);
});

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    //Get Explore Products

    const data = await apiService.getExploreProducts();

    //Limit to a maximum of 8 products
    products.value = (data.products || []).slice(0, 8);

    // Debug: Log the first product to check image URL format
    if (data.products && data.products.length > 0) {
      console.log("First product image URL:", data.products[0].image);
      console.log("Full first product:", data.products[0]);
    }

    console.log("Explore Products successfully loaded: ", data.length);
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching Explore products: ", err);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* .explore-products {
  margin: 70px 0;
} */
.explore-products {
  margin-right: 50px;
  margin-left: 60px;
  margin-bottom: 2rem;
  margin-top: 2rem;
  background: #fff;
  border-radius: 10px;
  /* margin: 2rem 0; */
  padding: 2rem 0 3rem 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
.section-header {
  display: inline;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
.section-content h2 {
  padding-right: 500px;
  font-size: 36px;
  font-weight: 600;
  margin: 0;
}
.nav-arrows {
  margin-left: 151px;
  display: flex;
  gap: 0.5rem;
}
.nav-arrow {
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-arrow:hover {
  background: #e74c3c;
  color: #fff;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 1.5rem;
  margin-bottom: 2.5rem;
}
.product-card {
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: box-shadow 0.2s;
}
/* .product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
} */

.product-image {
  background: #fafafa;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.product-image img {
  max-width: 120px;
  max-height: 110px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}
.product-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.action-btn {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.action-btn:hover {
  background: #e74c3c;
  color: #fff;
  border: 1px solid #e74c3c;
}
.add-to-cart {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-to-cart:hover {
  background: #e74c3c;
}
.new-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #00ff6a;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 12px;
  z-index: 2;
}
.product-info {
  width: 100%;
  text-align: left;
}
.product-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0 0.3rem 0;
}
.price {
  margin-bottom: 0.3rem;
}
.current-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.1rem;
}
.rating {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 0.4rem;
}
.stars {
  color: #ffc107;
  font-size: 1rem;
}
.rating-count {
  color: #888;
  font-size: 0.95rem;
}
.color-options {
  display: flex;
  justify-content: left;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.color-dot.red {
  background: #e74c3c;
}
.color-dot.blue {
  background: #3498db;
}
.color-dot.yellow {
  background: #f9e79f;
  border: 2px solid #f1c40f;
}
.color-dot.black {
  background: #222;
}
.color-dot.green {
  background: #00ff6a;
}
.color-dot.active {
  border: 2px solid #222;
}
.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.view-all-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.view-all-btn:hover {
  background: #c0392b;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .explore-products {
    margin-right: 30px;
    margin-left: 30px;
    padding: 1.5rem 0 2.5rem 0;
  }
  
  .container {
    padding: 0 1.5rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-content h2 {
    padding-right: 0;
    font-size: 28px;
  }
  
  .nav-arrows {
    margin-left: 0;
  }
  
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem 1rem;
  }
  
  .product-image img {
    max-width: 100px;
    max-height: 90px;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .explore-products {
    margin-right: 20px;
    margin-left: 20px;
    padding: 1.5rem 0 2rem 0;
    border-radius: 8px;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .section-content h2 {
    font-size: 24px;
  }
  
  .nav-arrows {
    display: none;
  }
  
  .red-bar {
    width: 16px;
    height: 32px;
  }
  
  .section-label {
    font-size: 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 0.8rem;
    margin-bottom: 2rem;
  }
  
  .product-card {
    padding: 1rem 0.8rem 1.2rem 0.8rem;
  }
  
  .product-image img {
    max-width: 90px;
    max-height: 80px;
  }
  
  .product-info h3 {
    font-size: 0.95rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .rating-count {
    font-size: 0.85rem;
  }
  
  .action-btn {
    width: 24px;
    height: 24px;
    font-size: 0.85rem;
  }
  
  .add-to-cart {
    font-size: 0.9rem;
    padding: 0.4rem 0;
  }
  
  .view-all-btn {
    padding: 0.7rem 2rem;
    font-size: 1rem;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .explore-products {
    margin-right: 15px;
    margin-left: 15px;
    padding: 1.2rem 0 1.8rem 0;
  }
  
  .container {
    padding: 0 0.8rem;
  }
  
  .section-content h2 {
    font-size: 20px;
  }
  
  .red-bar {
    width: 14px;
    height: 28px;
  }
  
  .section-label {
    font-size: 0.9rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    justify-items: center;
  }
  
  .product-card {
    width: 100%;
    max-width: 280px;
    padding: 1rem 0.8rem 1.2rem 0.8rem;
  }
  
  .product-image img {
    max-width: 100px;
    max-height: 90px;
  }
  
  .product-info h3 {
    font-size: 0.9rem;
  }
  
  .current-price {
    font-size: 0.95rem;
  }
  
  .view-all-btn {
    padding: 0.6rem 1.8rem;
    font-size: 0.95rem;
  }
}
/* Error and Loading States */
@media (max-width: 768px) {
  .error-state,
  .no-products {
    padding: 1.5rem;
  }
  
  .error-state p,
  .no-products p {
    font-size: 14px;
  }
}
@media (max-width: 480px) {
  .error-state,
  .no-products {
    padding: 1rem;
  }
  
  .error-state p,
  .no-products p {
    font-size: 13px;
  }
}
</style>
