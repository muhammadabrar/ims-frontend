import { createSlice, PayloadAction  } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const invetories = createSlice({
  name: "invetories",
  initialState,
  reducers: {
   
    addinvetories: (state, action) => {
      state.value = action.payload
    },
    
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { addinvetories } = invetories.actions

export default invetories.reducer