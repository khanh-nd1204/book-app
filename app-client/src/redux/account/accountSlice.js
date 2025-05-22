import { createSlice } from '@reduxjs/toolkit'
import localStorage from 'redux-persist/es/storage'

const initialState = {
    user: {},
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAccountAction: (state, action) => {
            state.user = action.payload.user
            localStorage.setItem('accessToken', action.payload.accessToken)
            localStorage.removeItem('authenticated')
        },
        doGetAccountAction: (state, action) => {
            state.user = action.payload
        },
        doLogoutAccountAction: (state) => {
            state.user = {}
            localStorage.removeItem('accessToken')
            localStorage.setItem('authenticated', 'false')
        },
        doUpdateAccountAction: (state, action) => {
            state.user = action.payload
        },
    },

    extraReducers: () => {},
})

export const {
    doGetAccountAction,
    doLogoutAccountAction,
    doLoginAccountAction,
    doUpdateAccountAction,
} = accountSlice.actions

export default accountSlice.reducer
