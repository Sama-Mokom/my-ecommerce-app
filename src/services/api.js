
const API_BASE_URL = "http://localhost:8080" || import.meta.env.VITE_API_BASE_URL || "https://x-clusive.onrender.com";

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setAccessToken(token) {
    this.accessToken = token;
    try {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    } catch (_) {}
  }

  getAccessToken() {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
    try { localStorage.removeItem('accessToken'); } catch (_) {}
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Function to refresh tokens automatically
  async refreshToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }
    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: "POST",
        credentials: "include", //includes cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      this.setAccessToken(data.accessToken);
      this.processQueue(null, data.accessToken);

      return data.accessToken;
    } catch (error) {
      this.processQueue(error);
      this.clearAccessToken();

      // window.location.href = "/signup";
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  async fetchWithErrorHandling(url, options = {}) {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };
    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    const makeRequest = async (token) => {
      const headers = {
        ...(options.body &&
          typeof options.body === "string" && {
            "Content-Type": "application/json",
          }),
        ...options.headers,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return fetch(url, {
        ...finalOptions,
        headers,
        credentials: "include", //To make sure cookies are included
      });
    };
    try {
      let response = await makeRequest(this.accessToken);

      if (response.status === 401) {
        try {
          const newToken = await this.refreshToken();
          response = await makeRequest(newToken);
        } catch (refreshError) {
          console.error("Token refresh failed: ", refreshError);
          throw new Error("Authentication failed. Please log in again. ");
        }
      }
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Error: ", error);
      throw error;
    }
  }
  //Get all products stored in database
  async getAllProducts() {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/getProducts`);
  }


  //Get a single product by id
   async getProductById(Id) {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/product/${Id}`);
  }

  //Get products by category will be used later on when implementing various product categories
  async getProductsByCategory(category) {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/products/category/${category}`
    );
  }

  //Get products by section
  async getProductsBySection(section) {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/getProducts/${section}`
    );
  }

  // Get flash sale products
  async getFlashSaleProducts() {
    return this.getProductsBySection("flash-sales");
  }

  // Get best selling products
  async getBestSellingProducts() {
    return this.getProductsBySection("best-selling");
  }

  // Get explore products
  async getExploreProducts() {
    return this.getProductsBySection("explore");
  }

  async postProduct(productData, imageFile) {
    const formData = new FormData();

    // Append all product data to FormData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Append image file
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const headers = {};
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }
      let response = await fetch(`${API_BASE_URL}/postProduct`, {
        method: "POST",
        headers: headers,
        body: formData,
        credentials: "include", //For inclusion of cookies
      });

      if (response.status === 401 && this.accessToken) {
        try {
          const newToken = await this.refreshToken();
          response = await fetch(`${API_BASE_URL}/postProduct`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
            body: formData,
            credentials: "include",
          });
        } catch (refreshError) {
          console.error(
            "Token refresh failed during product upload : ",
            refreshError
          );
          throw new Error("Authentication failed. Please log in again");
        }
      }
      if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        return await response.json();
    } catch (error) {
      console.error("Product upload error: ", error);
      throw error;
    }
  }

  async postUser(userData) {
    try {
      if (userData.name === "") {
        alert("Please input your name");
        return;
      }
      if (userData.email === "") {
        alert("Please input your email address");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        alert("Please input a valid email");
        return;
      }
      if (userData.password === "") {
        alert("Please input your password to signup");
        return;
      }
      if (userData.password.length < 8) {
        alert("Password must be atleast 8 characters long");
        return;
      }

      const response = await this.fetchWithErrorHandling(
        `${API_BASE_URL}/postUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.accessToken) {
        this.setAccessToken(response.accessToken);
      }
      return  response;
    } catch (error) {
      console.error("Network or API error:", error);
      throw error;
    }
  }

  async loginUser(credentials) {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email and password are required to login");
      }

      const response = await this.fetchWithErrorHandling(
        `${API_BASE_URL}/loginUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      if (response.accessToken) {
        this.setAccessToken(response.accessToken);
      }
      return response;
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.fetchWithErrorHandling(`${API_BASE_URL}/logout`, {
        method: "POST",
      });

      //Clear the stored access token
      this.clearAccessToken();
      return { message: "Logout successful" };
    } catch (error) {
      this.clearAccessToken();
      console.error("Logout error: ", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/me`);
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Wishlist methods
  async toggleWishlist(productId) {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/wishlist/toggle`, {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      throw error;
    }
  }

  async getWishlist() {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/wishlist`);
    } catch (error) {
      console.error("Get wishlist error:", error);
      throw error;
    }
  }

  async removeFromWishlist(productId) {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/wishlist/${productId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      throw error;
    }
  }

  // Cart methods
  async addToCart(productId, quantity = 1) {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  }

  async getCart() {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/cart`);
    } catch (error) {
      console.error("Get cart error:", error);
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (error) {
      console.error("Update cart error:", error);
      throw error;
    }
  }

  async removeFromCart(productId) {
    try {
      return await this.fetchWithErrorHandling(`${API_BASE_URL}/cart/${productId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Remove from cart error:", error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;

export const {
  getAllProducts,
  getProductsByCategory,
  getFlashSaleProducts,
  getBestSellingProducts,
  getExploreProducts,
  getCurrentUser,
  postProduct,
  postUser,
  isAuthenticated,
  loginUser,
  logout,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  processQueue,
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  getProductById,
} = apiService;
