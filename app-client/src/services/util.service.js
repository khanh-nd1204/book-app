import axios from '../config/axios.config.js'

const getCountriesAPI = () => {
    const URL_BACKEND = 'https://open.oapi.vn/location/countries'
    return axios.get(URL_BACKEND)
}

export { getCountriesAPI }
