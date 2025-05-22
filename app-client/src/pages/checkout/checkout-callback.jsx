import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createOrderAPI } from '../../services/order.service.js'
import { Button, Col, message, Result, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'
import { resetCartAPI } from '../../services/cart.service.js'

const CheckoutCallbackPage = () => {
    const location = useLocation()
    const order = JSON.parse(localStorage.getItem('pendingOrder')) || null
    const [status, setStatus] = useState(null)
    const { t: common } = useTranslation('common')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const responseCode = queryParams.get('vnp_ResponseCode')
        const transactionStatus = queryParams.get('vnp_TransactionStatus')
        const vnpTxnRef = queryParams.get('vnp_TxnRef')

        const isSuccess = responseCode === '00' && transactionStatus === '00'

        if (!order) {
            navigate('/')
            return
        }

        if (!isSuccess) {
            setStatus(0)
            return
        }

        const createOrder = async () => {
            const res = await createOrderAPI({ ...order, vnpTxnRef })
            if (res && res.data) {
                setStatus(1)
                message.success(res.message)
                localStorage.removeItem('pendingOrder')
                await resetCart()
            } else {
                setStatus(0)
                console.log(res.message)
            }
        }
        createOrder()
    }, [location])

    const resetCart = async () => {
        const ids = order?.orderItems?.map((item) => ({ id: item?.id }))
        if (!ids) return

        const res = await resetCartAPI(ids)
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
        }
    }

    return (
        <Row justify="center" style={{ marginTop: 80 }}>
            <Col span={24} style={{ textAlign: 'center' }}>
                {status === null ? (
                    <Spin size="large" />
                ) : (
                    <>
                        {status === 1 && (
                            <Result
                                status="success"
                                title={common('module.order.payment_success')}
                                subTitle={common('module.order.success_sub')}
                                extra={[
                                    <Button
                                        type="primary"
                                        key={'home'}
                                        onClick={() => navigate('/')}
                                    >
                                        {common('label.home')}
                                    </Button>,
                                    <Button
                                        key={'history'}
                                        onClick={() => navigate('/purchase')}
                                    >
                                        {common('module.order.purchase')}
                                    </Button>,
                                ]}
                            />
                        )}

                        {status === 0 && (
                            <Result
                                status="error"
                                title={common('module.order.payment_failed')}
                                subTitle={common('module.order.failed_sub')}
                                extra={[
                                    <Button
                                        type="primary"
                                        key={'home'}
                                        onClick={() => navigate('/')}
                                    >
                                        {common('label.home')}
                                    </Button>,
                                ]}
                            />
                        )}
                    </>
                )}
            </Col>
        </Row>
    )
}

export default CheckoutCallbackPage
