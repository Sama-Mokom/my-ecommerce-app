<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h2>Create Account</h2>
        <p>Join us today! It's quick and easy.</p>
      </div>

      <form @submit.prevent="handleSignup" class="signup-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            type="text"
            v-model="formData.name"
            :disabled="authStore.isLoading"
            required
            placeholder="Enter your full name"
            autocomplete="name"
          />
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            :disabled="authStore.isLoading"
            required
            placeholder="Enter your email"
            autocomplete="email"
          />
          <small v-if="emailError" class="field-error">{{ emailError }}</small>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              :disabled="authStore.isLoading"
              required
              placeholder="Create a password"
              autocomplete="new-password"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              :disabled="authStore.isLoading"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <small v-if="passwordError" class="field-error">{{ passwordError }}</small>
          <div class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrength.class"
                :style="{ width: passwordStrength.width }"
              ></div>
            </div>
            <small class="strength-text">{{ passwordStrength.text }}</small>
          </div>
        </div>

        <!-- Terms and Privacy -->
        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="acceptTerms"
              :disabled="authStore.isLoading"
              required
            />
            <span class="checkmark"></span>
            I agree to the 
            <a href="/terms" target="_blank" class="terms-link">Terms of Service</a> 
            and 
            <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>
          </label>
        </div>

        <!-- Error Display -->
        <div v-if="authStore.error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ authStore.error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="signup-button"
          :disabled="authStore.isLoading || !isFormValid"
        >
          <span v-if="authStore.isLoading" class="loading-spinner"></span>
          {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="divider">
        <span>or</span>
      </div>

      <!-- Social Signup (Optional - for future implementation) -->
      <div class="social-signup">
        <button class="social-button google" disabled>
          <i class="fab fa-google"></i>
          Sign up with Google
        </button>
      </div>

      <!-- Login Link -->
      <div class="login-link">
        <p>Already have an account? 
          <router-link to="/signin" class="login-link-text">
            Sign in here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore, authActions } from '/stores/auth.js';

const router = useRouter();

// Form data
const formData = ref({
  name: '',
  email: '',
  password: ''
});

const showPassword = ref(false);
const acceptTerms = ref(false);

// Field-specific errors
const emailError = ref('');
const passwordError = ref('');

// Computed properties
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && 
         formData.value.email.trim() !== '' && 
         formData.value.password.trim() !== '' && 
         acceptTerms.value &&
         !emailError.value &&
         !passwordError.value;
});

const passwordStrength = computed(() => {
  const password = formData.value.password;
  const length = password.length;
  
  if (length === 0) {
    return { width: '0%', class: '', text: '' };
  }
  
  let score = 0;
  let feedback = [];
  
  // Length check
  if (length >= 8) score += 1;
  else feedback.push('at least 8 characters');
  
  // Complexity checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('uppercase letter');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('number');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('special character');
  
  const strengthLevels = [
    { width: '20%', class: 'very-weak', text: 'Very Weak' },
    { width: '40%', class: 'weak', text: 'Weak' },
    { width: '60%', class: 'fair', text: 'Fair' },
    { width: '80%', class: 'good', text: 'Good' },
    { width: '100%', class: 'strong', text: 'Strong' }
  ];
  
  return strengthLevels[Math.min(score, 4)];
});

// Watchers for real-time validation
watch(() => formData.value.email, (newEmail) => {
  if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
  }
});

watch(() => formData.value.password, (newPassword) => {
  if (newPassword && newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long';
  } else {
    passwordError.value = '';
  }
});

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSignup = async () => {
  if (!isFormValid.value) {
    return;
  }

  try {
    authActions.clearError();
    const result = await authActions.register(formData.value);
    
    console.log('Registration successful:', result);
    
    // Show success message or redirect
    router.push('/');
    
  } catch (error) {
    console.error('Registration failed:', error);
    // Error is already set in authStore by authActions.register
  }
};

// Clear any existing errors when component mounts
onMounted(() => {
  authActions.clearError();
});
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.signup-header {
  text-align: center;
  margin-bottom: 32px;
}

.signup-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.signup-header p {
  color: #666;
  font-size: 16px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
}

.password-toggle:hover {
  background: #f0f0f0;
}

.field-error {
  color: #d63384;
  font-size: 12px;
  margin-top: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.very-weak {
  background: #dc3545;
}

.strength-fill.weak {
  background: #fd7e14;
}

.strength-fill.fair {
  background: #ffc107;
}

.strength-fill.good {
  background: #20c997;
}

.strength-fill.strong {
  background: #28a745;
}

.strength-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: #667eea;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #d63384;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #d63384;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.signup-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.signup-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.signup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #666;
  font-size: 14px;
}

.social-signup {
  margin-bottom: 24px;
}

.social-button {
  width: 100%;
  padding: 12px 24px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.social-button:hover:not(:disabled) {
  border-color: #bbb;
  background: #f9f9f9;
}

.social-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-button.google {
  color: #db4437;
}

.login-link {
  text-align: center;
}

.login-link p {
  color: #666;
  font-size: 16px;
}

.login-link-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link-text:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-card {
    padding: 24px;
    margin: 10px;
  }
  
  .signup-header h2 {
    font-size: 24px;
  }
}
</style>