<template>
  <div class="category-card">
    <img :src="icon">
    <span> {{ label }} </span>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true }
})
</script> 