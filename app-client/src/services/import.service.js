import axios from '../config/axios.config.js'

const createImportAPI = (data) => {
    const URL_BACKEND = '/imports'
    return axios.post(URL_BACKEND, data)
}

const updateImportAPI = (data) => {
    const URL_BACKEND = '/imports'
    return axios.patch(URL_BACKEND, data)
}

const getImportsAPI = (query) => {
    const URL_BACKEND = `/imports?${query}`
    return axios.get(URL_BACKEND)
}

const getImportAPI = (id) => {
    const URL_BACKEND = `/imports/${id}`
    return axios.get(URL_BACKEND)
}

const cancelImportAPI = (data) => {
    const URL_BACKEND = '/imports/cancel'
    return axios.post(URL_BACKEND, data)
}

export {
    createImportAPI,
    updateImportAPI,
    getImportsAPI,
    getImportAPI,
    cancelImportAPI,
}
