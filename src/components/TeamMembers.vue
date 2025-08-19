<template>
  <div class="team-members-container">
    <div class="container">
      <div class="splide" ref="splideRef">
        <div class="splide__track">
          <ul class="splide__list">
            <li
              class="splide__slide"
              v-for="member in members"
              :key="member.name"
            >
              <MemberCard
                :image="member.image"
                :name="member.name"
                :title="member.title"
                :twitterLink="member.twitterLink"
                :instaLink="member.instaLink"
                :linkedLink="member.linkedLink"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="carousel-dots">
        <span
          v-for="(dot, i) in members.length"
          :key="i"
          class="dot"
          :class="{ active: i === currentSlide }"
          @click="goToSlide(i)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import MemberCard from "./MemberCard.vue";
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Splide } from '@splidejs/splide'

const splideRef = ref(null);
const currentSlide = ref(0);
let splideInstance = null;
const members = [
  {
    image: "src/assets/images/TomCruise.png",
    name: "Tom Cruise",
    title: "Founder & Chairman",
    twitterLink: "#",
    instaLink: "#",
    linkedLink: "#",
  },
  {
    image: "src/assets/images/EmmaWatson.png",
    name: "Emma Watson",
    title: "Managing Director",
    twitterLink: "#",
    instaLink: "#",
    linkedLink: "#",
  },
  {
    image: "src/assets/images/WillSmith.png",
    name: "Will Smith",
    title: "Product Designer",
    twitterLink: "#",
    instaLink: "#",
    linkedLink: "#",
  },
];

onMounted(async () => {

  await nextTick()
   if (splideRef.value && splideRef.value.querySelector('.splide__track')){
    try{
       splideInstance = new Splide(splideRef.value, {
    type: 'slide',
    perPage: 3,
    perMove: 1,
    gap: '30px',
    pagination: false,
    arrows: false,
    breakspoints: {
      992: {
        perPage: 2,
        gap: '20px',
      },
      576: {
        perPage: 1,
        gap: '20px',
      },
    }
  })
  splideInstance.on('moved', (newIndex) => {
    currentSlide.value = newIndex
  })

  splideInstance.mount()
    } catch (error){
      console.error('Error initializing Splide:', error)
    }
   } else {
    console.error('Splide container or track element not found')
   }
})

// Navigate to specific slide when dot is clicked
const goToSlide = (index) => {
  if (splideInstance) {
    splideInstance.go(index)
  }
}

onUnmounted(() => {
  if (splideInstance) {
    splideInstance.destroy()
  }
})
</script>

<style scoped>
.team-members-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  padding: 80px 0;
  background-color: #fff;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.splide {
  margin-bottom: 40px;
}

.splide__slide {
  display: flex;
  justify-content: center;
}

/* .team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
} */

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: #db4444;
}

.dot:hover {
  background-color: #999;
}

.dot.active:hover {
  background-color: #b83838;
}

@media (max-width: 992px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  /* .team-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  } */

  .member-name {
    font-size: 28px;
  }
}
</style>
