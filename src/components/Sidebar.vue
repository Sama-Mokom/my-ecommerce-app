<template>
  <aside class="sidebar">
    <ul class="category-list">
      <li v-for="(cat, i) in categories" :key="i">
        <router-link :to="getCategoryRoute(cat)" class="category-link">
          {{ cat.name }}
          <i v-if="cat.hasArrow" class="fas fa-chevron-right"></i>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { name: "Woman's Fashion", slug: "womens-fashion", hasArrow: true },
      { name: "Men's Fashion", slug: "mens-fashion", hasArrow: true },
      { name: 'Clothing', slug: 'Clothing' },
      { name: 'Electronics', slug: 'Computers' },
      { name: 'Gaming', slug: 'Gaming' },
      { name: 'Home & Lifestyle', slug: 'home-lifestyle' },
      { name: 'Medicine', slug: 'medicine' },
      { name: 'Sports & Outdoor', slug: 'Sports' },
      { name: "Baby's & Toys", slug: "Kids" },
      { name: 'Pets', slug: 'Pets' },
      { name: 'Groceries', slug: 'Groceries' },
      { name: 'Health & Beauty', slug: 'Cosmetics' }
    ]
  }
})

const getCategoryRoute = (category) => {
  return {
    name: 'CategoryPage',
    params: { categoryName: category.slug || category.name }
  };
};
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
@media (min-width: 1800px){
 .sidebar{
  margin-left:0px
 }
}
</style>