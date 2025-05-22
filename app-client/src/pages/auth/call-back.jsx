import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { loginGoogleCallbackAPI } from '../../services/auth.service.js'
import { Flex, message, notification, Spin } from 'antd'
import { doLoginAccountAction } from '../../redux/account/accountSlice.js'
import { getCartAPI } from '../../services/cart.service.js'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'

const AuthCallBack = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const code = queryParams.get('code')

        if (!queryParams || !code) {
            navigate('/login')
            return
        }

        const callBack = async () => {
            const res = await loginGoogleCallbackAPI(code)
            if (res && res.data) {
                message.success(res.message)
                dispatch(doLoginAccountAction(res.data))
                getCart()
                navigate('/')
            } else {
                notification.error({
                    message: res.error,
                    description: Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                    duration: 3,
                })
                navigate('/login')
            }
        }
        callBack()
        setLoading(false)
    }, [location])

    const getCart = async () => {
        const res = await getCartAPI()
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
        } else {
            console.error(res.message)
        }
    }

    return (
        <Flex justify="center" align="center" style={{ height: '100vh' }}>
            {loading && <Spin size="large" />}
        </Flex>
    )
}

export default AuthCallBack
