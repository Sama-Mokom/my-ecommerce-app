<template>
  <div class="checkout-container">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <router-link to="/">Home</router-link> /
      <router-link to="/cart">Cart</router-link> /
      <span>Checkout</span>
    </div>

    <div class="checkout-content">
      <!-- Billing Details Form -->
      <div class="billing-details">
        <h2>Billing Details</h2>

        <form @submit.prevent="submitOrder">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                required
              />
            </div>

            <div class="form-group">
              <label for="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                v-model="formData.companyName"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="streetAddress">Street Address*</label>
            <input
              type="text"
              id="streetAddress"
              v-model="formData.streetAddress"
              required
            />
          </div>

          <div class="form-group">
            <label for="apartment">Apartment, floor, etc. (optional)</label>
            <input type="text" id="apartment" v-model="formData.apartment" />
          </div>

          <div class="form-group">
            <label for="townCity">Town/City*</label>
            <input
              type="text"
              id="townCity"
              v-model="formData.townCity"
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number*</label>
            <input type="tel" id="phone" v-model="formData.phone" required />
          </div>

          <div class="form-group">
            <label for="email">Email Address*</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="saveInfo" v-model="formData.saveInfo" />
            <label for="saveInfo"
              >Save this information for faster check-out next time</label
            >
          </div>
        </form>
      </div>
      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Your Order</h2>

        <div class="order-table">
          <div class="order-row header">
            <div class="product-col">Product</div>
            <div class="price-col">Price</div>
          </div>

          <div v-for="item in cartItems" :key="item.id" class="order-row">
            <div class="product-col">
              <div class="product-info">
                <div class="image-container">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="product-image"
                  />
                </div>
                <span>{{ item.name }} × {{ item.quantity }}</span>
              </div>
            </div>
            <!-- <div class="price-col">${{ item.subTotal }}</div> -->

            <!-- <div class="order-row subtotal">
            <div class="product-col">Subtotal</div>
            <div class="price-col">${{ cartSummary.subTotal }}</div>
          </div> -->

            <!-- <div class="order-row shipping">
            <div class="product-col">Shipping</div>
            <div class="price-col">{{ cartSummary.shipping }}</div>
          </div> -->

            <div class="order-row total">
              <!-- <div class="product-col">Total</div> -->
              <div class="price-col">${{ item.subTotal }}</div>
            </div>
          </div>
           <div class="order-row total">
            <div class="product-col">Sub Total</div>
            <div class="price-col">${{ cartSummary.subTotal }}</div>
          </div>
           <div class="order-row total">
            <div class="product-col">Shipping</div>
            <div class="price-col">{{ cartSummary.shipping }} (For now though)</div>
          </div>
          <div class="order-row total">
            <div class="product-col">Total</div>
            <div class="price-col">${{ cartSummary.total }}</div>
          </div>

          <!-- Payment Methods -->
          <div class="payment-methods">
            <h3>Payment Methods</h3>

            <div class="payment-option">
              <input
                type="radio"
                id="bankTransfer"
                name="paymentMethod"
                value="bank"
                v-model="paymentMethod"
                checked
              />
              <label for="bankTransfer">Bank Transfer</label>
            </div>

            <div class="payment-option">
              <input
                type="radio"
                id="visa"
                name="paymentMethod"
                value="visa"
                v-model="paymentMethod"
              />
              <label for="visa">Visa</label>
            </div>

            <div class="payment-option">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="cash"
                v-model="paymentMethod"
              />
              <label for="cashOnDelivery">Cash on delivery</label>
            </div>
          </div>

          <!-- Coupon Code -->
          <div class="coupon-section">
            <input type="text" placeholder="Coupon Code" v-model="couponCode" />
            <button type="button" class="btn btn-primary" @click="applyCoupon">
              Apply Coupon
            </button>
          </div>

          <!-- Place Order Button -->
          <button
            type="submit"
            class="btn btn-primary place-order-btn"
            @click="submitOrder"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Processing..." : "Place Order" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiService from "../services/api.js";
import { authStore } from "../../stores/auth";

const router = useRouter();

// Form data
const formData = ref({
  firstName: "",
  companyName: "",
  streetAddress: "",
  apartment: "",
  townCity: "",
  phone: "",
  email: authStore.user?.email || "",
  saveInfo: false,
});

// Payment method
const paymentMethod = ref("bank");
const couponCode = ref("");
const isSubmitting = ref(false);

// Cart data
const cartItems = ref([]);
const cartSummary = ref({
  subTotal: "0.00",
  shipping: "Free",
  total: "0.00",
});

// Fetch cart items
const fetchCart = async () => {
  try {
    const response = await apiService.getCart();
    cartItems.value = response.cart.map((item) => ({
      ...item,
      // Ensure image URL is properly formatted
      image: item.image.startsWith("http")
        ? item.image
        : `http://localhost:8080${item.image}`,
    }));
    cartSummary.value = response.summary;

    // Pre-fill email if user is logged in
    if (authStore.user?.email) {
      formData.value.email = authStore.user.email;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (error.message.includes("Authentication failed")) {
      router.push("/signin");
    }
  }
};

// Apply coupon (placeholder for now)
const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert("Please enter a coupon code");
    return;
  }
  alert("Coupon functionality will be implemented soon!");
};

// Submit order
const submitOrder = async () => {
  if (cartItems.value.length === 0) {
    alert("Your cart is empty");
    return;
  }

  isSubmitting.value = true;

  try {
    // Validate required fields
    if (
      !formData.value.firstName ||
      !formData.value.streetAddress ||
      !formData.value.townCity ||
      !formData.value.phone ||
      !formData.value.email
    ) {
      throw new Error("Please fill in all required fields");
    }

    // Create order payload
    const orderData = {
      ...formData.value,
      paymentMethod: paymentMethod.value,
      couponCode: couponCode.value,
      items: cartItems.value,
      total: cartSummary.value.total,
    };

    // TODO: Replace with actual API call to submit order
    console.log("Submitting order:", orderData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Order placed successfully!");
    router.push("/"); // Redirect to home after successful order

    // TODO: Clear cart after successful order
    // await apiService.clearCart();
  } catch (error) {
    console.error("Order submission error:", error);
    alert(error.message || "Failed to place order. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (!authStore.user) {
    router.push("/signin");
    return;
  }
  fetchCart();
});
</script>

<style scoped>
.checkout-container {
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

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #db4444;
  text-decoration: underline;
}

.breadcrumb span {
  color: #000;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.billing-details,
.order-summary {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

h3 {
  font-size: 18px;
  margin: 20px 0 15px;
  color: #333;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

input[type="text"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.checkbox-group input {
  margin-right: 10px;
}

/* Order Summary Styles */
.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.order-row.header {
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.order-row.subtotal,
.order-row.shipping,
.order-row.total {
  font-weight: 500;
}

.order-row.total {
  font-weight: 600;
  font-size: 16px;
  border-top: none;
  border-bottom: none;
  padding-top: 15px;
  margin-top: 15px;
}

.product-col {
  flex: 3;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.image-container {
  width: 60px;
  height: 60px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: transparent;
}

.product-image {
  margin-bottom: 0px;
  padding: 0px;
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.price-col {
  flex: 1;
  text-align: right;
}

/* Payment Methods */
.payment-option {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.payment-option input {
  margin-right: 10px;
}

/* Coupon Section */
.coupon-section {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.coupon-section input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #db4444;
  color: white;
}

.btn-primary:hover {
  background: #c73e3e;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.place-order-btn {
  width: 190px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .image-container {
    width: 50px;
    height: 50px;
  }

  .image-container {
    width: 50px;
    height: 50px;
  }

  .checkout-content {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
