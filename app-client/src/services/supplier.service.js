import axios from '../config/axios.config.js'

const createSupplierAPI = (data) => {
    const URL_BACKEND = '/suppliers'
    return axios.post(URL_BACKEND, data)
}

const updateSupplierAPI = (data) => {
    const URL_BACKEND = '/suppliers'
    return axios.patch(URL_BACKEND, data)
}

const getSuppliersAPI = (query) => {
    const URL_BACKEND = `/suppliers?${query}`
    return axios.get(URL_BACKEND)
}

const getSupplierAPI = (id) => {
    const URL_BACKEND = `/suppliers/${id}`
    return axios.get(URL_BACKEND)
}

const deleteSupplierAPI = (id) => {
    const URL_BACKEND = `/suppliers/${id}`
    return axios.delete(URL_BACKEND)
}

export {
    createSupplierAPI,
    updateSupplierAPI,
    getSuppliersAPI,
    getSupplierAPI,
    deleteSupplierAPI,
}
