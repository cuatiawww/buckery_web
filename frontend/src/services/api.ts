// services/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL
});

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

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  category: number;
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
  

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: async (formData: FormDataLogin) => {
    try {
      const response = await api.post('/login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', formData.emailUsername);
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (formData: FormDataRegister) => {
    try {
      const response = await api.post('/register/', {
        email: formData.email,
        username: formData.username,
        nama_lengkap: formData.nama_lengkap,
        password: formData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout/');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('rememberMe');
      return response.data;
    } catch (error) {
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