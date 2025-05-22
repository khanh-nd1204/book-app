import axios from '../config/axios.config.js'

const addCartAPI = (data) => {
    const URL_BACKEND = '/carts/add'
    return axios.post(URL_BACKEND, data)
}

const removeCartAPI = (data) => {
    const URL_BACKEND = '/carts/remove'
    return axios.post(URL_BACKEND, data)
}

const updateCartAPI = (data) => {
    const URL_BACKEND = '/carts/update'
    return axios.post(URL_BACKEND, data)
}

const getCartAPI = () => {
    const URL_BACKEND = '/carts'
    return axios.get(URL_BACKEND)
}

const resetCartAPI = (data) => {
    const URL_BACKEND = '/carts/reset'
    return axios.post(URL_BACKEND, data)
}

export { addCartAPI, removeCartAPI, updateCartAPI, getCartAPI, resetCartAPI }
