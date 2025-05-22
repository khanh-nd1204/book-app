import axios from 'axios'
import NProgress from 'nprogress'
import { refreshTokenAPI } from '../services/auth.service.js'

NProgress.configure({ showSpinner: false, trickleSpeed: 100 })

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
})

const PUBLIC_APIS = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/reset-password',
    '/auth/activate',
    '/auth/send-mail',
]

const PUBLIC_GET_APIS = ['/books', '/categories', '/publishers']

instance.interceptors.request.use(
    (config) => {
        NProgress.start()
        config.headers.set(
            'Accept-Language',
            window.localStorage.getItem('lang') || 'vi'
        )

        const isPublicAPI = PUBLIC_APIS.some((api) => config.url.includes(api))

        const isPublicGetAPI =
            config.method.toLowerCase() === 'get' &&
            PUBLIC_GET_APIS.some((api) => config.url.includes(api))

        if (!isPublicAPI && !isPublicGetAPI) {
            const token = window?.localStorage?.getItem('accessToken')
            if (token) {
                config.headers.Authorization = 'Bearer ' + token
            }
        }

        return config
    },
    (error) => {
        NProgress.done()
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        NProgress.done()
        return response?.data || response
    },
    async (error) => {
        NProgress.done()
        const { config, response } = error
        if (
            response?.status === 401 &&
            !config.headers['x-no-retry'] &&
            !['/login', '/register'].includes(window.location.pathname) &&
            config.url !== '/auth/refresh' &&
            !localStorage.getItem('authenticated')
        ) {
            window.localStorage.removeItem('accessToken')
            const res = await refreshTokenAPI()
            if (res && res.data) {
                window.localStorage.setItem('accessToken', res.data.accessToken)
                config.headers.Authorization = 'Bearer ' + res.data.accessToken
                config.headers['x-no-retry'] = 'true'
                return instance.request(config)
            } else {
                console.error(error)
                localStorage.setItem('authenticated', 'false')
                window.location.href = '/login'
            }
        }
        return response?.data || error
    }
)

export default instance
