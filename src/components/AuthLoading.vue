<template>
  <div v-if="isLoading" class="auth-loading">
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { authStore } from '../../stores/auth';

const isLoading = computed(() => authStore.isLoading);
</script>

<style scoped>
.auth-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: #333;
}

.loading-spinner i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #db4444;
}

.loading-spinner p {
  font-size: 1.1rem;
  margin: 0;
}
</style>
