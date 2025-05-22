import axios from '../config/axios.config.js'

const getLogsAPI = (query) => {
    const URL_BACKEND = `/logs?${query}`
    return axios.get(URL_BACKEND)
}

export { getLogsAPI }
