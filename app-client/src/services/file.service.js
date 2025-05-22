import axios from '../config/axios.config.js'

const uploadFileAPI = (file, folder) => {
    const URL_BACKEND = '/file/upload'
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    const data = new FormData()
    data.append('file', file)
    data.append('folder', folder)
    return axios.post(URL_BACKEND, data, config)
}

export { uploadFileAPI }
