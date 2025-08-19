<template>
  <div class="account-container">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <router-link to="/">Home</router-link> /
      <span>My Account</span>
    </div>

    <!-- Welcome Message -->
    <div class="welcome-section">
      <span class="welcome-text">Welcome!</span>
      <span class="user-name">{{ userName }}</span>
    </div>

    <div class="account-content">
      <!-- Sidebar Navigation -->
      <div class="account-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">Manage My Account</h3>
          <ul class="sidebar-menu">
            <li>
              <a href="#" @click.prevent="setActiveSection('profile')" 
                 :class="{ active: activeSection === 'profile' }">
                My Profile
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setActiveSection('address')" 
                 :class="{ active: activeSection === 'address' }">
                Address Book
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setActiveSection('payment')" 
                 :class="{ active: activeSection === 'payment' }">
                My Payment Options
              </a>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">My Orders</h3>
          <ul class="sidebar-menu">
            <li>
              <a href="#" @click.prevent="setActiveSection('returns')" 
                 :class="{ active: activeSection === 'returns' }">
                My Returns
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="setActiveSection('cancellations')" 
                 :class="{ active: activeSection === 'cancellations' }">
                My Cancellations
              </a>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-title">My WishList</h3>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="account-main">
        <!-- Profile Section (Default) -->
        <div v-if="activeSection === 'profile'" class="profile-section">
          <h2 class="section-title">Edit Your Profile</h2>
          
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="profileData.firstName"
                  placeholder="Md"
                />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="profileData.lastName"
                  placeholder="Rimel"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="profileData.email"
                  placeholder="rimel1111@gmail.com"
                />
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input
                  type="text"
                  id="address"
                  v-model="profileData.address"
                  placeholder="Kingston, 5236, United State"
                />
              </div>
            </div>

            <div class="password-section">
              <h3>Password Changes</h3>
              <div class="form-group">
                <input
                  type="password"
                  v-model="passwordData.current"
                  placeholder="Current Password"
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="passwordData.new"
                  placeholder="New Password"
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="passwordData.confirm"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-cancel" @click="cancelChanges">
                Cancel
              </button>
              <button type="submit" class="btn btn-save" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Other sections (placeholders for now) -->
        <div v-else-if="activeSection === 'address'" class="section-content">
          <h2 class="section-title">Address Book</h2>
          <p>Manage your delivery addresses here.</p>
        </div>

        <div v-else-if="activeSection === 'payment'" class="section-content">
          <h2 class="section-title">My Payment Options</h2>
          <p>Manage your payment methods here.</p>
        </div>

        <div v-else-if="activeSection === 'returns'" class="section-content">
          <h2 class="section-title">My Returns</h2>
          <p>View your return history here.</p>
        </div>

        <div v-else-if="activeSection === 'cancellations'" class="section-content">
          <h2 class="section-title">My Cancellations</h2>
          <p>View your cancelled orders here.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../../stores/auth';
import apiService from '../services/api.js';

const router = useRouter();

// Reactive data
const activeSection = ref('profile');
const isSaving = ref(false);

// Profile form data
const profileData = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: ''
});

// Password change data
const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
});

// Computed properties
const userName = computed(() => {
  if (authStore.user?.name) {
    return authStore.user.name;
  }
  return `${profileData.value.firstName} ${profileData.value.lastName}`.trim() || 'User';
});

// Methods
const setActiveSection = (section) => {
  activeSection.value = section;
};

const loadUserData = async () => {
  try {
    const userData = await apiService.getCurrentUser();
    
    // Split name if it exists
    const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
    profileData.value = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: userData.email || '',
      address: userData.address || ''
    };
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

const saveProfile = async () => {
  isSaving.value = true;
  
  try {
    // Validate password fields if any password field is filled
    if (passwordData.value.current || passwordData.value.new || passwordData.value.confirm) {
      if (!passwordData.value.current) {
        throw new Error('Current password is required to change password');
      }
      if (passwordData.value.new !== passwordData.value.confirm) {
        throw new Error('New passwords do not match');
      }
      if (passwordData.value.new.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }
    }

    // Prepare update data
    const updateData = {
      name: `${profileData.value.firstName} ${profileData.value.lastName}`.trim(),
      email: profileData.value.email,
      address: profileData.value.address
    };

    // Add password fields if they're being changed
    if (passwordData.value.new) {
      updateData.currentPassword = passwordData.value.current;
      updateData.newPassword = passwordData.value.new;
    }

    // TODO: Implement API call to update user profile
    console.log('Updating profile:', updateData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Profile updated successfully!');
    
    // Clear password fields after successful update
    passwordData.value = {
      current: '',
      new: '',
      confirm: ''
    };

  } catch (error) {
    console.error('Error saving profile:', error);
    alert(error.message || 'Failed to save changes. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

const cancelChanges = () => {
  // Reset form data
  loadUserData();
  passwordData.value = {
    current: '',
    new: '',
    confirm: ''
  };
};

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  if (!authStore.user) {
    router.push('/signin');
    return;
  }
  
  loadUserData();
});
</script>

<style scoped>
.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.breadcrumb {
  margin-bottom: 20px;
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

.welcome-section {
  text-align: right;
  margin-bottom: 30px;
}

.welcome-text {
  color: #666;
  margin-right: 5px;
}

.user-name {
  color: #db4444;
  font-weight: 500;
}

.account-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.account-sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* .sidebar-section {
  
} */

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #000;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 8px;
}

.sidebar-menu a {
  display: block;
  padding: 8px 0;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.sidebar-menu a:hover,
.sidebar-menu a.active {
  color: #db4444;
}

.account-main {
  background: white;
  padding: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #db4444;
  margin-bottom: 25px;
}

.profile-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f5f5f5;
}

.form-group input:focus {
  outline: none;
  border-color: #db4444;
  background-color: white;
}

.form-group input::placeholder {
  color: #999;
}

.password-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.password-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.password-section .form-group {
  margin-bottom: 15px;
}

.password-section .form-group:last-child {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background: #db4444;
  color: white;
  padding: 12px 30px;
}

.btn-save:hover {
  background: #c73e3e;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.section-content {
  padding: 20px 0;
}

.section-content p {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    text-align: left;
  }

  .form-actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
  }
}
</style>