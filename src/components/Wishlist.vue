<template>
  <div class="wishlist-container">
    <!-- Wishlist Section -->
    <div class="wishlist-section">
      <div class="section-header">
        <h2 class="section-title">Wishlist ({{ wishlistItems.length }})</h2>
        <button
          v-if="wishlistItems.length > 0"
          class="action-button"
          @click="moveAllToBag"
        >
          Move All To Bag
        </button>
      </div>

      <div class="wishlist-grid">
        <div v-for="item in wishlistItems" :key="item.id" class="wishlist-card">
          <div class="product-image">
            <span v-if="item.discount" class="discount-badge">{{
              item.discount
            }}</span>
            <button
              class="delete-btn"
              @click="handleRemoveFromWishlist(item.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
            <img :src="item.image" :alt="item.name" />
            <button class="add-to-cart-btn" @click="handleAddToCart(item)">
              <i class="fas fa-shopping-cart"></i>
              Add To Cart
            </button>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ item.name }}</h3>
            <div class="price">
              <span class="current-price">${{ item.price }}</span>
              <span v-if="item.originalPrice" class="original-price"
                >${{ item.originalPrice }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <i class="far fa-heart empty-icon"></i>
        <h3>Your wishlist is empty</h3>
        <p>Start adding products you love to your wishlist!</p>
      </div>
    </div>

    <!-- Just For You Section -->
    <div class="just-for-you-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="red-bar"></span>
          Just For You
        </h2>
        <button class="action-button" @click="seeAllProducts">See All</button>
      </div>

      <div class="products-grid">
        <div
          v-for="product in recommendedProducts"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <span v-if="product.discount" class="discount-badge">{{
              product.discount
            }}</span>
            <span v-if="product.isNew" class="new-badge">NEW</span>
            <button class="view-btn">
              <i class="far fa-eye"></i>
            </button>
            <img :src="product.image" :alt="product.name" />
            <button class="add-to-cart-btn" @click="handleAddToCart(product)">
              <i class="fas fa-shopping-cart"></i>
              Add To Cart
            </button>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="price">
              <span class="current-price">${{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price"
                >${{ product.originalPrice }}</span
              >
            </div>
            <div class="rating">
              <div class="stars">
                <i
                  v-for="i in 5"
                  :key="i"
                  :class="
                    i <= (product.rating || 5) ? 'fas fa-star' : 'far fa-star'
                  "
                ></i>
              </div>
              <span class="rating-count"
                >({{ product.ratingCount || 65 }})</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiService from "../services/api.js";
import { authStore } from "../../stores/auth";
import { useRouter } from 'vue-router';
// import {fetchWishlistCount} from './Header.vue'

const wishlistItems = ref([]);
const recommendedProducts = ref([]);
const isLoading = ref(false);
const router = useRouter();


const fetchWishlist = async () => {
  if (!authStore.user) return;

  try {
    isLoading.value = true;
    const response = await apiService.getWishlist();
    wishlistItems.value = response.wishlist;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchRecommendedProducts = async () => {
  try {
    const products = await apiService.getAllProducts();
    // Get 4 random products for recommendations
    const shuffled = products.sort(() => 0.5 - Math.random());
    recommendedProducts.value = shuffled.slice(0, 4);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
  }
};

const handleRemoveFromWishlist = async (productId) => {
  try {
    await apiService.removeFromWishlist(productId);
    // Remove from local state
    wishlistItems.value = wishlistItems.value.filter(
      (item) => item.productId !== productId
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
};

const handleAddToCart = async (product) => {
  if (!authStore.user) {
    alert('Please login to add items to cart');
    router.push('/signin');
    return;
  }
  if (!product || !product.id) {
    console.error('Product data is missing or invalid');
    alert('Unable to add product to cart. Product data is missing.');
    return;
  }

  try {
    await apiService.addToCart(product.id, 1);
    alert('Product added to cart successfully!');
  } catch (error) {
    if (error.message.includes('already in your cart')) {
      alert('This product is already in your cart');
    } else {
      alert('Failed to add product to cart. Please try again.');
    }
    console.error('Error adding to cart:', error);
  }
};

const moveAllToBag = () => {
  // TODO: Implement move all to bag functionality
  alert("Move all to bag functionality will be implemented later");
};

const seeAllProducts = () => {
  // TODO: Navigate to products page
  alert("See all products functionality will be implemented later");
};

onMounted(() => {
  fetchWishlist();
  fetchRecommendedProducts();
  // fetchWishlistCount();
});
</script>

<style scoped>
.wishlist-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.red-bar {
  width: 4px;
  height: 20px;
  background-color: #ff4444;
  border-radius: 2px;
}

.action-button {
  background: white;
  border: 1px solid #333;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #333;
  color: white;
}

.wishlist-grid,
.products-grid {
  /* display: flex;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 1.5rem;
  margin-bottom: 2.5rem;
}

.wishlist-card,
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wishlist-card:hover,
.product-card:hover {
  transform: translateY(-6px);
  /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); */
}
.wishlist-card:hover .add-to-cart-btn {
  opacity: 100%;
}

.product-card:hover .add-to-cart-btn {
  opacity: 100%;
}

.product-image {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 35px;
  position: relative;
  margin-bottom: 16px;
  text-align: center;
  height: 250px;
  display: inline;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  max-height: 180px;
  max-width: 190px;
  /* object-fit: cover; */
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 50px;
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.new-badge {
  position: absolute;
  top: 10px;
  left: 50px;
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.delete-btn,
.view-btn {
  position: absolute;
  top: 10px;
  right: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-btn:hover,
.view-btn:hover {
  background: white;
}

.product-info {
  /* display:flex; */
  /* justify-content: flex-start; */
  padding: 1rem;
  width: 100%;
  text-align: left;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  text-align: left;
}

.price {
  margin-bottom: 0.75rem;
  text-align: left;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-right: 0.5rem;
}

.original-price {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.rating {
  justify-content: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #fbbf24;
}

.rating-count {
  font-size: 0.8rem;
  color: #666;
}

.add-to-cart-btn {
  width: 264px;
  background: #333;
  color: white;
  border: none;
  padding: 10px;
  /* border-radius: 4px; */
  cursor: pointer;
  font-weight: 600;
  opacity: 0;
  align-items: center;
  transition: opacity 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #555;
}

.empty-wishlist {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-wishlist h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-wishlist p {
  color: #999;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .wishlist-container {
    padding: 1rem;
  }

  .wishlist-grid,
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
