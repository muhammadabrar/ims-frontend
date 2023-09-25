import { createSlice, PayloadAction  } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const customers = createSlice({
  name: "customers",
  initialState,
  reducers: {
   
    addcustomer: (state, action) => {
      state.value = action.payload
    },
    
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { addcustomer } = customers.actions

export default customers.reducer