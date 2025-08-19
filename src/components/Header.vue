<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <h2>Exclusive</h2>
      </div>
      <nav class="nav">
        <router-link
          v-for="(link, i) in navLinks"
          :key="i"
          :to="link.to"
          class="nav-link"
          :class="{ active: link.active }"
          >{{ link.text }}
          </router-link>
      </nav>
      <div class="header-actions">
        <div class="search-box">
          <input type="text" placeholder="What are you looking for?" />
          <i class="fas fa-search"></i>
        </div>
        <div class="header-icons">
          <!-- <i class="far fa-user"></i> -->
          <router-link to="/wishlist" class="wishlist-link" v-if="isAuthenticated">
            <i class="far fa-heart heart-icon"></i>
            <span v-if="wishlistCount > 0" class="wishlist-count">{{ wishlistCount }}</span>
          </router-link>
          <i v-else class="far fa-heart heart-icon" @click="showLoginPrompt"></i>
          <router-link to="/cart" class="cart-link" v-if="isAuthenticated">
            <i class="fas fa-shopping-cart cart-icon"></i>
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>
          <i v-else class="fas fa-shopping-cart cart-icon" @click="showCartLoginPrompt"></i>
          <div
          v-if="isAuthenticated"
            class="user-dropdown-container"
            @click="toggleDropdown"
            ref="userDropdown"
          >
            <i
              class="far fa-user user-icon"
              :class="{ active: isDropdownOpen }"
            ></i>
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div class="dropdown-item" @click="handleMenuClick('account')">
                <i class="far fa-user"></i>
                <span>Manage My Account</span>
              </div>
              <div class="dropdown-item" @click="handleMenuClick('orders')">
                <i class="fas fa-shopping-bag"></i>
                <span>My Order</span>
              </div>
              <div
                class="dropdown-item"
                @click="handleMenuClick('cancellations')"
              >
                <i class="fas fa-times-circle"></i>
                <span>My Cancellations</span>
              </div>
              <div class="dropdown-item" @click="handleMenuClick('reviews')">
                <i class="far fa-star"></i>
                <span>My Reviews</span>
              </div>
              <div
                class="dropdown-item logout"
                @click="handleMenuClick('logout')"
              >
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authActions, authStore, isAuthenticated } from '../../stores/auth';
import apiService from '../services/api.js';

const router = useRouter();
const props = defineProps({

  searchIcon: { type: String, default: "/images/search icon.png" },
  cartIcon: { type: String, default: "/images/Cart1.png" },
});
 const navLinks = computed(() => {
  const baseLinks = [
    { text: "Home", to: "/" },
    { text: "Contact", to: "/contact" },
    { text: "About", to: "/about" },
  ];
  if (!isAuthenticated.value){
    baseLinks.push({text: "Sign Up", to: "/signup"});
  }
  return baseLinks;
 })


const isDropdownOpen = ref(false);
const userDropdown = ref(null);
const wishlistCount = ref(0);
const cartCount = ref(0); // Added cartCount state

const fetchWishlistCount = async () => {
  if (!isAuthenticated.value) return;
  
  try {
    const response = await apiService.getWishlist();
    wishlistCount.value = response.count || 0;
  } catch (error) {
    console.error('Error fetching wishlist count:', error);
  }
};

const fetchCartCount = async () => {
  if (!isAuthenticated.value) return;
  
  try {
    const response = await apiService.getCart();
    cartCount.value = response.count || 0;
  } catch (error) {
    console.error('Error fetching cart count:', error);
  }
};

const showLoginPrompt = () => {
  alert('Please login to view your wishlist');
  router.push('/signin');
};

const showCartLoginPrompt = () => {
  alert('Please login to view your cart');
  router.push('/signin');
};

const toggleDropdown = () =>{
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleMenuClick = async (action) => {
  console.log(`${action} clicked`)
  isDropdownOpen.value = false;

    // Handle different menu actions
  switch(action) {
    case 'account':
      // Navigate to account management
      router.push('/account');
      break;
    case 'orders':
      // Navigate to orders page
      router.push('/orders');
      break;
    case 'cancellations':
      // Navigate to cancellations page
      router.push('/cancellations');
      break;
    case 'reviews':
      // Navigate to reviews page
      router.push('/reviews')
      break;
    case 'logout':
      // Handle logout logic here, then redirect user to homepage
      try{
        await authActions.logout();
        console.log('User logged out successfully')
        alert('Logout Successful');
        router.push('/');
      } catch (error){
        console.error('Logout failed: ', error)
        alert('Logout failed. Please try again')
      }
      break;
  }
}

const handleClickOutside = (event) =>{
    if (userDropdown.value && !userDropdown.value.contains(event.target)){
      isDropdownOpen.value = false
    }
  }
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchWishlistCount(); // Fetch wishlist count on mount
  fetchCartCount(); // Fetch cart count on mount
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.logo {
  margin-left: 60px;
}
/* a:focus {
    outline: 2px solid #db4444;
    outline-offset: 2px;
} */

/* Header */
.header {
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h2 {
  font-size: 24px;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 30px;
  margin-left: 52px;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-weight: 400;
  position: relative;
}
.nav-link:hover {
  color: #db4444;
}

.nav-link.router-link-active::after,.nav-link.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #db4444;
}

.header-actions {
  margin-right: 40px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.search-box {
  position: relative;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 7px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  font-size: 12px;
  width: 200px;
}

 .search-box input:focus{
     outline: 2px solid transparent; 
     outline-offset: 2px;
} 

.search-box i {
  color: #000;
  cursor: pointer;
}



.header-icons i {
    position: relative;
    height: 36px;
    width: 33.5px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

 .header-icons {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-dropdown-container {
  position: relative;
  cursor: pointer;
}

.user-icon {
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 4px;
}

.user-icon:hover,.heart-icon:hover, .cart-icon:hover,
.user-icon.active {
  background-color: #f5f5f5;
  color: #db4444;
}


.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: transparent;
  /* background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%); */
  backdrop-filter: blur(40px);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  margin-top: 8px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  max-height: 45px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: gainsboro;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.dropdown-item i {
  width: 16px;
  text-align: center;
  font-size: 14px;
}

.dropdown-item span {
  font-size: 14px;
  font-weight: 400;
}

.dropdown-item.logout {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 4px;
}

.dropdown-item.logout:hover {
  background-color: rgba(219, 68, 68, 0.2);
  color: #ff6b6b;
}

.wishlist-link {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 33.5px;
}

.wishlist-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #db4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.cart-link {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 33.5px;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #db4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

@media (max-width: 768px) {
  .dropdown-menu {
    right: -20px;
    min-width: 180px;
  }
}
</style>
