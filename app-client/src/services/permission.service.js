import axios from '../config/axios.config.js'

const createPermissionAPI = (data) => {
    const URL_BACKEND = '/permissions'
    return axios.post(URL_BACKEND, data)
}

const updatePermissionAPI = (data) => {
    const URL_BACKEND = '/permissions'
    return axios.patch(URL_BACKEND, data)
}

const getPermissionsAPI = (query) => {
    const URL_BACKEND = `/permissions?${query}`
    return axios.get(URL_BACKEND)
}

const getPermissionAPI = (id) => {
    const URL_BACKEND = `/permissions/${id}`
    return axios.get(URL_BACKEND)
}

const deletePermissionAPI = (id) => {
    const URL_BACKEND = `/permissions/${id}`
    return axios.delete(URL_BACKEND)
}

export {
    createPermissionAPI,
    updatePermissionAPI,
    getPermissionsAPI,
    getPermissionAPI,
    deletePermissionAPI,
}
