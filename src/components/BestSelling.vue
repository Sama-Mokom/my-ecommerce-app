<template>
  <section class="best-selling">
    <div class="container">
      <div class="section-header">
        <div class="section-header-stack">
          <div class="section-title">
            <div class="red-bar"></div>
            <span class="section-label">Today's</span>
          </div>
          <div class="section-content">
            <h2>Best Selling Products</h2>
            <div class="view-all-container">
              <router-link to="/products"
                ><button class="view-all-btn">View All Products</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p>Error Loading products: {{ error }}</p>
        <button @click="fetchProducts()" class="view-all-btn">Retry</button>
      </div>
      <!-- Display products State -->
      <div v-else-if="products && products.length > 0" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
      <!-- No Products State -->
      <div v-else class="no-products">
        <p>No products available in Best Selling.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import apiService from "../services/api.js";
import { ref, onMounted } from "vue";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    //Get Best Selling Products

    const data = await apiService.getBestSellingProducts();
    products.value = data.products || [];

    // Debug: Log the first product to check image URL format
    if (data.products && data.products.length > 0) {
      console.log("First product image URL:", data.products[0].image);
      console.log("Full first product:", data.products[0]);
    }

    console.log("Best Selling Products successfully loaded: ", data.length);
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching Best Selling products: ", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.section-header {
  /* margin-left: 45px; */
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 60px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0px;
}
.section-content {
  height: 50px;
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 0px;
}

.products-grid {
  /* margin-left: 40px; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}
.product-card {
  min-width: 250px;
  position: relative;
  cursor: pointer;
}
.product-image {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 35px;
  position: relative;
  margin-bottom: 16px;
  text-align: center;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.add-to-cart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .add-to-cart {
  opacity: 1;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.current-price {
  color: #db4444;
  font-weight: 500;
}

.original-price {
  color: #000;
  opacity: 0.5;
  text-decoration: line-through;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #ffad33;
  font-size: 16px;
}

.stars .far {
  color: #ccc;
}

.rating-count {
  color: #000;
  opacity: 0.5;
  font-size: 14px;
}

.view-all-container {
  margin-left: 560px;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .section-header {
    margin-left: 30px;
    margin-bottom: 40px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .section-content {
    width: 100%;
    justify-content: space-between;
  }

  .section-content h2 {
    font-size: 28px;
  }

  .view-all-container {
    margin-left: 0;
    margin-top: 0;
  }

  .products-grid {
    display: flex;
    margin-left: 30px;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .product-card {
    min-width: 220px;
    flex: 0 1 calc(50% - 10px);
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .section-header {
    margin-left: 20px;
    margin-bottom: 30px;
  }

  .section-content {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    gap: 15px;
  }

  .section-content h2 {
    font-size: 24px;
    margin: 0;
  }

  .products-grid {
    display: flex;
    margin-left: 20px;
    margin-right: 20px;
    gap: 15px;
    justify-content: center;
  }

  .product-card {
    min-width: 200px;
    flex: 0 1 calc(50% - 7.5px);
    max-width: calc(50% - 7.5px);
  }

  .product-image {
    height: 200px;
    padding: 20px;
  }

  .product-info h3 {
    font-size: 14px;
  }

  .current-price {
    font-size: 14px;
  }

  .original-price {
    font-size: 13px;
  }

  .rating-count {
    font-size: 12px;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .section-header {
    margin-left: 15px;
    margin-bottom: 25px;
  }

  .section-content h2 {
    font-size: 20px;
  }

  .products-grid {
    display: flex;
    margin-left: 15px;
    margin-right: 15px;
    flex-direction: column;
    align-items: center;
  }

  .product-card {
    min-width: unset;
    width: 100%;
    max-width: 280px;
    flex: none;
  }

  .product-image {
    height: 180px;
    padding: 15px;
  }

  .product-info h3 {
    font-size: 13px;
  }

  .view-all-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

/* Error and No Products States */
.error-state,
.no-products {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

@media (max-width: 768px) {
  .error-state,
  .no-products {
    padding: 30px 15px;
  }

  .error-state p,
  .no-products p {
    font-size: 14px;
  }
}
</style>
