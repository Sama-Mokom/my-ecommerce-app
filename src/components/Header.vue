<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <h2>Exclusive</h2>
      </div>
      <nav class="nav">
        <a v-for="(link, i) in navLinks" :key="i" :href="link.href" class="nav-link" :class="{ active: link.active }">{{ link.text }}</a>
      </nav>
      <div class="header-actions">
        <div class="search-box">
          <input type="text" placeholder="What are you looking for?">
          <i class="fas fa-search"></i>
          <!-- <img :src="searchIcon" alt="search" /> -->
        </div>
        <div class="header-icons">
          <i class="far fa-user"></i>
          <i class="far fa-heart"></i>
          <i class="fas fa-shopping-cart"></i>
          <!-- <img :src="cartIcon" alt="cart" /> -->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  navLinks: {
    type: Array,
    default: () => [
      { text: 'Home', href: '#', active: true },
      { text: 'Contact', href: '#' },
      { text: 'About', href: '#' },
      { text: 'Sign Up', href: '#' }
    ]
  },
  searchIcon: { type: String, default: '/images/search icon.png' },
  cartIcon: { type: String, default: '/images/Cart1.png' }
})
</script> 

<style scoped>
.logo{
  margin-left: 60px;
}
input:focus, a:focus {
    /* outline: 2px solid #db4444; */
    outline-offset: 2px;
}
</style>