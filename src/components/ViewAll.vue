<template>
  <div class="all-products-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <router-link to="/" class="breadcrumb-item">Home</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item current">All Products</span>
      <span v-if="selectedCategory" class="breadcrumb-separator">/</span>
      <span v-if="selectedCategory" class="breadcrumb-item current">{{ selectedCategory }}</span>
    </nav>

    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="section-title">
          <div class="red-bar"></div>
          <span class="section-label">Our Products</span>
        </div>
        <h1 class="page-title">
          {{ selectedCategory ? `${selectedCategory} Products` : 'All Products' }}
        </h1>
        <p class="page-subtitle">
          {{ selectedCategory ? `Explore our ${selectedCategory.toLowerCase()} collection` : 'Discover our complete product collection' }}
        </p>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search products..."
              class="search-input"
            />
          </div>
        </div>

        <div class="filter-options">
          <!-- Category Filter -->
          <div class="filter-group">
            <label class="filter-label">Category:</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Section Filter -->
          <div class="filter-group">
            <label class="filter-label">Section:</label>
            <select v-model="selectedSection" class="filter-select">
              <option value="">All Sections</option>
              <option value="flash-sales">Flash Sales</option>
              <option value="best-selling">Best Selling</option>
              <option value="explore">New Arrivals</option>
            </select>
          </div>

          <!-- Sort Options -->
          <div class="filter-group">
            <label class="filter-label">Sort by:</label>
            <select v-model="sortBy" class="filter-select">
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              :class="['view-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              :class="['view-btn', { active: viewMode === 'list' }]"
              @click="viewMode = 'list'"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-info">
        <p class="results-count">
          Showing {{ filteredProducts.length }} of {{ totalProducts }} products
        </p>
        <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
          <i class="fas fa-times"></i> Clear Filters
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>{{ error }}</p>
        <button @click="fetchProducts" class="retry-btn">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>

      <!-- No Products State -->
      <div v-else-if="filteredProducts.length === 0" class="no-products">
        <div class="no-products-icon">
          <i class="fas fa-box-open"></i>
        </div>
        <h3>No products found</h3>
        <p v-if="hasActiveFilters">
          Try adjusting your filters or search terms
        </p>
        <p v-else>
          No products are currently available
        </p>
      </div>

      <!-- Products Grid/List -->
      <div v-else :class="['products-container', viewMode]">
        <TransitionGroup name="product-fade" tag="div" :class="['products-grid', viewMode]">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            :class="['product-wrapper', viewMode]"
          >
            <ProductCard
              :product="product"
              :view-mode="viewMode"
              :show-add-to-cart="true"
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Pagination -->
      <div v-if="filteredProducts.length > productsPerPage" class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="pagination-btn prev"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="pagination-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pagination-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="pagination-btn next"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Back to Top Button -->
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="back-to-top"
        aria-label="Back to top"
      >
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from './ProductCard.vue';
import apiService from '../services/api.js';

const route = useRoute();
const router = useRouter();

// Reactive data
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedSection = ref('');
const sortBy = ref('name');
const viewMode = ref('grid');
const currentPage = ref(1);
const productsPerPage = ref(12);
const showBackToTop = ref(false);

// Fetch products
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiService.getAllProducts();
    products.value = response.products || [];

    console.log(`Successfully loaded ${products.value.length} products`);
  } catch (err) {
    error.value = err.message || 'Failed to load products';
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
};

// Computed properties
const categories = computed(() => {
  const uniqueCategories = [...new Set(products.value.map(p => p.category).filter(Boolean))];
  return uniqueCategories.sort();
});

const totalProducts = computed(() => products.value.length);

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedSection.value || sortBy.value !== 'name';
});

const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.category && product.category.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value);
  }

  // Section filter
  if (selectedSection.value) {
    filtered = filtered.filter(product => product.section === selectedSection.value);
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / productsPerPage.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * productsPerPage.value;
  const end = start + productsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, '...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...', total);
    }
  }
  
  return pages;
});

// Methods
const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedSection.value = '';
  sortBy.value = 'name';
  currentPage.value = 1;
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    scrollToTop();
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// Watchers
watch([searchQuery, selectedCategory, selectedSection, sortBy], () => {
  currentPage.value = 1;
});

// Initialize from route params
const initializeFilters = () => {
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
  if (route.query.section) {
    selectedSection.value = route.query.section;
  }
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
};

// Update URL when filters change
watch([selectedCategory, selectedSection, searchQuery], () => {
  const query = {};
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (selectedSection.value) query.section = selectedSection.value;
  if (searchQuery.value) query.search = searchQuery.value;
  
  router.replace({ query });
}, { deep: true });

// Lifecycle
onMounted(() => {
  fetchProducts();
  initializeFilters();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.all-products-page {
  min-height: 100vh;
  padding: 20px 0 40px 0;
  background: #fff;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin: 0 60px 30px 60px;
  font-size: 14px;
  padding: 20px 0;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #e74c3c;
}

.breadcrumb-item.current {
  color: #000;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #666;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px;
}

/* Page Header */
.page-header {
  text-align: left;
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 16px;
  margin-bottom: 20px;
}

.red-bar {
  width: 20px;
  height: 40px;
  background: #e74c3c;
  border-radius: 4px;
}

.section-label {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #000;
}

.page-subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Filters Section */
.filters-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid #e9ecef;
}

.search-filter {
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #e74c3c;
}

.filter-options {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  min-width: 120px;
}

.filter-select:focus {
  border-color: #e74c3c;
}

.view-toggle {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid #e9ecef;
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  border-right: 1px solid #e9ecef;
}

.view-btn:last-child {
  border-right: none;
}

.view-btn.active {
  background: #e74c3c;
  color: white;
}

.view-btn:hover:not(.active) {
  background: #f8f9fa;
}

/* Results Info */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 5px;
}

.results-count {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.clear-filters-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.clear-filters-btn:hover {
  background: #c0392b;
}

/* Loading, Error, No Products States */
.loading-state,
.error-state,
.no-products {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner,
.error-icon,
.no-products-icon {
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.loading-spinner i {
  color: #e74c3c;
}

.error-state p,
.no-products p {
  color: #666;
  font-size: 16px;
  margin: 10px 0;
}

.no-products h3 {
  color: #333;
  font-size: 24px;
  margin: 20px 0 10px 0;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  margin-top: 20px;
}

.retry-btn:hover {
  background: #c0392b;
}

/* Products Grid/List */
.products-container {
  margin-bottom: 40px;
}

.products-grid.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.products-grid.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-wrapper.list {
  width: 100%;
}

/* Product Fade Animation */
.product-fade-enter-active,
.product-fade-leave-active {
  transition: all 0.3s ease;
}

.product-fade-enter-from,
.product-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.pagination-numbers {
  display: flex;
  gap: 5px;
}

.pagination-btn {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  min-width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #e74c3c;
  color: #e74c3c;
}

.pagination-btn.active {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Back to Top */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  transition: all 0.3s;
  z-index: 1000;
}

.back-to-top:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .breadcrumb {
    margin: 0 20px 20px 20px;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 28px;
  }

  .filters-section {
    padding: 20px;
  }

  .filter-options {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
  }

  .filter-select {
    min-width: auto;
  }

  .view-toggle {
    align-self: center;
    width: fit-content;
  }

  .results-info {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }

  .back-to-top {
    width: 45px;
    height: 45px;
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .breadcrumb {
    margin: 0 15px 15px 15px;
    font-size: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .search-input {
    padding: 10px 12px 10px 40px;
    font-size: 14px;
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
  }

  .pagination-btn {
    padding: 8px 12px;
    min-width: 40px;
    font-size: 12px;
  }
}
</style>