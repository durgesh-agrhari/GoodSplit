import { configureStore } from '@reduxjs/toolkit'
import user from './slices/UserSlice'

export const store = configureStore({
  reducer: {
    user
  },
})