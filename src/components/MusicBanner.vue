<template>
  <section class="music-banner">
    <div class="container">
      <div class="music-banner__container">
        <div class="music-banner__content">
          <p class="music-banner__category">Categories</p>
          <h1 class="music-banner__title">
            Enhance Your Music<br />Experience
          </h1>
          <div class="music-banner__timer">
            <div class="music-banner__timer-item">
              <span class="music-banner__timer-value">{{ timeLeft.days }}</span>
              <span class="music-banner__timer-label">Days</span>
            </div>
            <div class="music-banner__timer-item">
              <span class="music-banner__timer-value">{{
                timeLeft.hours
              }}</span>
              <span class="music-banner__timer-label">Hours</span>
            </div>
            <div class="music-banner__timer-item">
              <span class="music-banner__timer-value">{{
                timeLeft.minutes
              }}</span>
              <span class="music-banner__timer-label">Minutes</span>
            </div>
            <div class="music-banner__timer-item">
              <span class="music-banner__timer-value">{{
                timeLeft.seconds
              }}</span>
              <span class="music-banner__timer-label">Seconds</span>
            </div>
          </div>
          <button class="music-banner__button">Buy Now!</button>
        </div>
        <div class="music-banner__image-wrapper">
          <div class="image-background"></div>
          <img :src="image" alt="Music Banner" class="music-banner__image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
// Accept image as a prop
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
});

// Countdown timer functionality
const timeLeft = ref({
  days: "05",
  hours: "23",
  minutes: "59",
  seconds: "30",
});

let countdownInterval = null;

const startCountdown = () => {
  // Set target date (5 days, 23 hours, 59 minutes, 30 seconds from now)
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
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.container {
  margin-left: 20px;
  max-width: 1200px;
  /* margin: 0 auto; */
  /* padding: 0 20px; */
}
.music-banner {
  margin-left: 95px;
  margin-bottom: 20px;
  width: 90vw;
  background: #000;
  padding: 25px;
  /* border-radius: 10px; */
  /* margin: auto; */
}

.music-banner__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 95%;
  margin: 0 auto;
}

.music-banner__content {
  color: #fff;
  max-width: 40%;
}

.music-banner__category {
  color: #00ff6a;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.music-banner__title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 1.1;
}

.music-banner__timer {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.music-banner__timer-item {
  background: #fff;
  color: #000;
  border-radius: 50%;
  width: 62px;
  height: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.music-banner__timer-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}

.music-banner__timer-label {
  font-size: 11px;
  font-weight: 600px;
  /* font-weight: 600px; */
  line-height: 18px;
  color: #222;
}

.music-banner__button {
  margin-top: 1.5rem;
  background: #00ff6a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.music-banner__button:hover {
  background: #00d65a;
}

.music-banner__image-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.music-banner__image {
  z-index: 2;
  position: absolute;
  max-width: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.image-background {
  z-index: 1;
  position: absolute;
  background: radial-gradient(
    circle at center,
    #000,
    #5e5e5e,
    #5a5959,
    #2a2929,
    #000,
    #000,
    #000,
    #000
  );
  width: 698px;
  height: 502px;
}

@media (max-width: 900px) {
  .music-banner__container {
    flex-direction: column;
    align-items: flex-start;
  }

  .music-banner__content {
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .music-banner__image-wrapper {
    justify-content: center;
    width: 100%;
  }

  .music-banner__image {
    max-width: 100%;
  }
}

button:focus, input:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
}

/* .music-banner {
    margin: 140px 0;
}

.banner-content {
    background: #000;
    border-radius: 4px;
    padding: 69px 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
}

.banner-text {
    flex: 1;
}

.banner-label {
    color: #00ff66;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 32px;
    display: block;
}

.banner-content h2 {
    font-size: 48px;
    font-weight: 600;
    line-height: 60px;
    margin-bottom: 32px;
}

.countdown-circles {
    display: flex;
    gap: 24px;
    margin-bottom: 40px;
}

.circle {
    width: 62px;
    height: 62px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #000;
}

.circle .number {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
}

.circle .label {
    font-size: 11px;
    font-weight: 400;
}

.buy-now-btn {
    background: #00ff66;
    color: #fff;
    border: none;
    padding: 16px 48px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
}

.banner-image {
    flex: 1;
    text-align: center;
}

.banner-image img {
    max-width: 100%;
    height: auto;
} */
</style>
