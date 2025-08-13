import {reactive, computed} from 'vue';
import apiService from '../src/services/api';

export const authStore = reactive({
    user: null,
    isLoading: false,
    error: null
});

export const isAuthenticated = computed(() => !!authStore.user);

export const authActions = {
    async initAuth() {
        authStore.isLoading = true;
        authStore.error = null;

        try {
          // Try refreshing the token at first if no access token is found
          if (!apiService.getAccessToken()){
            console.log('No access token found, attempting token refresh...');
            try {
              await apiService.refreshToken();
            } catch (refreshError) {
              console.log('Token refresh failed, user needs to login');
              authStore.user = null;
              authStore.isLoading = false;
              return;
            }
          }
          const result = await apiService.getCurrentUser();
          authStore.user = result.user;
          console.log('Auth initialized successfully: ', result.user);

        } catch (error) {
        console.log('No valid session found', error.message);
        authStore.user = null;
        try { apiService.clearAccessToken(); } catch(_) {}
        } finally {
          authStore.isLoading = false;
        }
    },

    // Register a new user
    async register(formData){
        authStore.isLoading = true;
        authStore.error = null;

        try {
           const result = await apiService.postUser(formData);

          //  Check for response structure 
          const userData = result.user || {
            id: result.id,
            name: result.name,
            email: result.email
          };
           authStore.user = userData;
           await this.initAuth();
           console.log('Registration successful: ', userData);
           return result
        } catch (error) {
          authStore.error = error.message;
          console.error('Registration failed: ', error);
          throw error;
        } finally {
            authStore.isLoading = false;
        }
    },

    // Login user
    async login(credentials){
        authStore.isLoading = true;
        authStore.error = null;

        try {
           const result = await apiService.loginUser(credentials);
           authStore.user = result.user;
           console.log('Login successful: ', result.user);

          //  first initialize auth to verify the token is working
           await this.initAuth();
           return result;
        } catch(error) {
          authStore.error = error.message;
          console.error('Login failed: ', error);
          throw error;
        } finally {
          authStore.isLoading = false;
        }
    },

    // Logout user
    async logout() {
        authStore.isLoading = true;
        authStore.error = null;

        try {
          await apiService.logout();
          authStore.user = null;
          console.log('Logout successful');
        } catch (error) {
          console.error('Logout error: ', error)
          //even if logout request fails, user state is still cleared
          authStore.user = null;
        } finally {
            authStore.isLoading = false;
        }
    },
    clearError() {
        authStore.error = null;
    },

    // Update user profile, for actions such as changing password or updating email address or phone number. Commented out for now, I'll use it later on down the line
    // updateUser(userData) {
    //     if (authStore.user){
    //         authStore.user = {...authStore.user, ...userData }
    //     }
    // }
};