import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../redux/account/accountSlice'
import cartReducer from '../redux/cart/cartSlice.js'

export const store = configureStore({
    reducer: {
        account: accountReducer,
        cart: cartReducer,
    },
})
