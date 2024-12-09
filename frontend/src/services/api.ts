/* eslint-disable @typescript-eslint/no-explicit-any */
// services/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  nama_lengkap: string;
  password: string;
}

export interface FormDataLogin {
  emailUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface FormDataRegister {
  nama_lengkap: string;
  username: string;
  email: string;
  password: string;
}
export interface StaffData {
  username: string;
  password: string;
  email: string;
  nama_lengkap: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  category: number;
}
export interface LoginResponse {
  status: string;
  token: string;
  user_type: string;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  description: string;
}

export interface TimelineEvent {
    id: number;
    year: string;
    title: string;
    description: string;
    image: string | null;
    order: number;
  }
  
  export interface TeamMember {
    id: number;
    name: string;
    role: string;
    quote: string | null;
    image: string | null;
    member_type: 'FOUNDER' | 'TEAM';
    order: number;
  }


// Auth services
export const authService = {
  userLogin: async (formData: FormDataLogin) => {
    try {
      // Log the request data for debugging
      console.log('Login request data:', {
        username: formData.emailUsername,
        password: formData.password
      });

      const response = await api.post('/auth/user-login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      
      console.log('Login response:', response.data); // Debug log

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userType', response.data.user_type);
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return response.data;
    } catch (error: any) {
      // Enhanced error logging
      console.error('Login error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw error;
    }
  },

  userRegister: async (formData: FormDataRegister) => {
    try {
      const response = await api.post('/auth/user-register/', formData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      throw error;
    }
  },

  adminStaffLogin: async (formData: FormDataLogin) => {
    try {
      const response = await api.post<LoginResponse>('/auth/admin-login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userType', response.data.user_type);
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return; // No need to call API if there's no token
      }

      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear storage
      localStorage.clear();
    }

    // Always clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
  }
};

// Admin auth service
export const adminService = {
  login: async (credentials: FormDataLogin) => {
    try {
      const response = await api.post<LoginResponse>('/auth/admin-login/', {
        username: credentials.emailUsername,
        password: credentials.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userType', response.data.user_type);
        if (credentials.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin/Staff login error:', error);
      throw error;
    }
  },

  createStaff: async (staffData: StaffData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/auth/staff/create/', staffData, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  listStaff: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/auth/staff/list/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching staff list:', error);
      throw error;
    }
  }
};

// Menu services
export const menuService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductsByCategory: async (categoryId: number) => {
    try {
      const response = await api.get(`/products/?category=${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// About Services
export const aboutService = {
    getTimelineEvents: async () => {
      try {
        const response = await api.get('/timeline-events/');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    getFounders: async () => {
      try {
        const response = await api.get('/team-members/?type=FOUNDER');
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  
    getTeamMembers: async () => {
      try {
        const response = await api.get('/team-members/?type=TEAM');
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  };

export default api;