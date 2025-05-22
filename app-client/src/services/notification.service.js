import axios from '../config/axios.config.js'

const maskReadAllNotificationAPI = () => {
    const URL_BACKEND = '/notifications/read'
    return axios.post(URL_BACKEND)
}

const getNotificationsAPI = (query) => {
    const URL_BACKEND = `/notifications?${query}`
    return axios.get(URL_BACKEND)
}

export { maskReadAllNotificationAPI, getNotificationsAPI }
