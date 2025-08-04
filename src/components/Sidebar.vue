<template>
  <aside class="sidebar">
    <ul class="category-list">
      <li v-for="(cat, i) in categories" :key="i">
        <a :href="cat.href">
          {{ cat.name }}
          <i v-if="cat.hasArrow" class="fas fa-chevron-right"></i>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { name: "Woman's Fashion", href: '#', hasArrow: true },
      { name: "Men's Fashion", href: '#', hasArrow: true },
      { name: 'Electronics', href: '#' },
      { name: 'Home & Lifestyle', href: '#' },
      { name: 'Medicine', href: '#' },
      { name: 'Sports & Outdoor', href: '#' },
      { name: "Baby's & Toys", href: '#' },
      { name: 'Groceries & Pets', href: '#' },
      { name: 'Health & Beauty', href: '#' }
    ]
  }
})
</script> 
<style scoped>
.sidebar {
    margin-left: 60px;
    border-right: 1px solid #e5e5e5;
    padding-right: 16px;
}

/* Sidebar */
.sidebar {
  border-right: 1px solid #e5e5e5;
  padding-right: 16px;
}

.category-list {
  list-style: none;
}

.category-list li {
  margin-bottom: 16px;
}

.category-list a {
  text-decoration: none;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.category-list a:hover {
  color: #db4444;
}

</style>