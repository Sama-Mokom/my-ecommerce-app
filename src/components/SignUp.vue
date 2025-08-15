<template>
  <div class="signup-container">
    <div class="signup-content">
      <!-- Left side of the page which displays an illustration image -->
      <div class="illustration-section">
        <div class="illustration-wrapper">
          <img
            src="../assets/images/signup-illustration.png"
            alt="Shopping illustration"
            class="illustration-image"
          />
        </div>
      </div>

      <!-- Right side of signup page housing the Form -->
      <div class="form-section">
        <div class="form-wrapper">
          <h1 class="form-title">Create an account</h1>
          <p class="form-subtitle">Enter your details below</p>

          <form @submit.prevent="signUp" class="signup-form">
            <!-- Name Field -->
            <div class="input-group">
              <input
                id="name"
                v-model="formData.name"
                :disabled="authStore.isLoading"
                type="text"
                placeholder="Enter your full name"
                autocomplete="name"
                class="form-input"
              />
            </div>
            <!-- Email Field -->
            <div class="input-group">
              <input
                id="email"
                v-model="formData.email"
                :disabled="authStore.isLoading"
                type="email"
                placeholder="Enter your Email"
                autocomplete="email"
                class="form-input"
              />
            </div>
            <!-- Password Field -->
            <div class="input-group">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :disabled="authStore.isLoading"
                placeholder="Password"
                autocomplete="password"
                class="form-input"
              />
              <button
                type="button"
                @click="togglePasswordVisibilty"
                class="password-toggle"
                :disabled="authStore.isLoading"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
            <!-- Error Display -->
            <div v-if="authStore.error" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ authStore.error }}
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              class="create-account-btn"
              :disabled="authStore.isLoading || !isFormValid"
            >
              <span v-if="authStore.isLoading" class="loading-spinner"></span>
              {{
                authStore.isLoading ? "Creating Account..." : "Create Account"
              }}
            </button>

            <button
              type="button"
              class="google-signup-btn"
              @click="signUpWithGoogle"
            >
              <svg
                class="google-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            <p class="login-link">
              Already have account?
              <RouterLink to="SignIn" class="login-link-text"
                >Log in</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
// import apiService from "../services/api";
import { RouterLink, useRouter } from "vue-router";
import { authActions, authStore, isAuthenticated } from "../../stores/auth";

// import axios from "axios";

const router = useRouter();

const formData = ref({
  name: "",
  email: "",
  password: "",
});

const showPassword = ref(false);
const emailError = ref("");
const passwordError = ref("");

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== "" &&
    formData.value.email.trim() !== "" &&
    formData.value.password.trim() !== "" &&
    !emailError.value &&
    !passwordError.value
  );
});

// Watchers for real-time validation
watch(
  () => formData.value.email,
  (newEmail) => {
    if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      emailError.value = "Please enter a valid email address";
    } else {
      emailError.value = "";
    }
  }
);

watch(
  () => formData.value.password,
  (newPassword) => {
    if (newPassword && newPassword.length < 8) {
      passwordError.value = "Password must be at least 8 characters long";
    } else {
      passwordError.value = "";
    }
  }
);

// Methods
const togglePasswordVisibilty = () => {
  showPassword.value = !showPassword.value;
};

const signUp = async () => {
  if (!isFormValid) {
    return;
  }

  try {
    authActions.clearError();
    const response = await authActions.register(formData.value);
    if (response) {
      console.log("Signup sucessful, redirecting to homepage");
      alert("Signup sucessful. Redirecting to home page");
      router.push({ name: "HomeView" });
    }
  } catch (err) {
    console.error("Registration error: ", err);
    alert(`Signupfailed: ${err.message}`);
  }
};

const signUpWithGoogle = () => {
  console.log("Sign up with Google clicked");
  // Handle Google sign up logic here
};

// const goToLogin = () => {
//   console.log("Go to login clicked");
//   router.push('/signin');
// };

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
  /* padding: 20px; */
  padding-top: 50px;
  padding-bottom: 110px;
  background-color: #ffffff;
}

.signup-content {
  display: flex;
  max-width: 1500px;
  width: 100%;
  min-height: 600px;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); */
  /* border-radius: 8px; */
  overflow: hidden;
}

.illustration-section {
  flex: 1;
  background: #cbe4e8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.illustration-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Fallback illustration using CSS if image is not available */
/* .illustration-section::before {
  content: '🛒📱🛍️';
  font-size: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.8;
} */

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #ffffff;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 36px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
  line-height: 1.2;
}

.form-subtitle {
  font-size: 16px;
  color: #666666;
  margin-bottom: 25px;
  font-weight: 400;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 16px 0;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  font-size: 16px;
  background: transparent;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-bottom-color: #db4444;
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

.form-input::placeholder {
  color: #999999;
  font-weight: 400;
}

.create-account-btn {
  width: 100%;
  padding: 16px;
  background-color: #db4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 16px;
}

.create-account-btn:hover {
  background-color: #c73e3e;
}

.google-signup-btn {
  width: 100%;
  padding: 16px;
  background-color: white;
  color: #666666;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.google-signup-btn:hover {
  background-color: #f8f9fa;
  border-color: #dadce0;
}

.google-icon {
  flex-shrink: 0;
}

.login-link {
  text-align: center;
  font-size: 16px;
  color: #666666;
  margin-top: 8px;
}

.login-link-text {
  color: #000000;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-link-text:hover {
  color: #db4444;
}

/* Responsive Design */
@media (max-width: 768px) {
  .signup-content {
    flex-direction: column;
    max-width: 100%;
    min-height: auto;
  }

  .illustration-section {
    min-height: 200px;
    padding: 20px;
  }

  .illustration-section::before {
    font-size: 80px;
  }

  .form-section {
    padding: 20px;
  }

  .form-title {
    font-size: 28px;
  }

  .form-subtitle {
    margin-bottom: 32px;
  }
}

@media (max-width: 480px) {
  .signup-container {
    padding: 10px;
  }

  .form-section {
    padding: 20px 15px;
  }

  .form-title {
    font-size: 24px;
  }
}
</style>
