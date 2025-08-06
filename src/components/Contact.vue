<template>
  <div class="contact-container">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">Home</a> / <span>Contact</span>
      </div>
      <div class="contact-layout">
        <div class="contact-info-section">
          <div class="info-card">
            <div class="icon-wrapper">
              <i class="fas fa-phone-alt"></i>
            </div>
            <h3 class="info-title">Call To Us</h3>
            <p class="info-text">We are available 24/7, 7 days a week.</p>
            <p class="info-text">Phone: +8801611112222</p>
          </div>
          <div class="divider"></div>
          <div class="info-card">
            <div class="icon-wrapper">
              <i class="fas fa-envelope"></i>
            </div>
            <h3 class="info-title">Write To Us</h3>
            <p class="info-text">Fill out our form and we will contact you within 24 hours.</p>
            <p class="info-text">Emails: customer@exclusive.com</p>
            <p class="info-text">Emails: support@exclusive.com</p>
          </div>
        </div>
        <div class="contact-form-section">
          <form @submit.prevent="submitForm">
            <div class="form-row">
              <input type="text" placeholder="Your Name *" v-model="form.name" required />
              <input type="email" placeholder="Your Email *" v-model="form.email" required />
              <input type="tel" placeholder="Your Phone *" v-model="form.phone" required />
            </div>
            <div class="form-row">
              <textarea placeholder="Your Message" rows="8" v-model="form.message"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="send-message-btn">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const submitForm = () => {
  console.log('Form submitted:', form.value);
  // Add form submission logic here
  alert('Message sent successfully!');
  // Reset form
  form.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
};
</script>

<style scoped>
.contact-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 80px 0;
  color: #000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 80px;
  color: #a0a0a0;
}

.breadcrumb a {
  text-decoration: none;
  color: #000;
  margin-right: 8px;
}

.breadcrumb span {
  color: #a0a0a0;
}

.contact-layout {
  display: flex;
  gap: 30px;
}

.contact-info-section {
  flex: 0 0 400px;
  padding: 40px 35px;
  box-shadow: 0 1px 13px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.info-card {
  margin-bottom: 24px;
}

.icon-wrapper {
  background-color: #db4444;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.icon-wrapper i {
  color: #fff;
  font-size: 20px;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.info-text {
  font-size: 14px;
  color: #000000;
  line-height: 1.5;
  opacity: 0.5;
  margin-bottom: 8px;
}

.divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  margin: 32px 0;
}

.contact-form-section {
  flex: 1;
  padding: 40px 35px;
  box-shadow: 0 1px 13px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.contact-form-section input,
.contact-form-section textarea {
  width: 100%;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: #000;
  outline: none;
}

.contact-form-section input::placeholder,
.contact-form-section textarea::placeholder {
  color: #a0a0a0;
  font-weight: 400;
}

.contact-form-section textarea {
  resize: none;
  height: 180px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.send-message-btn {
  background-color: #db4444;
  color: #fff;
  border: none;
  padding: 16px 48px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-message-btn:hover {
  background-color: #c73e3e;
}

@media (max-width: 768px) {
  .contact-layout {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 32px;
  }
}
</style>