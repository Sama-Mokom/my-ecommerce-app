<template>
  <section class="hero-banner">
    <div class="hero-content">
      <div class="hero-text">
        <div class="brand-info">
          <i :class="brandIcon"></i>
          <span>{{ brandText }}</span>
        </div>
        <h1>{{ title }}</h1>
        <a :href="buttonLink" class="shop-now-btn"
          >{{ buttonText }} <i class="fas fa-arrow-right"></i
        ></a>
      </div>
      <div class="hero-image">
        <Splide
          :options="splideOptions"
          aria-label="Product Images"
          @splide:moved="handleSlideChange"
          ref="splideRef"
        >
          <SplideSlide v-for="(item, index) in heroImg" :key="index">
            <img :src="item.image" :alt="item.alt" />
          </SplideSlide>
        </Splide>
        <div class="hero-dots">
          <span
            v-for="(dot, i) in heroImg.length"
            :key="i"
            class="dot"
            :class="{ active: i === currentSlide }"
            @click="goToSlide(i)"
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  brandIcon: { type: String, default: "fab fa-apple" },
  brandText: { type: String, default: "iPhone 14 Series" },
  title: { type: String, default: "Up to 10% off Voucher" },
  buttonText: { type: String, default: "Shop Now" },
  buttonLink: { type: String, default: "#" },
  autoplayInterval: { type: Number, default: 3000 },
});
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import heroImage from "/src/assets/images/hero_endframe__cvklg0xk3w6e_large 2.png";
import heroImage2 from "/src/assets/images/iPhone_14_Pro_Mockups-removebg-preview.png";
import heroImage3 from "/src/assets/images/iPhone14options.webp";
import heroImage4 from "/src/assets/images/iPhoneHero.jpg";
import heroImage5 from "/src/assets/images/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-deep-purple-220907-geo_inline.jpg.large_2x-removebg-preview.png";
const heroImg = [
  {
    image: heroImage,
    alt: "Iphone 14",
  },
  {
    image: heroImage3,
    alt: "iPhone 14",
  },
  {
    image: heroImage2,
    alt: "iPhone 14",
  },
  {
    image: heroImage4,
    alt: "iPhone 14",
  },
  {
    image: heroImage2,
    alt: "iPhone 14",
  },
];

const currentSlide = ref(0);
const splideRef = ref(null);

const splideOptions = {
  type: "loop",
  perPage: 1,
  perMove: 1,
  gap: "1rem",
  arrows: false,
  pagination: false,
  autoplay: true,
  interval: props.autoplayInterval,
  pauseOnHover: false,
  pauseOnFocus: false,
  resetProgress: false,
  rewind: true,
  speed: 800,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

const handleSlideChange = (splide, newIndex) => {
  currentSlide.value = newIndex;
};
const goToSlide = (index) => {
  if (splideRef.value && splideRef.value.splide) {
    splideRef.value.splide.go(index);
  }
};
</script>

<style scoped>
/* Hero Banner */
.hero-banner {
  width: 61vw;
  margin-right: 40px;
  background: #000;
  padding: 58px 64px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-text {
  flex: 1;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}

.brand-info i {
  font-size: 40px;
}

.brand-info span {
  font-size: 16px;
}

.hero-banner h1 {
  font-size: 48px;
  font-weight: 600;
  line-height: 60px;
  margin-bottom: 22px;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid #fff;
  padding-bottom: 4px;
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

.hero-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: #db4444;
  border: 2px solid #fff;
}
@media (max-width: 900px) {
  .hero-banner {
    width: 90vw;
  }
}
@media (min-width: 1800px){
.hero-banner {
    width: 75vw;
  }
}
@media (min-width: 1600px){
.hero-banner {
    width: 71vw;
  }
}
@media (min-width: 2400px){
.hero-banner {
    width: 81vw;
  }
}
</style>
