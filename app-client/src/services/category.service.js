import axios from '../config/axios.config.js'

const createCategoryAPI = (data) => {
    const URL_BACKEND = '/categories'
    return axios.post(URL_BACKEND, data)
}

const updateCategoryAPI = (data) => {
    const URL_BACKEND = '/categories'
    return axios.patch(URL_BACKEND, data)
}

const getCategoriesAPI = (query) => {
    const URL_BACKEND = `/categories?${query}`
    return axios.get(URL_BACKEND)
}

const getCategoryAPI = (id) => {
    const URL_BACKEND = `/categories/${id}`
    return axios.get(URL_BACKEND)
}

const deleteCategoryAPI = (id) => {
    const URL_BACKEND = `/categories/${id}`
    return axios.delete(URL_BACKEND)
}

export {
    createCategoryAPI,
    updateCategoryAPI,
    getCategoriesAPI,
    getCategoryAPI,
    deleteCategoryAPI,
}
