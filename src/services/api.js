// API Configuration
// Backend runs on port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://180.235.121.253:8157/api'

// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// Get auth headers for form data (without Content-Type)
const getAuthHeaders = () => {
    const headers = {}
    const token = getToken()
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

// Set auth header
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    }
    const token = getToken()
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

// Handle API response
const handleResponse = async (response) => {
    const data = await response.json()
    if (!response.ok) {
        // Handle 401 Unauthorized - clear token and redirect to login
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Check if we're in a browser environment
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        throw new Error(data.message || 'Something went wrong')
    }
    return data
}

// API Methods
export const api = {
    // GET request
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders(),
        })
        return handleResponse(response)
    },

    // POST request
    post: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        })
        return handleResponse(response)
    },

    // PUT request
    put: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        })
        return handleResponse(response)
    },

    // PATCH request
    patch: async (endpoint, body = {}) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(body),
        })
        return handleResponse(response)
    },

    // DELETE request
    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        })
        return handleResponse(response)
    },
}

// Auth Service
export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response
    },

    // Register
    register: async (fullName, email, password, phone = '') => {
        const response = await api.post('/auth/register', {
            full_name: fullName,
            email,
            password,
            phone,
        })
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response
    },

    // Logout
    logout: async () => {
        try {
            await api.post('/auth/logout')
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    // Check if logged in
    isAuthenticated: () => {
        return !!getToken()
    },

    // Forgot password
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email })
    },

    // Verify OTP
    verifyOtp: async (email, otp) => {
        return api.post('/auth/verify-otp', { email, otp })
    },

    // Reset password
    resetPassword: async (email, newPassword) => {
        return api.post('/auth/reset-password', { email, new_password: newPassword })
    },
}

// Pets Service
export const petsService = {
    // Get all pets
    getPets: () => api.get('/pets'),

    // Get single pet
    getPet: (petId) => api.get(`/pets/${petId}`),

    // Create pet
    createPet: (petData) => api.post('/pets', petData),

    // Update pet
    updatePet: (petId, petData) => api.put(`/pets/${petId}`, petData),

    // Delete pet
    deletePet: (petId) => api.delete(`/pets/${petId}`),

    // Update approval status
    updateApprovalStatus: (petId, status) =>
        api.patch(`/pets/${petId}/approval`, { approval_status: status }),
}

// Weights Service
export const weightsService = {
    // Get all weights for a pet
    getWeights: (petId) => api.get(`/pets/${petId}/weights`),

    // Add weight
    addWeight: (petId, data) => api.post(`/pets/${petId}/weights`, data),

    // Update weight
    updateWeight: (petId, weightId, weight) =>
        api.put(`/pets/${petId}/weights/${weightId}`, { weight }),

    // Delete weight
    deleteWeight: (petId, weightId) => api.delete(`/pets/${petId}/weights/${weightId}`),
}

// Vaccinations Service
export const vaccinationsService = {
    // Get all vaccinations for a pet
    getVaccinations: (petId) => api.get(`/pets/${petId}/vaccinations`),

    // Add vaccination
    addVaccination: (petId, data) => api.post(`/pets/${petId}/vaccinations`, data),

    // Update vaccination
    updateVaccination: (petId, vaccId, data) =>
        api.put(`/vaccinations/${vaccId}`, data),

    // Delete vaccination
    deleteVaccination: (petId, vaccId) =>
        api.delete(`/vaccinations/${vaccId}`),

    // Get all notifications/alerts
    getNotifications: () => api.get('/notifications'),
}

// Records Service
export const recordsService = {
    // Get all records (daily care + activity)
    getRecords: () => api.get('/records'),

    // Create daily care record
    createDailyCare: (data) => api.post('/records/daily-care', data),

    // Create activity record
    createActivity: (data) => api.post('/records/activity', data),

    // Delete record by type and id
    deleteRecord: (type, recordId) => api.delete(`/records/${type}/${recordId}`),

    // Get all reports (scans + daily care + activity)
    getReports: () => api.get('/scans/reports'),
}

// Users Service
export const usersService = {
    // Get profile
    getProfile: () => api.get('/users/profile'),

    // Update profile
    updateProfile: (data) => api.put('/users/profile', data),
}

// Scans Service
export const scansService = {
    // Get all scans
    getScans: () => api.get('/scans'),

    // Get single scan
    getScan: (scanId) => api.get(`/scans/${scanId}`),

    // Create scan
    createScan: (scanData) => api.post('/scans', scanData),

    // Delete scan
    deleteScan: (scanId) => api.delete(`/scans/${scanId}`),

    // Predict disease from image
    predictDisease: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/scans/predict`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        })
        return handleResponse(response)
    },

    // Upload scan with image (multipart/form-data)
    uploadScan: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/scans`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        })
        return handleResponse(response)
    },
}

// Stats Service
export const statsService = {
    // Get public platform stats
    getPublicStats: () => api.get('/stats'),
}

export default api
