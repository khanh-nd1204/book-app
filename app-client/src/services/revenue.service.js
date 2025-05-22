import axios from '../config/axios.config.js'

const getSummaryRevenueAPI = (from, to) => {
    const URL_BACKEND = '/revenue/summary'
    return axios.get(URL_BACKEND, {
        params: {
            from: from.toISOString(),
            to: to.toISOString(),
        },
    })
}

const getChartRevenueAPI = (from, to, groupBy) => {
    const URL_BACKEND = '/revenue/chart'
    return axios.get(URL_BACKEND, {
        params: {
            from: from.toISOString(),
            to: to.toISOString(),
            groupBy,
        },
    })
}

const getTopProductsAPI = (from, to, limit) => {
    const URL_BACKEND = '/revenue/top-products'
    return axios.get(URL_BACKEND, {
        params: {
            from: from.toISOString(),
            to: to.toISOString(),
            limit,
        },
    })
}

export { getTopProductsAPI, getChartRevenueAPI, getSummaryRevenueAPI }
