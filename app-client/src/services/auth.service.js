import axios from '../config/axios.config.js'

const loginAccountAPI = (data) => {
    const URL_BACKEND = '/auth/login'
    return axios.post(URL_BACKEND, data)
}

const getAccountAPI = () => {
    const URL_BACKEND = '/auth'
    return axios.get(URL_BACKEND)
}

const logoutAccountAPI = () => {
    const URL_BACKEND = '/auth/logout'
    return axios.post(URL_BACKEND)
}

const refreshTokenAPI = () => {
    const URL_BACKEND = '/auth/refresh'
    return axios.get(URL_BACKEND)
}

const sendMailAPI = (data) => {
    const URL_BACKEND = '/auth/send-mail'
    return axios.post(URL_BACKEND, data)
}

const resetAccountPasswordAPI = (data) => {
    const URL_BACKEND = '/auth/reset-password'
    return axios.post(URL_BACKEND, data)
}

const registerAccountAPI = (data) => {
    const URL_BACKEND = '/auth/register'
    return axios.post(URL_BACKEND, data)
}

const activateAccountAPI = (data) => {
    const URL_BACKEND = '/auth/activate'
    return axios.post(URL_BACKEND, data)
}

const loginGoogleAPI = () => {
    const URL_BACKEND = '/auth/google'
    return axios.get(URL_BACKEND)
}

const loginGoogleCallbackAPI = (code) => {
    const URL_BACKEND = `/auth/call-back?code=${code}`
    return axios.get(URL_BACKEND)
}

export {
    loginAccountAPI,
    logoutAccountAPI,
    getAccountAPI,
    refreshTokenAPI,
    sendMailAPI,
    resetAccountPasswordAPI,
    registerAccountAPI,
    activateAccountAPI,
    loginGoogleAPI,
    loginGoogleCallbackAPI,
}
