import axios from '../config/axios.config.js'

const createBookAPI = (data) => {
    const URL_BACKEND = '/books'
    return axios.post(URL_BACKEND, data)
}

const createBulkBookAPI = (data) => {
    const URL_BACKEND = '/books/bulk'
    return axios.post(URL_BACKEND, data)
}

const updateBookAPI = (data) => {
    const URL_BACKEND = '/books'
    return axios.patch(URL_BACKEND, data)
}

const getBooksAPI = (query) => {
    const URL_BACKEND = `/books?${query}`
    return axios.get(URL_BACKEND)
}

const getBookAPI = (id) => {
    const URL_BACKEND = `/books/${id}`
    return axios.get(URL_BACKEND)
}

const deleteBookAPI = (id) => {
    const URL_BACKEND = `/books/${id}`
    return axios.delete(URL_BACKEND)
}

export {
    createBookAPI,
    updateBookAPI,
    getBooksAPI,
    getBookAPI,
    deleteBookAPI,
    createBulkBookAPI,
}
