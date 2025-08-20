<template>
  <div class="product-details">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-item">Account</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link to="/" class="breadcrumb-item">Gaming</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item current">{{ product?.name || 'Product' }}</span>
    </nav>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product" class="product-container">
      <!-- Left side - Images -->
      <div class="product-images">
        <div class="thumbnail-images">
          <div 
            v-for="(image, index) in productImages" 
            :key="index"
            class="thumbnail"
            :class="{ active: selectedImageIndex === index }"
            @click="selectedImageIndex = index"
          >
            <img :src="image" :alt="`Product view ${index + 1}`" />
          </div>
        </div>
        <div class="main-image">
          <img :src="productImages[selectedImageIndex]" :alt="product.name" />
        </div>
      </div>

      <!-- Right side - Product Info -->
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        
        <!-- Rating -->
        <div class="rating">
          <div class="stars">
            <i
              v-for="i in 5"
              :key="i"
              :class="i <= product.rating ? 'fas fa-star' : 'far fa-star'"
            ></i>
          </div>
          <span class="rating-text">({{ product.ratingCount }} Reviews)</span>
          <span class="separator">|</span>
          <span class="stock-status">In Stock</span>
        </div>

        <!-- Price -->
        <div class="price">
          <span class="current-price">${{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">
            ${{ product.originalPrice }}
          </span>
        </div>

        <!-- Description -->
        <p class="description">
          PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
        </p>

        <!-- Colors -->
        <div class="product-options">
          <div class="option-group">
            <label>Colours:</label>
            <div class="color-options">
              <div 
                v-for="(color, index) in product.colors" 
                :key="index"
                class="color-option"
                :class="{ active: selectedColor === color }"
                @click="selectedColor = color"
              >
                <span :class="['color-dot', color]"></span>
              </div>
            </div>
          </div>

          <!-- Size -->
          <div class="option-group">
            <label>Size:</label>
            <div class="size-options">
              <button 
                v-for="size in sizes" 
                :key="size"
                class="size-option"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quantity and Actions -->
        <div class="actions">
          <div class="quantity-selector">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <span class="quantity">{{ quantity }}</span>
            <button @click="increaseQuantity">+</button>
          </div>
          <button class="btn-buy-now" @click="handleBuyNow">Buy Now</button>
          <button 
            class="btn-wishlist" 
            @click="handleToggleWishlist"
            :class="{ active: isInWishlist }"
          >
            <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info">
          <div class="delivery-option">
            <i class="fas fa-truck"></i>
            <div>
              <strong>Free Delivery</strong>
              <p>Enter your postal code for Delivery Availability</p>
            </div>
          </div>
          <div class="delivery-option">
            <i class="fas fa-redo-alt"></i>
            <div>
              <strong>Return Delivery</strong>
              <p>Free 30 Days Delivery Returns. Details</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Items -->
    <div v-if="relatedProducts.length > 0" class="related-items">
      <div class="section-header">
        <div class="section-indicator"></div>
        <h2>Related Item</h2>
      </div>
      <div class="related-products-grid">
        <ProductCard 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          :product="relatedProduct"
          :show-add-to-cart="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '../services/api.js';
import { authStore } from '../../stores/auth';
import ProductCard from './ProductCard.vue';

const route = useRoute();
const router = useRouter();

// Reactive data
const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const error = ref(null);
const isInWishlist = ref(false);
const selectedImageIndex = ref(0);
const selectedColor = ref('');
const selectedSize = ref('XS');
const quantity = ref(1);

// Static data for demo
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

// Computed properties
const productImages = computed(() => {
  if (!product.value) return [];
  // For now, we'll repeat the main image 4 times
  // In a real app, you'd have multiple product images
  return [
    product.value.image,
    product.value.image,
    product.value.image,
    product.value.image
  ];
});

// Methods
const fetchProduct = async () => {
  try {
    loading.value = true;
    const productId = route.params.id;
    
    // For now, we'll get all products and find the specific one
    // In a real app, you'd have a specific endpoint for single product
    const response = await apiService.getAllProducts();
    const foundProduct = response.find(p => p.id === productId);
    
    if (!foundProduct) {
      error.value = 'Product not found';
      return;
    }
    
    product.value = foundProduct;
    selectedColor.value = foundProduct.colors?.[0] || '';
    
    // Fetch related products (same category)
    await fetchRelatedProducts(foundProduct.category);
    
    // Check wishlist status
    await checkWishlistStatus();
    
  } catch (err) {
    error.value = 'Failed to load product';
    console.error('Error fetching product:', err);
  } finally {
    loading.value = false;
  }
};

const fetchRelatedProducts = async (category) => {
  try {
    const response = await apiService.getAllProducts();
    relatedProducts.value = response
      .filter(p => p.category === category && p.id !== product.value.id)
      .slice(0, 4); // Show only 4 related products
  } catch (err) {
    console.error('Error fetching related products:', err);
  }
};

const checkWishlistStatus = async () => {
  if (!authStore.user || !product.value) return;
  
  try {
    const response = await apiService.getWishlist();
    isInWishlist.value = response.wishlist.some(item => item.productId === product.value.id);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
  }
};

const handleToggleWishlist = async () => {
  if (!authStore.user) {
    alert('Please login to add items to wishlist');
    router.push('/signin');
    return;
  }

  try {
    await apiService.toggleWishlist(product.value.id);
    isInWishlist.value = !isInWishlist.value;
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    alert('Failed to update wishlist. Please try again.');
  }
};

const handleBuyNow = async () => {
  if (!authStore.user) {
    alert('Please login to purchase items');
    router.push('/signin');
    return;
  }

  try {
    await apiService.addToCart(product.value.id, quantity.value);
    router.push('/cart');
  } catch (error) {
    if (error.message.includes('already in your cart')) {
      router.push('/cart');
    } else {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  }
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Lifecycle
onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.product-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #db4444;
}

.breadcrumb-item.current {
  color: #000;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

/* Loading and Error States */
.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #db4444;
}

/* Product Container */
.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}

/* Product Images */
.product-images {
  display: flex;
  gap: 20px;
}

.thumbnail-images {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.thumbnail {
  width: 120px;
  height: 120px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail.active {
  border-color: #db4444;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-image {
  flex: 1;
  max-width: 400px;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  padding: 20px 0;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #000;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
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

.rating-text {
  color: #666;
  font-size: 14px;
}

.separator {
  color: #ccc;
}

.stock-status {
  color: #00ff66;
  font-size: 14px;
}

.price {
  margin-bottom: 20px;
}

.current-price {
  font-size: 24px;
  font-weight: 600;
  color: #000;
}

.original-price {
  font-size: 18px;
  color: #666;
  text-decoration: line-through;
  margin-left: 10px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

/* Product Options */
.product-options {
  margin-bottom: 30px;
}

.option-group {
  margin-bottom: 20px;
}

.option-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 10px;
  color: #000;
}

.color-options {
  display: flex;
  gap: 10px;
}

.color-option {
  cursor: pointer;
  padding: 5px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s;
}

.color-option.active {
  border-color: #000;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  border: 1px solid #ddd;
}

.color-dot.red {
  background-color: #db4444;
}

.color-dot.blue {
  background-color: #4169e1;
}

.color-dot.black {
  background-color: #000;
}

.color-dot.white {
  background-color: #fff;
}

.color-dot.green {
  background-color: #00ff66;
}

.size-options {
  display: flex;
  gap: 10px;
}

.size-option {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  min-width: 40px;
}

.size-option.active {
  background: #db4444;
  color: white;
  border-color: #db4444;
}

.size-option:hover {
  border-color: #db4444;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background-color 0.3s;
}

.quantity-selector button:hover {
  background: #f5f5f5;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  padding: 0 20px;
  font-weight: 500;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  height: 40px;
  display: flex;
  align-items: center;
  min-width: 60px;
  justify-content: center;
}

.btn-buy-now {
  background: #db4444;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-buy-now:hover {
  background: #c73e3e;
}

.btn-wishlist {
  width: 45px;
  height: 45px;
  border: 1px solid #ccc;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-wishlist:hover,
.btn-wishlist.active {
  background: #db4444;
  color: white;
  border-color: #db4444;
}

/* Delivery Info */
.delivery-info {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.delivery-option:last-child {
  border-bottom: none;
}

.delivery-option i {
  font-size: 24px;
  color: #666;
}

.delivery-option strong {
  display: block;
  margin-bottom: 5px;
  color: #000;
}

.delivery-option p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Related Items */
.related-items {
  margin-top: 60px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.section-indicator {
  width: 20px;
  height: 40px;
  background: #db4444;
  border-radius: 4px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .product-images {
    flex-direction: column;
  }
  
  .thumbnail-images {
    flex-direction: row;
    justify-content: center;
    order: 2;
  }
  
  .main-image {
    order: 1;
    max-width: 100%;
  }
  
  .breadcrumb {
    flex-wrap: wrap;
  }
  
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quantity-selector {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 10px;
  }
  
  .thumbnail {
    width: 80px;
    height: 80px;
  }
  
  .related-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>