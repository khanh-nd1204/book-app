import axios from '../config/axios.config.js'

const createPublisherAPI = (data) => {
    const URL_BACKEND = '/publishers'
    return axios.post(URL_BACKEND, data)
}

const updatePublisherAPI = (data) => {
    const URL_BACKEND = '/publishers'
    return axios.patch(URL_BACKEND, data)
}

const getPublishersAPI = (query) => {
    const URL_BACKEND = `/publishers?${query}`
    return axios.get(URL_BACKEND)
}

const getPublisherAPI = (id) => {
    const URL_BACKEND = `/publishers/${id}`
    return axios.get(URL_BACKEND)
}

const deletePublisherAPI = (id) => {
    const URL_BACKEND = `/publishers/${id}`
    return axios.delete(URL_BACKEND)
}

export {
    createPublisherAPI,
    updatePublisherAPI,
    getPublishersAPI,
    getPublisherAPI,
    deletePublisherAPI,
}
