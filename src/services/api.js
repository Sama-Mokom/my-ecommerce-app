const API_BASE_URL = "http://localhost:8080";

class ApiService {

  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          ...(options.body &&
            typeof options.body === "string" && {
              "Content-Type": "application/json",
            }),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
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

  //Get products by category will be used later on when implementing various product categories
  async getProductsByCategory(category) {
    return this.fetchWithErrorHandling(
      `${API_BASE_URL}/getProducts/${category}`
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
      const response = await fetch(`${API_BASE_URL}/postProduct`, {
        method: "POST",
        body: formData, //Content type header is not set for form data
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.erroe || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Product upload error: ", error);
      throw error;
    }
  }

  async postUser (userData) {
    try {
      //  console.log('Frontend Information to help with debugging')
      //  console.log('Form data before submit: ', formData.value);
      //  console.log('JSON stringify result: ', JSON.stringify(formData.value));
      //  console.log('========================');

       const response = await fetch(`${API_BASE_URL}/postUser`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
       })
      //  console.log('Response status: ', response.status)
      //  console.log('Response headers: ', response.headers)

      //  const data = await response.json()
      //  console.log('Response data: ', data)

      //  if (response.ok){
      //   console.log('User created sucessfully: ', data)
      //   alert('Account created successfully')
      //   formData.value = {name: '', email: '', password: ''}
      //  }else {
      //    console.error('Signup failed:', data)
      // alert(`Signup failed: ${data.error}`)
      //  }
      if (!response.ok) {
        const errorData = await response.json().catch(() =>({message: "Unknown error"}));
        throw new Error(errorData.error|| `HTTP error! status: ${response.status}`)
      }
      return await response.json();
    }catch (error){
        console.error('Network or API error:', error)
        alert('Network error. Please try again. ')
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
  postProduct,
  postUser,
} = apiService;
