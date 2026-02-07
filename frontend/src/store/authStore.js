import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (credentials) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/login', credentials)
          
          if (response.data.success) {
            const { user, accessToken, refreshToken } = response.data.data
            
            set({
              user,
              token: accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false
            })

            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            
            toast.success('Login successful!')
            return { success: true }
          }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await api.post('/auth/register', userData)
          
          if (response.data.success) {
            const { user, accessToken, refreshToken } = response.data.data
            
            set({
              user,
              token: accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            
            toast.success('Registration successful!')
            return { success: true }
          } else {
            set({ isLoading: false })
            const message = response.data.message || 'Registration failed'
            throw new Error(message)
          }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || error.message || 'Registration failed'
          toast.error(message)
          throw error
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false
          })
          delete api.defaults.headers.common['Authorization']
          toast.success('Logged out successfully')
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/auth/update-profile', profileData)
          
          if (response.data.success) {
            set({ user: response.data.data.user })
            toast.success('Profile updated successfully')
            return { success: true }
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Update failed'
          toast.error(message)
          return { success: false }
        }
      },

      // Refresh token
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get()
          const response = await api.post('/auth/refresh', { refreshToken })
          
          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data
            
            set({
              token: accessToken,
              refreshToken: newRefreshToken
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            return { success: true }
          }
        } catch (error) {
          // If refresh fails, logout
          get().logout()
          return { success: false }
        }
      },

      // Initialize auth from storage
      initializeAuth: () => {
        const { token } = get()
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
