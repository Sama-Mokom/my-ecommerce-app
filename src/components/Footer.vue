<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-column">
        <h3>Exclusive</h3>
        <h4>Subscribe</h4>
        <p>Get 10% off your first order</p>
        <form class="newsletter" @submit.prevent>
          <input type="email" placeholder="Enter your email" />
          <button type="submit"><i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
      <div class="footer-column">
        <h3>Support</h3>
        <p>111 Bijoy sarani,<br />Dhaka, DH 1515,<br />Bangladesh.</p>
        <p>exclusive@gmail.com</p>
        <p>+88015-88888-9999</p>
      </div>
      <div class="footer-column">
        <h3>Account</h3>
        <ul>
          <li v-for="link in accountLinks" :key="link.text">
            <a :href="link.href">{{ link.text }}</a>
          </li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Quick Link</h3>
        <ul>
          <li v-for="link in quickLinks" :key="link.text">
            <a :href="link.href">{{ link.text }}</a>
          </li>
        </ul>
      </div>
      <div class="footer-column app-downloads">
        <div class="download-app">
          <div class="download-text">
            <h3>Download App</h3>
            <p>Save $3 with App New User Only</p>
          </div>
          <div class="app-row">
            <div class="qr-code">
              <img src="/src/assets/images/Qrcode 1.png" alt="QR Code" />
            </div>
            <div class="app-links">
              <a v-for="app in appLinks" :key="app.alt" :href="app.href" target="_blank" rel="noopener">
                <img :src="app.img" :alt="app.alt" />
              </a>
            </div>
          </div>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>

      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>© Copyright Rimel 2022. All right reserved</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
const accountLinks = ref([
  { text: 'My Account', href: '#' },
  { text: 'Login / Register', href: '#' },
  { text: 'Cart', href: '#' },
  { text: 'Wishlist', href: '#' },
  { text: 'Shop', href: '#' },
]);
const quickLinks = ref([
  { text: 'Privacy Policy', href: '#' },
  { text: 'Terms Of Use', href: '#' },
  { text: 'FAQ', href: '#' },
  { text: 'Contact', href: '#' },
]);
const appLinks = ref([
  {
    img: "/src/assets/images/download-appstore.png",
    alt: 'Google Play',
    href: 'https://play.google.com/store',
  },
  {
    img: "/src/assets/images/png-transparent-google-play-store-logo-google-play-app-store-android-wallets-text-label-logo.png",
    alt: 'App Store',
    href: 'https://www.apple.com/app-store/',
  },
]);
</script>

<style scoped>
/* .footer {
  background: #000;
  color: #fff;
  padding-top: 40px;
  position: relative;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}
.footer-column {
  flex: 1 1 180px;
  min-width: 180px;
  margin-bottom: 30px;
}
.footer-column h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 18px;
}
.footer-column h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}
.footer-column p {
  font-size: 16px;
  margin-bottom: 12px;
}
.footer-column ul {
  list-style: none;
  padding: 0;
}
.footer-column ul li {
  margin-bottom: 10px;
}
.footer-column ul li a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}
.footer-column ul li a:hover {
  color: #db4444;
}
.newsletter {
  display: flex;
  align-items: center;
  border: 1px solid #fff;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}
.newsletter input {
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px;
  flex: 1;
  font-size: 16px;
  outline: none;
}
.newsletter input::placeholder {
  color: #ccc;
}
.newsletter button {
  background: none;
  border: none;
  color: #fff;
  padding: 0 16px;
  cursor: pointer;
  font-size: 18px;
}
.app-downloads .app-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}
.qr-code img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
}
.app-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.app-links img {
  width: 120px;
  height: 36px;
  object-fit: contain;
  background: #fff;
  border-radius: 6px;
}
.social-links {
  display: flex;
  gap: 16px;
  margin-top: 18px;
}
.social-links a {
  color: #fff;
  font-size: 22px;
  transition: color 0.2s;
}
.social-links a:hover {
  color: #db4444;
}
.footer-bottom {
  background: #111;
  padding: 18px 0 10px 0;
  margin-top: 30px;
  text-align: center;
}
.footer-bottom p {
  color: #fff;
  font-size: 15px;
  margin: 0;
}
@media (max-width: 1024px) {
  .footer-content {
    flex-direction: column;
    gap: 0;
  }
  .footer-column {
    margin-bottom: 24px;
  }
} */
</style>