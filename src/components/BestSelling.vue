<template>
  <section class="best-selling">
    <div class="container">
      <div class="section-header">
        <div class="section-header-stack">
          <div class="section-title">
            <div class="red-bar"></div>
            <span class="section-label">Today's</span>
          </div>
          <div class="section-content">
            <h2>Best Selling Products</h2>
            <div class="view-all-container">
              <button class="view-all-btn">View All Products</button>
            </div>
          </div>
        </div>
      </div>
      <div class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";

const products = [
  {
    id: 9,
    name: "The north coat",
    image: "/src/assets/images/North coat.png",
    discount: "",
    price: 260,
    originalPrice: 360,
    rating: 5,
    ratingCount: 65,
  },
  {
    id: 10,
    name: "Gucci duffle bag",
    image: "/src/assets/images/Gucci duffle bag.png",
    discount: "",
    price: 960,
    originalPrice: 1160,
    rating: 4.5,
    ratingCount: 65,
  },
  {
    id: 11,
    name: "RGB liquid CPU Cooler",
    image: "/src/assets/images/Liquid cooling system.png",
    discount: "",
    price: 370,
    originalPrice: 400,
    rating: 5,
    ratingCount: 99,
  },
  {
    id: 12,
    name: "Small BookShelf",
    image: "/src/assets/images/bookshelf.png",
    discount: "",
    price: 375,
    originalPrice: 400,
    rating: 4,
    ratingCount: 99,
  },
];
</script>
<style scoped>
.section-header {
  margin-left: 45px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 60px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0px;
}
.section-content {
  height: 50px;
  display: flex;
  align-items: flex-end;
  gap: 0;
  margin-bottom: 0px;
}

.products-grid {
  margin-bottom: 2rem;
}

.products-grid {
  margin-left: 40px;
  display: flex;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}
.product-card {
  min-width: 250px;
  position: relative;
  cursor: pointer;
}
.product-image {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 35px;
  position: relative;
  margin-bottom: 16px;
  text-align: center;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.add-to-cart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .add-to-cart {
  opacity: 1;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.current-price {
  color: #db4444;
  font-weight: 500;
}

.original-price {
  color: #000;
  opacity: 0.5;
  text-decoration: line-through;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #ffad33;
  font-size: 16px;
}

.stars .far {
  color: #ccc;
}

.rating-count {
  color: #000;
  opacity: 0.5;
  font-size: 14px;
}

.view-all-container {
  margin-left: 560px;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
