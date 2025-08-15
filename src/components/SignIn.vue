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
          <h1 class="form-title">Login to Exclusive</h1>
          <p class="form-subtitle">Enter your details below</p>

          <form @submit.prevent="login" class="signup-form">
            <!-- <div class="input-group">
              <input
                v-model="formData.name"
                type="text"
                placeholder="Name"
                class="form-input"
              />
            </div> -->

            <div class="input-group">
              <input
                v-model="formData.email"
                type="text"
                placeholder="Email or Phone Number"
                class="form-input"
              />
            </div>

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
            <div class="button-container">
              <button
                :disabled="authStore.isLoading || !isFormValid"
                type="submit"
                class="create-account-btn"
              >
                Login
              </button>

              <button
                type="button"
                class="google-signup-btn"
                @click="forgotPassword"
              >
                Forgot Password?
              </button>
            </div>

            <p class="login-link">
              Don't have an account?
              <RouterLink to="SignUp" class="login-link-text"
                >Sign Up</RouterLink
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
import { authActions, authStore } from "../../stores/auth";

const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});

const showPassword = ref(false);
const emailError = ref("");
const passwordError = ref("");

const isFormValid = computed(() => {
  return (
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


const togglePasswordVisibilty = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  //login logic will be put in here
  if (!isFormValid) {
    return;
  }

  try {
    authActions.clearError();
    const response = await authActions.login(formData.value);
    if (response) {
      console.log("Login sucessful, redirecting to homepage");
      alert("Login sucessful. Redirecting to home page");
      router.push({ name: "HomeView" });
    }
  } catch (err) {
    console.error("Login error: ", err);
    alert(`Login failed: ${err.message}`);
  }
};

const signUpWithGoogle = () => {
  console.log("Sign up with Google clicked");
};

const forgotPassword = () => {
  console.log("forgot password clicked");
  router.push("forgotpassword");
};

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
  padding-top: 50px;
  padding-bottom: 110px;
  background-color: #ffffff;
}

.signup-content {
  display: flex;
  max-width: 1500px;
  width: 100%;
  min-height: 600px;
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
.button-container {
  display: flex;
}

.create-account-btn {
  width: 143px;
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
  margin-top: 10px;
  width: 228px;
  padding: 16px;
  background-color: white;
  color: #999999;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* gap: 12px; */
  transition: all 0.2s ease;
}

.google-signup-btn:hover {
  color: #db4444;
  /* background-color: #f8f9fa;
  border-color: #dadce0; */
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
