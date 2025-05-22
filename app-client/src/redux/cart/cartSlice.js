import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cart: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        doUpdateCartAction: (state, action) => {
            state.cart = action.payload
        },
        doClearCartAction: (state) => {
            state.cart = []
        },
    },

    extraReducers: () => {},
})

export const { doUpdateCartAction, doClearCartAction } = cartSlice.actions

export default cartSlice.reducer
