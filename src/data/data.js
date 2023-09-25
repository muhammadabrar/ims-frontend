import { configureStore } from '@reduxjs/toolkit'
// import theme from './theme'
import title from './title'
import customers from './customer'
import inventory from './inventory';

export const store = configureStore({
  reducer: {
    //   theme: theme,
      title: title,
      customers: customers,
      inventory: inventory,
  },
})