import { createSlice, PayloadAction  } from '@reduxjs/toolkit'

const initialState = {
  value: `Dashboard`,
}

export const title = createSlice({
  name: 'title',
  initialState,
  reducers: {
   
    currentTitle: (state, title) => {
      state.value = title.payload
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { currentTitle } = title.actions

export default title.reducer