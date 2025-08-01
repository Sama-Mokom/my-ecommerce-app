<template>
  <div class="product-card">
    <div class="product-image">
      <span v-if="product.discount" class="discount-badge">{{
        product.discount
      }}</span>
      <span v-if="product.isNew" class="new-badge">NEW</span>
      <img :src="product.image" :alt="product.name" />
      <div class="product-actions">
        <button class="action-btn"><i class="far fa-heart"></i></button>
        <button class="action-btn"><i class="far fa-eye"></i></button>
      </div>
      <button v-if="showAddToCart" class="add-to-cart">Add To Cart</button>
    </div>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <div class="price">
        <span class="current-price">${{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price"
          >${{ product.originalPrice }}</span
        >
      </div>
      <div class="rating">
        <div class="stars">
          <i
            v-for="i in 5"
            :key="i"
            :class="i <= product.rating ? 'fas fa-star' : 'far fa-star'"
          ></i>
        </div>
        <span class="rating-count">({{ product.ratingCount }})</span>
      </div>
      <div
        v-if="product.colors.length > 0 && product.section === `explore`"
        class="color-options"
      ><span v-for="(color, idx) in product.colors" :key="idx" :class="['color-dot', color, { active: idx === 0 }]"/>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  showAddToCart: { type: Boolean, default: true },
});
</script>
