<template>
  <transition name="fade">
    <button v-if="show" class="back-to-top" @click="scrollToTop" aria-label="Back to top">
      <i class="fas fa-arrow-up"></i>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const show = ref(false);
const handleScroll = () => {
  show.value = window.scrollY > 200;
};
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 56px;
  height: 56px;
  background: #e7e1e1;
  color: #060000;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
  transition: background 0.2s, transform 0.2s;
}
.back-to-top:hover {
  background: #db4444;
  transform: translateY(-4px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 