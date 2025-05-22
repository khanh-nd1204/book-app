import axios from '../config/axios.config.js'

const createUserAPI = (data) => {
    const URL_BACKEND = '/users'
    return axios.post(URL_BACKEND, data)
}

const createBulkUserAPI = (data) => {
    const URL_BACKEND = '/users/bulk'
    return axios.post(URL_BACKEND, data)
}

const updateUserAPI = (data) => {
    const URL_BACKEND = '/users'
    return axios.patch(URL_BACKEND, data)
}

const getUsersAPI = (query) => {
    const URL_BACKEND = `/users?${query}`
    return axios.get(URL_BACKEND)
}

const getUserAPI = (id) => {
    const URL_BACKEND = `/users/${id}`
    return axios.get(URL_BACKEND)
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/users/${id}`
    return axios.delete(URL_BACKEND)
}

const changeUserPasswordAPI = (data) => {
    const URL_BACKEND = '/users/change-password'
    return axios.post(URL_BACKEND, data)
}

export {
    createUserAPI,
    updateUserAPI,
    getUsersAPI,
    getUserAPI,
    deleteUserAPI,
    changeUserPasswordAPI,
    createBulkUserAPI,
}
