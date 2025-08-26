<template>
  <div class="product-card">
    <div class="product-image">
      <span v-if="product.discount" class="discount-badge">{{
        product.discount
      }}%</span>
      <span v-if="product.isNew" class="new-badge">NEW</span>
      <img :src="product.image" :alt="product.name" />
      <div class="product-actions">
        <button 
          class="action-btn" 
          @click="handleToggleWishlist"
          :class="{ 'in-wishlist': isInWishlist }"
        >
          <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>
        <button class="action-btn" @click="handleViewProduct"><i class="far fa-eye"></i></button>
      </div>
      <button v-if="showAddToCart" class="add-to-cart" @click="handleAddToCart()">Add To Cart</button>
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
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
            :class="i <= product.rating ? 'fas fa-star' : 'far fa-star'"
          ></i>
        </div>
        <span class="rating-count">({{ product.ratingCount }})</span>
      </div>
      <div
        v-if="product.colors.length > 0 && product.section === `explore`"
        class="color-options" 
      >
        <span v-for="(color, idx) in product.colors" :key="idx" :class="['color-dot', color, { active: idx === 0 }]"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../services/api.js';
import { authStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const props = defineProps({
  product: { type: Object, required: true },
  showAddToCart: { type: Boolean, default: true },
});

const router = useRouter();
const toast = useToast();
const isInWishlist = ref(false);

const checkWishlistStatus = async () => {
  if (!authStore.user) return;
  
  try {
    const response = await apiService.getWishlist();
    isInWishlist.value = response.wishlist.some(item => item.productId === props.product.id);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
  }
};

const handleToggleWishlist = async () => {
  if (!authStore.user) {
    // Redirect to login or show login modal
    toast.warning('Please login to add items to wishlist', {
      position: 'top-right',
      timeout: 3000,
    });
    return;
  }

  try {
    await apiService.toggleWishlist(props.product.id);
    const wasInWishlist = isInWishlist.value;
    isInWishlist.value = !isInWishlist.value;

    if (wasInWishlist) {
      toast.info(`${props.product.name} removed from wishlist`, {
        position: 'top-right',
        timeout: 3000,
        icon: '💔',
      });
    } else {
      toast.success(`${props.product.name} added to wishlist`, {
        position: 'top-right',
        timeout: 3000,
        icon: '❤️',
      });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    toast.error('Failed to update wishlist. Please try again.', {
      position: 'top-right',
      timeout: 4000,
    });
  }
};

const handleAddToCart = async () => {
  if (!authStore.user) {
    toast.warning('Please login to add items to cart', {
      position: 'top-right',
      timeout: 3000,
    });
    router.push('/signin');
    return;
  }

  try {
    await apiService.addToCart(props.product.id, 1);
    toast.success(`${props.product.name} added to cart successfully!`, {
      position: 'top-right',
      timeout: 3000,
      icon: '🛒',
    });
  } catch (error) {
    console.error('Error adding to cart: ', error)
    if (error.message.includes('already in your cart')) {
       toast.info(`${props.product.name} is already in your cart`, {
        position: 'top-right',
        timeout: 3000,
        icon: '📦',
      });
    } else {
      toast.error('Failed to add product to cart. Please try again.', {
        position: 'top-right',
        timeout: 4000,
      });
    }
    console.error('Error adding to cart:', error);
  }
};

const handleViewProduct = () => {
  router.push(`/product/${props.product.id}`);
};

onMounted(() => {
  checkWishlistStatus();
});
</script>

<style scoped>
.action-btn.in-wishlist {
  color: #ff4444;
}

.action-btn.in-wishlist i {
  color: #ff4444;
}

.action-btn:hover {
  color: #ff4444;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}
</style>
