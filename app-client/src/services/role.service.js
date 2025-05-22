import axios from '../config/axios.config.js'

const createRoleAPI = (data) => {
    const URL_BACKEND = '/roles'
    return axios.post(URL_BACKEND, data)
}

const updateRoleAPI = (data) => {
    const URL_BACKEND = '/roles'
    return axios.patch(URL_BACKEND, data)
}

const getRolesAPI = (query) => {
    const URL_BACKEND = `/roles?${query}`
    return axios.get(URL_BACKEND)
}

const getRoleAPI = (id) => {
    const URL_BACKEND = `/roles/${id}`
    return axios.get(URL_BACKEND)
}

const deleteRoleAPI = (id) => {
    const URL_BACKEND = `/roles/${id}`
    return axios.delete(URL_BACKEND)
}

export { createRoleAPI, updateRoleAPI, getRolesAPI, getRoleAPI, deleteRoleAPI }
