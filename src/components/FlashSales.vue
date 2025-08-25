<template>
  <section class="flash-sales">
    <div class="container">
      <div class="section-header">
        <div class="section-header-stack">
          <div class="section-title">
            <div class="red-bar"></div>
            <span class="section-label">Today's</span>
          </div>
          <div class="section-content">
            <h2>Flash Sales</h2>
            <div class="countdown">
              <div class="time-unit">
                <span class="label">Days</span>
                <span class="value">{{ timeLeft.days }}</span>
              </div>
              <span class="separator">:</span>
              <div class="time-unit">
                <span class="label">Hours</span>
                <span class="value">{{ timeLeft.hours }}</span>
              </div>
              <span class="separator">:</span>
              <div class="time-unit">
                <span class="label">Minutes</span>
                <span class="value">{{ timeLeft.minutes }}</span>
              </div>
              <span class="separator">:</span>
              <div class="time-unit">
                <span class="label">Seconds</span>
                <span class="value">{{ timeLeft.seconds }}</span>
              </div>
            </div>
            <div class="nav-arrows">
              <button
                class="nav-arrow"
                @click="goToPrevious"
                :disabled="!canGoPrevious"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <button
                class="nav-arrow"
                @click="goToNext"
                :disabled="!canGoNext"
              >
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading Flash Sales Products</p>
        <!-- <button @click="fetchProducts" class="retry-btn">Retry</button> -->
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>Error Loading products: {{ error }}</p>
        <button @click="fetchProducts()" class="view-all-btn">Retry</button>
      </div>
      <!-- Products Display  -->
      <div class="products-grid" v-else-if="products && products.length > 0">
        <splide
          :options="splideOptions"
          ref="splideRef"
          @splide:moved="handleSlideChange"
          @splide:ready="handleSplideReady"
          aria-label="Flash Sale Products"
        >
          <SplideSlide v-for="product in products" :key="product.id">
            <ProductCard :product="product" />
          </SplideSlide>
        </splide>
      </div>

      <!-- No Products State -->
      <div v-else class="no-products">
        <p>No products available for flash sale.</p>
      </div>
      <div class="view-all-container">
        <router-link to="/products"
          ><button class="view-all-btn">All Products</button>
        </router-link>
      </div>
      <hr style="border-color: black" />
    </div>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import apiService from "../services/api.js";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    //Get Flash Sales Products (products with a discount)

    const data = await apiService.getFlashSaleProducts();
    products.value = data.products || [];

    // Debug: Log the first product to check image URL format
    if (data.products && data.products.length > 0) {
      console.log("First product image URL:", data.products[0].image);
      console.log("Full first product:", data.products[0]);
    }

    console.log("Flash Sales Products successfully loaded: ", data.length);
  } catch (err) {
    error.value = err.message;
    console.error("Error fetching flash sale products: ", err);
  } finally {
    loading.value = false;
  }
};
//Splide config
const splideOptions = computed(() => ({
  type: "slide",
  perPage: 4,
  perMove: 1,
  gap: "1rem",
  arrows: false,
  pagination: false,
  autoplay: false,
  drag: true,
  keyboard: true,
  wheel: false,
  focus: false,
  trimSpace: true,
  // clones: 0,
  breakpoints: {
    1024: {
      perPage: 4,
      gap: "0.8rem",
    },
    768: {
      perPage: 2,
      gap: "0.5rem",
    },
    480: {
      perPage: 1,
      gap: "0.3rem",
    },
  },
}));
// variables for reactivity
const splideRef = ref(null);
const currentIndex = ref(0);
const currentPerPage = ref(4);
const totalSlides = computed(() => products.value?.length || 0);

// Navigation state
const canGoPrevious = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => {
  if (!products.value || products.value.length === 0) return false;
  // const perPage = getPerPage()
  return currentIndex.value < totalSlides.value - currentPerPage.value;
});

// Update current perPage when slide is ready or moved
const handleSplideReady = (splide) => {
  currentPerPage.value = splide.options.perPage;
  updateNavigationState(splide);
};

const handleSlideChange = (splide, newIndex) => {
  currentIndex.value = newIndex;
  currentPerPage.value = splide.options.perPage;
  updateNavigationState(splide);
};

const updateNavigationState = (splide) => {
  // Get actual perPage from splide instance for accurate navigation
  const actualPerPage = splide.options.perPage;
  currentPerPage.value = actualPerPage;
};

// Helper function to get current perPage based on screen size
// const getPerPage = () => {
//   if (window.innerWidth <= 480) return 1
//   if (window.innerWidth <= 768) return 2
//   if (window.innerWidth <= 1024) return 3
//   return 4
// }

// Fxns for navigation

const goToPrevious = () => {
  if (splideRef.value?.splide && canGoPrevious.value) {
    splideRef.value.splide.go("<");
  }
};

const goToNext = () => {
  if (splideRef.value?.splide && canGoNext.value) {
    splideRef.value.splide.go(">");
  }
};

// const handleSlideChange = (splide, newIndex) => {
//   currentIndex.value = newIndex
// }

// Countdown timer functionality
const timeLeft = ref({
  days: "03",
  hours: "23",
  minutes: "19",
  seconds: "56",
});

let countdownInterval = null;

const startCountdown = () => {
  // Set target date (3 days, 23 hours, 19 minutes, 56 seconds from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(targetDate.getHours() + 23);
  targetDate.setMinutes(targetDate.getMinutes() + 19);
  targetDate.setSeconds(targetDate.getSeconds() + 56);

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      timeLeft.value = {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timeLeft.value = {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  }, 1000);
};
onMounted(() => {
  //Start the timer countdown and render flashsale products when page is loaded
  startCountdown();
  fetchProducts();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>
<style scoped>
.flash-sales {
  margin-bottom: 100px;
  margin-top: 130px;
}

.container {
  margin-right: 50px;
  margin-left: 90px;
  max-width: 1200px;
  /* margin: 90px; */
  padding: 0 20px;
}
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0px;
}

.section-content h2 {
  font-size: 36px;
  font-weight: 600;
  margin-right: 87px;
  white-space: nowrap;
}

.section-content {
  /* margin-top: 0px; */
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 24px;
}

.countdown {
  display: flex;
  align-items: flex-end;
  gap: 17px;
  margin-left: 8px;
  margin-right: 390px;
}


.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-unit .label {
  font-size: 12px;
  font-weight: 500;
  color: #000;
  margin-bottom: 4px;
}

.time-unit .value {
  font-size: 32px;
  font-weight: 600;
  color: #000;
}

.separator {
  font-size: 32px;
  font-weight: 600;
  color: #e74c3c;
  margin: 0 5px;
  align-self: flex-end;
  padding-bottom: 6px;
}

.nav-arrows {
  display: flex;
  gap: 8px;
}

.nav-arrow {
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-arrow:hover:not(:disabled) {
  background: #e74c3c;
  color: #fff;
}

.nav-arrow:disabled {
  background: #eee;
  color: #ccc;
  cursor: not-allowed;
}

.view-all-container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.view-all-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.view-all-btn:hover {
  background: #c0392b;
}

.loading-state,
.error-state,
.no-products {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

/* Tablet Styles */
@media (max-width: 1024px) {
  .flash-sales {
    margin-top: 80px;
    margin-bottom: 60px;
  }
  
  .container {
    margin-right: 30px;
    margin-left: 50px;
    padding: 0 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .section-content {
    width: 100%;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .section-content h2 {
    font-size: 28px;
    margin-right: 20px;
    white-space: normal;
  }
  
  .countdown {
    margin-left: 0;
    margin-right: 0;
    gap: 12px;
  }
  
  .time-unit .value {
    font-size: 24px;
  }
  
  .separator {
    font-size: 24px;
    padding-bottom: 4px;
  }
  
  .nav-arrows {
    margin-left: auto;
  }
}

/* Mobile Styles */
@media (max-width: 768px) {
  .flash-sales {
    margin-top: 60px;
    margin-bottom: 40px;
  }
  
  .container {
    margin-right: 20px;
    margin-left: 20px;
    padding: 0 10px;
  }
  
  .section-header {
    margin-bottom: 20px;
  }
  
  .section-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .section-content h2 {
    font-size: 24px;
    margin-right: 0;
  }
  
  .countdown {
    gap: 10px;
    align-self: stretch;
    justify-content: center;
  }
  
  .time-unit .label {
    font-size: 10px;
  }
  
  .time-unit .value {
    font-size: 20px;
  }
  
  .separator {
    font-size: 20px;
    margin: 0 3px;
    padding-bottom: 3px;
  }
  
  .nav-arrows {
    display: none; /* Hide navigation arrows on mobile */
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
  }
  
  .view-all-btn {
    padding: 12px 32px;
    font-size: 14px;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  .flash-sales {
    margin-top: 40px;
    margin-bottom: 30px;
  }
  
  .container {
    margin-right: 15px;
    margin-left: 15px;
    padding: 0 5px;
  }
  
  .section-content h2 {
    font-size: 20px;
  }
  
  .countdown {
    gap: 8px;
  }
  
  .time-unit .label {
    font-size: 9px;
  }
  
  .time-unit .value {
    font-size: 18px;
  }
  
  .separator {
    font-size: 18px;
    margin: 0 2px;
  }
  
  .view-all-container {
    margin-top: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .view-all-btn {
    padding: 10px 24px;
    font-size: 13px;
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

/* Error and Loading States */
@media (max-width: 768px) {
  .loading-state,
  .error-state,
  .no-products {
    padding: 30px 15px;
  }
  
  .loading-state p,
  .error-state p,
  .no-products p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .loading-state,
  .error-state,
  .no-products {
    padding: 20px 10px;
  }
  
  .loading-state p,
  .error-state p,
  .no-products p {
    font-size: 13px;
  }
}
</style>
