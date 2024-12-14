/* eslint-disable @typescript-eslint/no-explicit-any */
// services/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    // Jangan set Content-Type untuk request dengan FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Perbaikan logika penanganan 401
    if (error.response?.status === 401 && !error.config.url.includes('login')) {
      const token = Cookies.get('token');
      // Jika tidak ada token, redirect ke login
      if (!token) {
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('userType');
        localStorage.clear();
        window.location.href = '/login'; // Sesuaikan dengan route login yang benar
      }
      // Jika ada token tapi dapat 401, mungkin token expired
      else {
        // Hapus token dan redirect ke login
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('userType');
        localStorage.clear();
        window.location.href = '/login';
      }
    }
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
  id?: number;
  username: string;
  email: string;
  password?: string;
  nama_lengkap: string;
  user_type: string; 
  is_active?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string | null;
  category: number;
  is_active: boolean;
  created_at: string;
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

  export interface ContactInfo {
    id: number;  // Tambahkan ini juga
    location: string;
    whatsapp_number: string;
    phone_number2: string | null;
    email: string;
    instagram: string;
    weekday_hours: string;
    saturday_hours: string;
    sunday_hours: string;
    latitude: number | null;  // Tambahkan ini
    longitude: number | null; // Tambahkan ini
  }

  export interface Testimonial {
    id: number;
    username: string;
    message: string;
    tagline: string;
    image: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
  }

  export interface UserProfile {
    username: string;
    email: string;
    nama_lengkap: string;
    phone: string;
    address: string;
    notes: string;
    created_at: string;
    updated_at: string;
  }


  // USER SERVICE

  export const userService = {
    getProfile: async () => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        const response = await api.get<UserProfile>('/user/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
  
    updateProfile: async (data: Partial<UserProfile>) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        const response = await api.put<UserProfile>('/user/profile/', data, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };
  
// Auth services
export const authService = {
  userLogin: async (formData: FormDataLogin) => {
    try {
      const response = await api.post<LoginResponse>('/auth/user-login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  userRegister: async (formData: FormDataRegister) => {
    try {
      const response = await api.post('/auth/user-register/', formData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  adminStaffLogin: async (formData: FormDataLogin) => {
    try {
      // Pastikan endpoint yang benar
      const response = await api.post<LoginResponse>('/auth/admin-login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

// Admin auth service
export const adminService = {
  login: async (formData: FormDataLogin) => {
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
  listStaff: async () => {
    try {
      const response = await api.get('/auth/staff/list/');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff list:', error);
      throw error;
    }
  },

  createStaff: async (data: {
    username: string;
    email: string;
    password: string;
    nama_lengkap: string;
    user_type: string;
  }) => {
    try {
      const response = await api.post('/auth/staff/create/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  updateStaff: async (staffId: number, data: {
    username?: string;
    email?: string;
    nama_lengkap?: string;
    is_active?: boolean;
  }) => {
    try {
      const response = await api.post(`/auth/staff/update/${staffId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  }
};

// Menu services
export const menuService = {
  getAllProducts: async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      const validatedProducts = response.data.map(product => ({
        ...product,
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
      }));
      return validatedProducts;
    } catch (error) {
      throw error;
    }
  },
  

  getProduct: async (id: number) => {
    try {
      const response = await api.get<Product>(`/products/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (data: FormData) => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      // Log token untuk debugging
      console.log('Using token:', token);
      
      const response = await api.post<Product>('/products/', data, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Handle token expiration
          Cookies.remove('token');
          window.location.href = '/admin/login';
          throw new Error('Session expired. Please login again.');
        }
        console.error('Create product error:', error.response?.data);
        throw error;
      }
      throw error;
    }
  },

  updateProduct: async (id: number, data: FormData) => {
    const token = Cookies.get('token');
    try {
      const response = await api.put<Product>(`/products/${id}/`, data, {
        headers: {
          'Authorization': `Token ${token}`,
          // Jangan set Content-Type karena FormData akan menetapkannya secara otomatis
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await api.delete(`/products/${id}/`);
    } catch (error) {
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await api.get<Category[]>('/categories/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


// About Services
export const aboutService = {
  // Timeline Events
  getTimelineEvents: async () => {
    try {
      const response = await api.get<TimelineEvent[]>('/timeline-events/');
      return response.data;
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      throw error;
    }
  },

  createTimelineEvent: async (data: FormData) => {
    try {
      const response = await api.post('/timeline-events/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating timeline event:', error);
      throw error;
    }
  },

  updateTimelineEvent: async (id: number, data: FormData) => {
    try {
      const response = await api.put(`/timeline-events/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  },

  deleteTimelineEvent: async (id: number) => {
    try {
      await api.delete(`/timeline-events/${id}/`);
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      throw error;
    }
  },

  // Team Members
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
  },

  createTeamMember: async (data: FormData) => {
    try {
      const response = await api.post<TeamMember>('/team-members/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  updateTeamMember: async (id: number, data: FormData) => {
    try {
      const response = await api.put<TeamMember>(`/team-members/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  deleteTeamMember: async (id: number) => {
    try {
      await api.delete(`/team-members/${id}/`);
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};

  // CONTACT INFO
  export const contactService = {
    getContactInfo: async () => {
      try { 
        const response = await api.get<ContactInfo>('/contact-info/');
        return response.data;
      } catch (error) {
        console.error('Error fetching contact info:', error);
        throw error;
      }
    },
  
    createContactInfo: async (data: Partial<ContactInfo>) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      try {
        const response = await api.post<ContactInfo>('/contact-info/', data, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to create contact information');
        }
        throw error;
      }
    },
  
    updateContactInfo: async (id: number, data: Partial<ContactInfo>) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      try {
        const response = await api.put<ContactInfo>(`/contact-info/${id}/`, data, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to update contact information');
        }
        throw error;
      }
    },
  
    sendWhatsAppMessage: (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }, whatsappNumber: string) => {
      // Format pesan
      const formattedMessage = `*Pesan dari Website*
  *Nama:* ${data.name}
  *Email:* ${data.email}
  *No. Telp:* ${data.phone}
  
  *Pesan:*
  ${data.message}`;
      
      // Encode pesan untuk URL
      const encodedMessage = encodeURIComponent(formattedMessage);
      
      // Buat URL WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Buka WhatsApp di tab baru
      window.open(whatsappUrl, '_blank');
    }
  };

  // TESTIMONY
  export const testimonialService = {
    getAllTestimonials: async () => {
      try {
        // Cek token untuk menentukan header
        const token = Cookies.get('token');
        const headers = token ? {
          'Authorization': `Token ${token}`
        } : undefined;
  
        const response = await api.get<Testimonial[]>('/testimonials/', {
          headers
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
    },
    
    // Fungsi lainnya tetap membutuhkan token karena untuk admin
    createTestimonial: async (data: FormData) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      try {
        const response = await api.post<Testimonial>('/testimonials/', data, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to create testimonial');
        }
        throw error;
      }
    },
    
    updateTestimonial: async (id: number, data: FormData) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        const response = await api.put<Testimonial>(`/testimonials/${id}/`, data, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to update testimonial');
        }
        throw error;
      }
    },
  
    toggleStatus: async (id: number, isActive: boolean) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        const formData = new FormData();
        formData.append('is_active', isActive.toString());
        
        const response = await api.patch<Testimonial>(`/testimonials/${id}/`, formData, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to update status');
        }
        throw error;
      }
    },
    
    deleteTestimonial: async (id: number) => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      try {
        await api.delete(`/testimonials/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/admin/login';
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(error.response?.data?.error || 'Failed to delete testimonial');
        }
        throw error;
      }
    }
  };

export default api;