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
    if (token && config.headers) {
      // Pastikan format token sesuai dengan yang diharapkan backend
      config.headers.Authorization = `Token ${token}`; // atau `Bearer ${token}` sesuai kebutuhan
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
    // Hanya redirect ke login jika error adalah 401 dan bukan dari endpoint login
    if (error.response?.status === 401 && !error.config.url.includes('login')) {
      // Cek apakah token masih ada sebelum logout
      const token = Cookies.get('token');
      if (!token) {
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('userType');
        localStorage.clear();
        window.location.href = '/admin/login';
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
      const response = await api.post('/auth/admin-login/', {
        username: formData.emailUsername,
        password: formData.password
      });
      
      // Hapus penyimpanan token di sini karena akan ditangani oleh AuthContext
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
      const response = await api.get('/auth/staff/list/'); // Hapus /api
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

updateStaff: async (staffId: number, data: Partial<StaffData>) => {
    try {
      const response = await api.post(`/auth/staff/update/${staffId}/`, data); // Hapus /api
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
    try {
      const response = await api.post<Product>('/products/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
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
        const response = await api.get<Testimonial[]>('/testimonials/');
        return response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
    },
    
    createTestimonial: async (data: FormData) => {
      try {
        const response = await api.post<Testimonial>('/testimonials/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error creating testimonial:', error);
        throw error;
      }
    },
    
    updateTestimonial: async (id: number, data: FormData) => {
      try {
        const response = await api.put<Testimonial>(`/testimonials/${id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating testimonial:', error);
        throw error;
      }
    },
  
    toggleStatus: async (id: number, isActive: boolean) => {
      try {
        const response = await api.patch<Testimonial>(`/testimonials/${id}/`, {
          is_active: isActive
        });
        return response.data;
      } catch (error) {
        console.error('Error toggling testimonial status:', error);
        throw error;
      }
    },
    
    deleteTestimonial: async (id: number) => {
      try {
        await api.delete(`/testimonials/${id}/`);
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }
    }
  };

export default api;