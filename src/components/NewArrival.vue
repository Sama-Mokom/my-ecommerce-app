<script setup>
import { computed } from "vue";
// Import images
import ps5Img from "/src/assets/images/ps5-slim-goedkope-playstation_large 1.png";
import womenImg from "/src/assets/images/attractive-woman-wearing-hat-posing-black-background 1.png";
import speakersImg from "/src/assets/images/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png";
import perfumeImg from "/src/assets/images/Gucci intense perfume.png";

const arrivals = [
  {
    type: "playstation",
    title: "PlayStation 5",
    description: "Black and White version of the PS5 coming out on sale.",
    image: ps5Img,
    alt: "PlayStation 5",
  },
  {
    type: "women",
    title: "Women’s Collections",
    description: "Featured woman collections that give you another vibe.",
    image: womenImg,
    alt: "Women's Collections",
  },
  {
    type: "speakers",
    title: "Speakers",
    description: "Amazon wireless speakers",
    image: speakersImg,
    alt: "Speakers",
  },
  {
    type: "perfume",
    title: "Perfume",
    description: "GUCCI INTENSE OUD EDP",
    image: perfumeImg,
    alt: "Perfume",
  },
];

const playstation = computed(() =>
  arrivals.filter((a) => a.type === "playstation")
);
const women = computed(() => arrivals.filter((a) => a.type === "women"));
const speakers = computed(() => arrivals.filter((a) => a.type === "speakers"));
const perfume = computed(() => arrivals.filter((a) => a.type === "perfume"));
</script>

<template>
  <section class="new-arrival">
    <div class="section-header">
      <div class="red-bar"></div>
      <span class="section-label">Featured</span>
    </div>
    <h2 class="section-title">New Arrival</h2>
    <div class="arrival-grid">
      <!-- PlayStation 5 -->
      <div
        v-for="item in playstation"
        :key="item.type"
        class="arrival-item large"
      >
        <div class="arrival-content large" id="PS5">
          <img
            id="play-station"
            :src="item.image"
            :alt="item.alt"
            class="arrival-image"
          />
          <div class="arrival-text">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <a href="#" class="shop-link">Shop Now</a>
          </div>
        </div>
      </div>
      <!-- Women's Collections -->
      <div v-for="item in women" :key="item.type" class="arrival-item medium">
        <div class="arrival-content">
          <img
            :src="item.image"
            :alt="item.alt"
            class="arrival-image women-image"
          />
          <div class="arrival-text">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <a href="#" class="shop-link">Shop Now</a>
          </div>
        </div>
      </div>
      <!-- Perfume & Speakers Row -->
      <div class="arrival-row">
        <div
          v-for="item in speakers"
          :key="item.type"
          class="arrival-item small"
        >
          <div class="arrival-content" :id="item.type === 'speaker'">
            <img
              :src="item.image"
              :alt="item.alt"
              class="arrival-image speakers-image"
            />
            <div class="arrival-text">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <a href="#" class="shop-link">Shop Now</a>
            </div>
          </div>
        </div>
        <div
          v-for="item in perfume"
          :key="item.type"
          class="arrival-item small"
        >
          <div class="arrival-content" :id="item.type === 'perfume'">
            <img
              :src="item.image"
              :alt="item.alt"
              class="arrival-image perfume-image"
            />
            <div class="arrival-text">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <a href="#" class="shop-link">Shop Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding-left: 0;
  box-sizing: border-box;
}
.new-arrival {
  margin: 140px 0;
}

body {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  line-height: 1.6;
  color: #000;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: left;
  margin-bottom: 20px;
}

.section-label {
  margin-left: 10px;
  color: #db4444;
  font-weight: 600;
  font-size: 16px;
}

.new-arrival {
  width: 90vw;
  margin: auto;
  padding: 25px;
  max-width: 1500px;
}

.arrival-grid {
  margin-top: 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  height: 600px;
}

.arrival-item {
  background: #000;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.arrival-item.large {
  grid-row: span 2;
}

.arrival-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.arrival-item.medium {
  min-height: 270px;
  flex: 1;
}

.arrival-row {
  display: flex;
  gap: 30px;
  flex: 1;
}

.arrival-item.small {
  background: radial-gradient(#b7b5b5, #5e5e5e, #5a5959,#2a2929, #000);
  flex: 1;
}

.arrival-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
  color: #fff;
}
.arrival-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.women-image {
  transform: translateX(25%);
}
.speakers-image, .perfume-image {
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  max-height: 80%;
  max-width: 80%;
  width: auto;
  height: auto;
}
.arrival-content#PS5 {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}


/* .arrival-content img {
  position: absolute;
  top: 0;
  /* left: 186px; */
  /* width: 432px;
  height: 286px;
  object-fit: cover;
} */


/* .arrival-content[data-v-46d46e45][data-v-46d46e45] {
  overflow: hidden;
  position: relative;
  height: 288px;
  display: flex;
  align-items: flex-end;
  color: #fff;
}

.arrival-content#PS5 {
  width: 511px;
  height: 511px;
  top: 89px;
  left: 29px;
} */
/* Ensure generic .arrival-content img does not override the above */
/* .arrival-content
  img:not(#PS5):not(#womens-collections):not(#echo):not(#perfume) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
} */ 

.arrival-text {
  position: relative;
  z-index: 2;
  padding: 32px;
}

.arrival-text h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 2px;
}

.arrival-text p {
  font-size: 14px;
  margin-bottom: 2px;
  opacity: 0.9;
}

.shop-link {
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid #fff;
  padding-bottom: 4px;
}
/* Tablet styles (max-width: 1024px) */
@media (max-width: 1024px) {
  .new-arrival {
    margin: 100px 0;
    padding: 20px;
    width: 95vw;
  }
  
  .arrival-grid {
    height: 500px;
    gap: 20px;
    margin-top: 50px;
  }
  .arrival-text {
    padding: 24px;
  }
  
  .arrival-text h3 {
    font-size: 20px;
  }
  
  .women-image {
    transform: translateX(15%);
  }
}
/* Medium tablet styles (max-width: 768px) */
@media (max-width: 768px) {
  .new-arrival {
    margin: 80px 0;
    padding: 15px;
  }
  
  .arrival-grid {
    grid-template-columns: 1fr;
    height: auto;
    gap: 20px;
    margin-top: 40px;
  }
   .arrival-item.large {
    grid-row: span 1;
    height: 400px;
  }
  
  .arrival-row {
    flex-direction: column;
  }
  
  .arrival-item.small {
    height: 250px;
  }
  .arrival-text {
    padding: 20px;
  }
  
  .arrival-text h3 {
    font-size: 18px;
  }
  
  .arrival-text p {
    font-size: 13px;
  }
   .women-image {
    transform: translateX(10%);
    width: 80%;
    height: auto;
    left: 0;
  }
}
/* Mobile styles (max-width: 480px) */
@media (max-width: 480px) {
  .new-arrival {
    margin: 60px 0;
    padding: 10px;
    width: 100vw;
  }
  
  .section-header {
    justify-content: center;
    margin-bottom: 15px;
  }
  .section-title {
    text-align: center;
    font-size: 24px;
  }
  
  .arrival-grid {
    gap: 15px;
    margin-top: 30px;
  }
  
  .arrival-item.large {
    height: 350px;
  }
  .arrival-item.medium {
    height: 250px;
  }
  
  .arrival-item.small {
    height: 200px;
  }
  
  .arrival-text {
    padding: 15px;
  }
   .arrival-text h3 {
    font-size: 16px;
  }
  
  .arrival-text p {
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .shop-link {
    font-size: 14px;
  }
   .women-image {
    transform: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .speakers-image, .perfume-image {
    max-height: 70%;
    max-width: 70%;
  }
}
/* Small mobile styles (max-width: 360px) */
@media (max-width: 360px) {
  .new-arrival {
    margin: 40px 0;
  }
  
  .arrival-item.large {
    height: 300px;
  }
  
  .arrival-item.medium {
    height: 220px;
  }
   .arrival-item.small {
    height: 180px;
  }
  
  .arrival-text {
    padding: 12px;
  }
  
  .arrival-text h3 {
    font-size: 15px;
  }
  
  .arrival-text p {
    font-size: 11px;
  }
   .shop-link {
    font-size: 13px;
  }
}
</style>
