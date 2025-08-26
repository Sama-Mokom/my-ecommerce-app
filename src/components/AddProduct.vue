<template>
  <div class="product-management">
    <div class="container">
      <div class="section-header">
        <div class="red-bar"></div>
        <span class="section-label">Admin</span>
      </div>
      <h2 class="section-title">Add New Product</h2>
      
      <div class="form-container">
        <form @submit.prevent="submitProduct" class="product-form">
          <!-- Product Image Upload -->
          <div class="form-group">
            <label for="product-image" class="form-label">Product Image</label>
            <div class="image-upload-container">
              <input 
                type="file" 
                id="product-image" 
                ref="fileInput"
                accept="image/*" 
                @change="handleImageUpload" 
                class="image-input"
              />
              <div 
                class="image-preview" 
                :class="{ 'has-image': imagePreview }"
                @click="$refs.fileInput.click()"
              >
                <img v-if="imagePreview" :src="imagePreview" alt="Product preview" class="preview-image" />
                <div v-else class="upload-placeholder">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload product image</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div class="form-group">
            <label for="product-name" class="form-label">Product Name</label>
            <input
              id="product-name"
              v-model="productData.name"
              type="text"
              placeholder="Enter product name"
              class="form-input"
              required
            />
          </div>

          <!-- Product Details Grid -->
          <div class="form-grid">
            <!-- Price -->
            <div class="form-group">
              <label for="product-price" class="form-label">Price ($)</label>
              <input
                id="product-price"
                v-model="productData.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input"
                required
              />
            </div>

            <!-- Original Price -->
            <div class="form-group">
              <label for="original-price" class="form-label">Original Price ($)</label>
              <input
                id="original-price"
                v-model="productData.originalPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="form-input"
              />
            </div>

            <!-- Discount -->
            <div class="form-group">
              <label for="product-discount" class="form-label">Discount (%)</label>
              <input
                id="product-discount"
                v-model="productData.discount"
                type="number"
                min="0"
                max="90"
                placeholder="0"
                class="form-input"
              />
            </div>

            <!-- Rating -->
            <div class="form-group">
              <label for="product-rating" class="form-label">Rating</label>
              <input
                id="product-rating"
                v-model="productData.rating"
                type="number"
                step="1"
                min="0"
                max="5"
                placeholder="4.5"
                class="form-input"
              />
            </div>

            <!-- Rating Count -->
            <div class="form-group">
              <label for="rating-count" class="form-label">Rating Count</label>
              <input
                id="rating-count"
                v-model="productData.ratingCount"
                type="number"
                min="0"
                placeholder="0"
                class="form-input"
              />
            </div>

            <!-- Section -->
            <div class="form-group">
              <label for="product-section" class="form-label">Section</label>
              <select
                id="product-section"
                v-model="productData.section"
                class="form-input"
                required
              >
                <option value="" disabled selected>Select section</option>
                <option value="flash-sales">Flash Sales</option>
                <option value="best-selling">Best Selling</option>
                <option value="explore">Explore</option>
              </select>
            </div>

            <!-- Is New -->
            <div class="form-group">
              <label class="form-label">New Product</label>
              <div class="checkbox-container">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="productData.isNew"
                    class="checkbox-input"
                  />
                  <span class="checkbox-custom"></span>
                  Mark as new arrival
                </label>
              </div>
            </div>
          </div>

          <!-- Category Selection -->
          <div class="form-group">
            <label class="form-label">Category</label>
            <div class="category-selection">
              <div 
                v-for="category in availableCategories" 
                :key="category.value"
                class="category-option"
                :class="{ selected: productData.category === category.value }"
                @click="selectCategory(category.value)"
              >
                <i :class="category.icon"></i>
                <span>{{ category.label }}</span>
              </div>
            </div>
            <div class="selected-category" v-if="productData.category">
              Selected: {{ getCategoryLabel(productData.category) }}
            </div>
          </div>

          <!-- Colors -->
          <div class="form-group">
            <label class="form-label">Colors</label>
            <div class="color-selection">
              <div 
                v-for="color in availableColors" 
                :key="color"
                class="color-option"
                :class="{ selected: productData.colors.includes(color) }"
                :style="{ backgroundColor: color }"
                @click="toggleColor(color)"
              ></div>
            </div>
            <div class="selected-colors" v-if="productData.colors.length">
              Selected: {{ productData.colors.join(', ') }}
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-button"
            :disabled="isSubmitting || !productData.category"
          >
            <span v-if="isSubmitting" class="loading-spinner"></span>
            {{ isSubmitting ? 'Adding Product...' : 'Add Product' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '../services/api.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const availableColors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

const availableCategories = [
  { value: 'Electronics', label: 'Electronics', icon: 'fas fa-laptop' },
  { value: 'Clothing', label: 'Clothing', icon: 'fas fa-tshirt' },
  { value: 'Furniture', label: 'Home & Kitchen', icon: 'fas fa-home' },
  { value: 'Cosmetics', label: 'Beauty', icon: 'fas fa-spa' },
  { value: 'Sports', label: 'Sports', icon: 'fas fa-basketball-ball' },
  { value: 'Books', label: 'Books', icon: 'fas fa-book' },
  { value: 'Kids', label: 'Toys', icon: 'fas fa-gamepad' },
  { value: 'jewelry', label: 'Jewelry', icon: 'fas fa-gem' }
];

const productData = ref({
  name: '',
  price: '',
  originalPrice: '',
  discount: '',
  rating: '',
  ratingCount: '',
  category: '',
  section: '',
  isNew: false,
  colors: []
});

const getCategoryLabel = (categoryValue) => {
  const category = availableCategories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
};

const selectCategory = (category) => {
  productData.value.category = category;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select an image file';
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 5MB';
      return;
    }
    
    imageFile.value = file;
    errorMessage.value = '';
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const toggleColor = (color) => {
  const index = productData.value.colors.indexOf(color);
  if (index === -1) {
    productData.value.colors.push(color);
  } else {
    productData.value.colors.splice(index, 1);
  }
};

const resetForm = () => {
  productData.value = {
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    rating: '',
    ratingCount: '',
    category: '',
    section: '',
    isNew: false,
    colors: []
  };
  imageFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const submitProduct = async () => {
  if (!imageFile.value) {
    errorMessage.value = 'Please select a product image';
    return;
  }

  if (!productData.value.category) {
    errorMessage.value = 'Please select a product category';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Prepare form data
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData.value).forEach(key => {
      if (key === 'colors') {
        formData.append(key, JSON.stringify(productData.value[key]));
      } else {
        formData.append(key, productData.value[key]);
      }
    });
    
    // Append image file
    formData.append('image', imageFile.value);

    // Call API
    const response = await apiService.postProduct(formData, imageFile.value);
    
    successMessage.value = 'Product added successfully!';
    toast.success('Product added successfully!', {
      position: 'top-right',
      timeout: 3000,
      icon: '✅'
    });
    
    // Reset form after successful submission
    setTimeout(() => {
      resetForm();
    }, 2000);
    
  } catch (error) {
    console.error('Error adding product:', error);
    errorMessage.value = error.message || 'Failed to add product. Please try again.';
    toast.error(errorMessage.value, {
      position: 'top-right',
      timeout: 3000,
      icon: '❌'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.product-management {
  padding: 60px 20px;
  background-color: #ffffff;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.red-bar {
  width: 20px;
  height: 40px;
  background-color: #db4444;
  border-radius: 4px;
  margin-right: 16px;
}

.section-label {
  color: #db4444;
  font-weight: 600;
  font-size: 16px;
}

.section-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #000000;
}

.form-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 500;
  color: #000000;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #db4444;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Image Upload Styles */
.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-input {
  display: none;
}

.image-preview {
  width: 200px;
  height: 200px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.image-preview:hover {
  border-color: #db4444;
}

.image-preview.has-image {
  border-style: solid;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  text-align: center;
  color: #666666;
}

.upload-placeholder i {
  font-size: 32px;
  margin-bottom: 8px;
  color: #db4444;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
}

/* Category Selection */
.category-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.category-option:hover {
  border-color: #db4444;
  transform: translateY(-2px);
}

.category-option.selected {
  border-color: #db4444;
  background-color: #fff5f5;
  transform: translateY(-2px);
}

.category-option i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #666666;
}

.category-option.selected i {
  color: #db4444;
}

.category-option span {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
}

.selected-category {
  margin-top: 8px;
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

/* Color Selection */
.color-selection {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #db4444;
  transform: scale(1.1);
}

.selected-colors {
  margin-top: 8px;
  font-size: 14px;
  color: #666666;
}

/* Checkbox Styles */
.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #db4444;
  border-color: #db4444;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Messages */
.error-message {
  background-color: #fee;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #c53030;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background-color: #f0fff4;
  color: #2d7d32;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid #2d7d32;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Submit Button */
.submit-button {
  background-color: #db4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;
  min-width: 150px;
}

.submit-button:hover:not(:disabled) {
  background-color: #c73e3e;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-management {
    padding: 40px 15px;
  }
  
  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .form-container {
    padding: 30px 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .category-selection {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .image-preview {
    width: 150px;
    height: 150px;
  }
  
  .color-selection {
    gap: 8px;
  }
  
  .color-option {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .product-management {
    padding: 30px 10px;
  }
  
  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .form-container {
    padding: 20px 15px;
  }
  
  .category-selection {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .image-preview {
    width: 120px;
    height: 120px;
  }
  
  .submit-button {
    width: 100%;
    align-self: stretch;
  }
}
</style>