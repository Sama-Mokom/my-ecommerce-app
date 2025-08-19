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
          <li v-for="(link, i) in accountLinks"
          :key="i"
          class="nav-link">
          <router-link :to="link.to">{{ link.text }}</router-link>
            <!-- <a :href="link.href">{{ link.text }}</a> -->
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
        <p>© Copyright Rimel 2025. All right reserved</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
const accountLinks = ref([
  { text: 'My Account', to: '/account' },
  { text: 'Login / Register', to: 'signin' },
  { text: 'Cart', to: '/cart' },
  { text: 'Wishlist', to: '/wishlist' },
  { text: 'Shop', to: '/shop' },
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
    href: 'https://www.apple.com/app-store/',
  },
  {
    img: "/src/assets/images/png-transparent-google-play-store-logo-google-play-app-store-android-wallets-text-label-logo.png",
    alt: 'App Store',
    href: 'https://play.google.com/store',
  },
]);
</script>

<style scoped>


/* Footer */
.footer {
  background: #000;
  color: #fff;
  padding: 80px 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 50px;
  margin-bottom: 60px;
}

.footer-column h3 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
}

.footer-column h4 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
}

.footer-column p {
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 8px;
  opacity: 0.7;
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 16px;
}

.footer-column ul li a {
  color: #fff;
  text-decoration: none;
  opacity: 0.7;
}

.footer-column ul li a:hover {
  opacity: 1;
}
.app-row {
  display: inline;
}
.newsletter {
  display: flex;
  border: 1.5px solid #fff;
  border-radius: 4px;
  overflow: hidden;
}

.newsletter input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #fff;
  outline: none;
}

.newsletter input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter button {
  background: transparent;
  border: none;
  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
}

.app-downloads {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.qr-code img {
  width: 80px;
  height: 80px;
}

.app-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-links img {
  width: 110px;
  height: 40px;
}

.social-links {
  display: flex;
  gap: 24px;
}

.social-links a {
  color: #fff;
  font-size: 24px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  text-align: center;
  opacity: 0.6;
}


</style>