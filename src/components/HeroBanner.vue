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

const handleSlideChange = (splide, newIndex)=>{
  currentSlide.value = newIndex;
};
const goToSlide = (index) =>{
  if (splideRef.value && splideRef.value.splide){
    splideRef.value.splide.go(index);
  }
}
</script>
