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
            style="
              transform: translate(-50%, -50%);
              margin: auto;
              max-height: 100%;
              max-width: 100%;
              display: block;
              object-fit: cover;
              position: absolute;
              top: 50%;
              left: 50%;
            "
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
            style="
              width: 432px;
              margin-left: 120px;
              height: 286px;
              /* left: 186px; */
              transform: translateY(180deg);
              position: absolute;
              top: 0;
              object-fit: cover;
            "
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
              style="
                transform: translate(-50%, -50%);
                margin: auto;
                max-height: 100%;
                max-width: 100%;
                display: block;
                width: 190px;
                height: 221px;
                object-fit: cover;
                position: absolute;
                top: 50%;
                left: 50%;
              "
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
              style="
                transform: translate(-50%, -50%);
                margin: auto;
                max-height: 100%;
                max-width: 100%;
                display: block;
                width: 201px;
                height: 203px;
                object-fit: cover;
                position: absolute;
                top: 50%;
                left: 50%;
              "
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


.arrival-content img {
  position: absolute;
  top: 0;
  /* left: 186px; */
  width: 432px;
  height: 286px;
  object-fit: cover;
}


.arrival-content[data-v-46d46e45][data-v-46d46e45] {
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
}
/* Ensure generic .arrival-content img does not override the above */
.arrival-content
  img:not(#PS5):not(#womens-collections):not(#echo):not(#perfume) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

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
</style>
