import axios from '../config/axios.config.js'

const createOrderAPI = (data) => {
    const URL_BACKEND = '/orders'
    return axios.post(URL_BACKEND, data)
}

const confirmOrderAPI = (id) => {
    const URL_BACKEND = `/orders/${id}`
    return axios.post(URL_BACKEND)
}

const cancelOrderAPI = (data) => {
    const URL_BACKEND = '/orders/cancel'
    return axios.post(URL_BACKEND, data)
}

const rejectOrderAPI = (data) => {
    const URL_BACKEND = '/orders/reject'
    return axios.post(URL_BACKEND, data)
}

const updateOrderAPI = (data) => {
    const URL_BACKEND = '/orders'
    return axios.patch(URL_BACKEND, data)
}

const getOrdersAPI = (query) => {
    const URL_BACKEND = `/orders?${query}`
    return axios.get(URL_BACKEND)
}

const getOrderAPI = (id) => {
    const URL_BACKEND = `/orders/${id}`
    return axios.get(URL_BACKEND)
}

const getOrdersByUserAPI = (query) => {
    const URL_BACKEND = `/orders/user?${query}`
    return axios.get(URL_BACKEND)
}

const createPaymentVNP = (amount) => {
    // const URL_BACKEND = `/payments/vn-pay?amount=${amount}&bankCode=NCB`
    const URL_BACKEND = `/payments/vn-pay?amount=${amount}`
    return axios.get(URL_BACKEND)
}

export {
    createOrderAPI,
    updateOrderAPI,
    getOrderAPI,
    confirmOrderAPI,
    cancelOrderAPI,
    rejectOrderAPI,
    getOrdersByUserAPI,
    getOrdersAPI,
    createPaymentVNP,
}
