<template>
  <div class="cart-container">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <span>Home / Cart</span>
    </div>

    <!-- Cart Items Table -->
    <div class="cart-table-container">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id" class="cart-item">
            <td class="product-cell">
              <div class="product-info">
                <div class="image-container">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="product-image"
                  />
                </div>
                <span class="product-name">{{ item.name }}</span>
                <button
                  @click="removeFromCart(item.productId)"
                  class="remove-btn"
                >
                  ×
                </button>
              </div>
            </td>
            <td class="price-cell">${{ item.price }}</td>
            <td class="quantity-cell">
              <div class="quantity-controls">
                <!-- <button @click="decreaseQuantity(item)" class="quantity-btn">-</button> -->
                <input
                  type="number"
                  :value="item.quantity"
                  @change="updateQuantity(item, $event.target.value)"
                  min="1"
                  class="quantity-input"
                />
                <!-- <button @click="increaseQuantity(item)" class="quantity-btn">+</button> -->
              </div>
            </td>
            <td class="subtotal-cell">${{ item.subTotal }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="returnToShop" class="btn btn-secondary">
        Return To Shop
      </button>
      <button @click="updateCart" class="btn btn-secondary">Update Cart</button>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <!-- Coupon Code Section -->
      <div class="coupon-section">
        <input
          type="text"
          placeholder="Coupon Code"
          v-model="couponCode"
          class="coupon-input"
        />
        <button @click="applyCoupon" class="btn btn-primary">
          Apply Coupon
        </button>
      </div>

      <!-- Cart Total Summary -->
      <div class="cart-summary">
        <h3>Cart Total</h3>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cartSummary.subTotal }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>{{ cartSummary.shipping }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ cartSummary.total }}</span>
        </div>
        <button @click="proceedToCheckout" class="btn btn-primary checkout-btn">
          Proceed to checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import apiService from "../services/api.js";
import { authStore } from "../../stores/auth";

const router = useRouter();
const cartItems = ref([]);
const cartSummary = ref({
  subTotal: "0.00",
  shipping: "Free",
  total: "0.00",
});
const couponCode = ref("");
const loading = ref(false);

// Fetch cart items from backend
const fetchCart = async () => {
  if (!authStore.user) {
    router.push("/signin");
    return;
  }

  try {
    loading.value = true;
    const response = await apiService.getCart();
    console.log("Cart response:", response);
    console.log("Cart items:", response.cart);
    cartItems.value = response.cart;
    cartSummary.value = response.summary;
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (error.message.includes("Authentication failed")) {
      router.push("/signin");
    }
  } finally {
    loading.value = false;
  }
};

// Update quantity of cart item
const updateQuantity = async (item, newQuantity) => {
  const quantity = parseInt(newQuantity);
  if (isNaN(quantity) || quantity < 1) return;

  console.log("Updating quantity for item:", item);
  console.log("Product ID:", item.productId);
  console.log("New quantity:", quantity);

  try {
    await apiService.updateCartItem(item.productId, quantity);
    item.quantity = quantity;
    item.subTotal = (item.price * quantity).toFixed(2);
    await fetchCart(); // Refresh cart to get updated totals
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Failed to update quantity. Please try again.");
  }
};

// Increase quantity
const increaseQuantity = (item) => {
  updateQuantity(item, item.quantity + 1);
};

// Decrease quantity
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    updateQuantity(item, item.quantity - 1);
  }
};

// Remove item from cart
const removeFromCart = async (productId) => {
  if (!confirm("Are you sure you want to remove this item from your cart?")) {
    return;
  }

  try {
    await apiService.removeFromCart(productId);
    await fetchCart(); // Refresh cart
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Failed to remove item. Please try again.");
  }
};

// Update cart (refresh)
const updateCart = () => {
  fetchCart();
};

// Return to shop
const returnToShop = () => {
  router.push("/");
};

// Apply coupon
const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert("Please enter a coupon code");
    return;
  }
  // TODO: Implement coupon logic
  alert("Coupon functionality will be implemented soon!");
};

// Proceed to checkout
const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    alert("Your cart is empty");
    return;
  }
  // TODO: Implement checkout logic
  alert("Checkout functionality will be implemented soon!");
};

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.breadcrumb {
  margin-bottom: 30px;
  color: #666;
  font-size: 14px;
}

.cart-table-container {
  margin-bottom: 30px;
  overflow-x: auto;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cart-table th {
  background: #ffffff;
  padding: 24px 16px;
  text-align: left;
  font-weight: 400;
  color: #000;
  border-bottom: none;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}

.cart-table td {
  padding: 40px 16px;
  border-bottom: none;
  vertical-align: middle;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}

.cart-table th:first-child,
.product-cell {
  text-align: left;
  width: 40%;
}

.cart-table th:nth-child(2),
.price-cell {
  text-align: center;
  width: 20%;
}

.cart-table th:nth-child(3),
.quantity-cell {
  text-align: center;
  width: 20%;
}

.cart-table th:nth-child(4),
.subtotal-cell {
  text-align: center;
  width: 20%;
}

.product-cell {
  width: 40%;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.image-container{
  width: 54px;
  height: 54px;
  position:relative;
  flex-shrink: 0;
}

.product-image {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 0;
  flex-shrink: 0;
  background: none;
}

.product-info:hover .remove-btn {
  display: flex;
}

.product-name {
  /* was set 35px */
  margin-left: 0;  
  font-weight: 400;
  color: #000;
  flex: 1;
  font-size: 14px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  left: -8px;
  background: #db4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.remove-btn:hover {
  background: #ff4444;
}

.price-cell,
.subtotal-cell {
  font-weight: 400;
  color: #000;
  text-align: center;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 72px;
  margin: 0 auto;
}

.quantity-btn {
  background: #ffffff;
  border: none;
  border-radius: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-right: 1px solid #ccc;
}

.quantity-btn:last-child {
  border-right: none;
  border-left: 1px solid #ccc;
}

.quantity-btn:hover {
  background: #e9ecef;
}

.quantity-input {
  width: 40px;
  height: 32px;
  text-align: center;
  border: none;
  border-radius: 0;
  font-size: 14px;
  background: #ffffff;
  outline: none;
}

.quantity-input:focus {
  outline: none;
  background: #f9f9f9;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #db4444;
  color: white;
}

.btn-primary:hover {
  background: #ff4444;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.coupon-section {
  display: flex;
  gap: 15px;
}

.coupon-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
}

.cart-summary {
  background: white;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 25px;
}

.cart-summary h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
  margin-top: 15px;
}

.checkout-btn {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .cart-table th,
  .cart-table td {
    padding: 12px 8px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>
