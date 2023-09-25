import { createSlice, PayloadAction  } from '@reduxjs/toolkit'

const initialState = {
  value: {
      customer:{
        Name:'',
        ph:'',
        customer_id:'',
        items:[],
      },
  },
}

export const cart = createSlice({
  name: "cart",
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
export const { addcustomer } = cart.actions

export default cart.reducer