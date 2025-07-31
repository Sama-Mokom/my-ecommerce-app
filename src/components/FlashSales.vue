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
        <button @click="fetchProducts" class="view-all-btn">Retry</button>
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
        <button class="view-all-btn">
          View All Products
        </button>
      </div>
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
    products.value = data;

    // Debug: Log the first product to check image URL format
    if (data.length > 0) {
      console.log("First product image URL:", data[0].image);
      console.log("Full first product:", data[0]);
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
.container {
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
</style>
