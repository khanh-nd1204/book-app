import axios from '../config/axios.config.js'

const createExportAPI = (data) => {
    const URL_BACKEND = '/exports'
    return axios.post(URL_BACKEND, data)
}

const updateExportAPI = (data) => {
    const URL_BACKEND = '/exports'
    return axios.patch(URL_BACKEND, data)
}

const getExportsAPI = (query) => {
    const URL_BACKEND = `/exports?${query}`
    return axios.get(URL_BACKEND)
}

const getExportAPI = (id) => {
    const URL_BACKEND = `/exports/${id}`
    return axios.get(URL_BACKEND)
}

const cancelExportAPI = (data) => {
    const URL_BACKEND = '/exports/cancel'
    return axios.post(URL_BACKEND, data)
}

export {
    createExportAPI,
    updateExportAPI,
    getExportsAPI,
    getExportAPI,
    cancelExportAPI,
}
