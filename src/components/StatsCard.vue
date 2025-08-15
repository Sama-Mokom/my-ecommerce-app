<template>
  <div class="stat-card">
    <div class="icon-container">
      <img :src="icon" class="icon" style="width: 40px; height: 40px" />
    </div>
    <h3>{{ value }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, required: true },
  value: { type: String, required: true },
  description: { type: String, required: true },
});
</script>
<style scoped>
.stat-card:hover img {
  filter: invert(0);
}

.stat-card:hover .icon-container{
    /* filter: invert(1); */
    background-color: #fff;
}

.icon-container {
  width: 80px;
  height: 80px;
  background-color: #2c2c2c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);
  /* filter: invert(0); */
}

.stat-card img{
  max-width: 40px;
  max-height: 40px;
  filter: invert(1);
}
</style>
