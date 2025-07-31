<template>
  <section class="explore-products">
    <div class="container">
      <div class="section-header">
        <div class="section-title">
          <div class="red-bar"></div>
          <span class="section-label">Our Products</span>
        </div>
        <div class="section-content">
          <h2>Explore Our Products</h2>
          <div class="nav-arrows">
            <button class="nav-arrow"><i class="fas fa-arrow-left"></i></button>
            <button class="nav-arrow">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="products-grid large-grid">
        <ProductCard 
        v-for="product in products"
        :key="product.id"
        :product="product"
        />
        <!-- <div
          class="product-card"
          v-for="(product, idx) in products"
          :key="product.name + idx"
        >
          <div class="product-image">
            <span v-if="product.isNew" class="new-badge">NEW</span>
            <img :src="product.image" :alt="product.name" />
            <div class="product-actions">
              <button class="action-btn"><i class="far fa-heart"></i></button>
              <button class="action-btn"><i class="far fa-eye"></i></button>
            </div>
            <button class="add-to-cart">Add To Cart</button>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="price">
              <span class="current-price">${{ product.price }}</span>
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
            <div v-if="product.colorOptions.length" class="color-options">
              <span
                v-for="(color, cidx) in product.colorOptions"
                :key="color + cidx"
                :class="['color-dot', color, cidx === 0 ? 'active' : '']"
              ></span>
            </div>
          </div>
        </div> -->
      </div>
      <div class="view-all-container">
        <button class="view-all-btn">View All Products</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
// Import images
import dogFoodImg from "/src/assets/images/dog food.png";
import canonCameraImg from "/src/assets/images/canon camera.png";
import gamingLaptopImg from "/src/assets/images/Gaming laptop.png";
import curologyImg from "/src/assets/images/curology-j7pKVQrTUsM-unsplash 1.png";
import kidsCarImg from "/src/assets/images/Kids car.png";
import soccerCleatsImg from "/src/assets/images/soccer cleats.png";
import usbGamepadImg from "/src/assets/images/USB Gamepad.png";
import satinJacketImg from "/src/assets/images/Satin jacket.png";

const products = [
  {
    id:13,
    name: "Breed Dry Dog Food",
    image: dogFoodImg,
    price: 100,
    rating: 3,
    ratingCount: 35,
    isNew: false,
    colors: [],
  },
  {
    id: 14,
    name: "CANON EOS DSLR Camera",
    image: canonCameraImg,
    price: 360,
    rating: 4,
    ratingCount: 95,
    isNew: false,
    colors: [],
  },
  {
    id: 15,
    name: "ASUS FHD Gaming Laptop",
    image: gamingLaptopImg,
    price: 700,
    rating: 5,
    ratingCount: 325,
    isNew: false,
    colors: [],
  },
  {
    id: 16,
    name: "Curology Product Set",
    image: curologyImg,
    price: 500,
    rating: 4,
    ratingCount: 145,
    isNew: false,
    colors: [],
  },
  {
    id: 17,
    name: "Kids Electric Car",
    image: kidsCarImg,
    price: 960,
    rating: 5,
    ratingCount: 65,
    isNew: true,
    colors: ["red", "blue"],
  },
  {
    id: 18,
    name: "Jr. Zoom Soccer Cleats",
    image: soccerCleatsImg,
    price: 1160,
    rating: 5,
    ratingCount: 35,
    isNew: false,
    colors: ["yellow", "red"],
  },
  {
    id: 19,
    name: "GP11 Shooter USB Gamepad",
    image: usbGamepadImg,
    price: 660,
    rating: 5,
    ratingCount: 55,
    isNew: true,
    colors: ["black", "red"],
  },
  {
    id: 20,
    name: "Quilted Satin Jacket",
    image: satinJacketImg,
    price: 660,
    rating: 5,
    ratingCount: 55,
    isNew: false,
    colors: ["green", "red"],
  },
];
</script>

<style scoped>
.explore-products {
  background: #fff;
  border-radius: 10px;
  margin: 2rem 0;
  padding: 2rem 0 3rem 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
.section-header {
  display: inline;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.red-bar {
  width: 20px;
  height: 40px;
  background: #e74c3c;
  border-radius: 4px;
}
.section-label {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
}
.section-content h2 {
  padding-right: 500px;
  font-size: 36px;
  font-weight: 600;
  margin: 0;
}
.nav-arrows {
  margin-left: 200px;
  display: flex;
  gap: 0.5rem;
}
.nav-arrow {
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-arrow:hover {
  background: #e74c3c;
  color: #fff;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 1.5rem;
  margin-bottom: 2.5rem;
}
.product-card {
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: box-shadow 0.2s;
}
/* .product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
} */

.product-image {
  background: #fafafa;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.product-image img {
  max-width: 120px;
  max-height: 110px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}
.product-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.action-btn {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.action-btn:hover {
  background: #e74c3c;
  color: #fff;
  border: 1px solid #e74c3c;
}
.add-to-cart {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-to-cart:hover {
  background: #e74c3c;
}
.new-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #00ff6a;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 12px;
  z-index: 2;
}
.product-info {
  width: 100%;
  text-align: left;
}
.product-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0 0.3rem 0;
}
.price {
  margin-bottom: 0.3rem;
}
.current-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.1rem;
}
.rating {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 0.4rem;
}
.stars {
  color: #ffc107;
  font-size: 1rem;
}
.rating-count {
  color: #888;
  font-size: 0.95rem;
}
.color-options {
  display: flex;
  justify-content: left;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.color-dot.red {
  background: #e74c3c;
}
.color-dot.blue {
  background: #3498db;
}
.color-dot.yellow {
  background: #f9e79f;
  border: 2px solid #f1c40f;
}
.color-dot.black {
  background: #222;
}
.color-dot.green {
  background: #00ff6a;
}
.color-dot.active {
  border: 2px solid #222;
}
.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.view-all-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.view-all-btn:hover {
  background: #c0392b;
}
@media (max-width: 1000px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
