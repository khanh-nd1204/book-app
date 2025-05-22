import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import {
    Button,
    Col,
    Divider,
    Flex,
    Form,
    Image,
    Input,
    message,
    notification,
    Result,
    Row,
    Select,
    Space,
} from 'antd'
const { TextArea } = Input
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetCartAPI } from '../../services/cart.service.js'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'
import {
    createOrderAPI,
    createPaymentVNP,
} from '../../services/order.service.js'

const CheckOutPage = () => {
    const cart = useSelector((state) => state.cart.cart)
    const user = useSelector((state) => state.account.user)
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const size = useResponsiveSize()
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
        document.title = common('page.order')
    }, [])

    useEffect(() => {
        if (location.state) {
            const ids = location.state?.map((item) => item.id)
            const filteredData = cart?.cartItems?.filter((item) =>
                ids?.includes(item.id)
            )
            setOrders(filteredData)
        } else {
            navigate('/')
        }
    }, [location.state])

    const resetForm = () => {
        form.resetFields()
        navigate(location.pathname, { replace: true })
    }

    const onFinish = async (values) => {
        const orderItems = orders?.map((item) => {
            return {
                id: item?.id,
                bookSku: item?.book?.sku,
                quantity: item?.quantity,
            }
        })
        const data = { ...values, orderItems }

        if (values.method === 2) {
            localStorage.setItem('pendingOrder', JSON.stringify(data))
            await createPayment()
            return
        }

        setLoading(true)
        const res = await createOrderAPI(data)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            await resetCart()
            setCurrent(2)
            resetForm()
        } else {
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }

    const createPayment = async () => {
        const amount = orders?.reduce((sum, item) => sum + item?.totalPrice, 0)
        const res = await createPaymentVNP(amount)
        if (res && res.data) {
            window.location.href = res.data
        } else {
            console.error(res.message)
        }
    }

    const resetCart = async () => {
        const res = await resetCartAPI(
            orders?.map((item) => {
                return { id: item?.id }
            })
        )
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
        } else {
            console.error(res.message)
        }
    }

    const methods = [
        {
            label: common('module.order.method_1'),
            value: 1,
        },
        {
            label: common('module.order.method_2'),
            value: 2,
        },
        {
            label: common('module.order.method_3'),
            value: 3,
        },
    ]

    const invoices = [
        {
            label: common('module.order.invoice_0'),
            value: 0,
        },
        {
            label: common('module.order.invoice_1'),
            value: 1,
        },
    ]

    return (
        <Row gutter={[16, 16]}>
            {current === 1 && (
                <>
                    <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <Flex
                            vertical
                            gap={16}
                            style={{
                                background: '#fff',
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 16,
                            }}
                        >
                            <Row style={{ marginBottom: 8 }}>
                                <Col
                                    span={12}
                                    style={{
                                        fontSize: size.title,
                                        fontWeight: 500,
                                    }}
                                >
                                    {common('label.product')}
                                </Col>

                                <Col
                                    span={4}
                                    style={{
                                        fontSize: size.text,
                                        textAlign: 'center',
                                    }}
                                >
                                    {common('module.book.unit_price')}
                                </Col>

                                <Col
                                    span={4}
                                    style={{
                                        fontSize: size.text,
                                        textAlign: 'center',
                                    }}
                                >
                                    {common('label.quantity')}
                                </Col>

                                <Col
                                    span={4}
                                    style={{
                                        fontSize: size.text,
                                        textAlign: 'center',
                                    }}
                                >
                                    {common('label.into_money')}
                                </Col>
                            </Row>

                            {orders && orders?.length > 0 && (
                                <>
                                    {orders?.map((item) => (
                                        <Row key={item.id}>
                                            <Col span={12}>
                                                <Space
                                                    align={'start'}
                                                    style={{ paddingRight: 16 }}
                                                >
                                                    <Image
                                                        preview={false}
                                                        style={{
                                                            width: 60,
                                                            height: 80,
                                                            objectFit: 'cover',
                                                        }}
                                                        src={`${import.meta.env.VITE_BACKEND_URL}${item?.book?.thumbnail}`}
                                                    />
                                                    <Button
                                                        variant={'link'}
                                                        color="default"
                                                        style={{
                                                            fontSize: size.text,
                                                            fontWeight: 500,
                                                            padding: 0,
                                                            justifyContent:
                                                                'start',
                                                            textWrap: 'wrap',
                                                            textAlign: 'left',
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/book?sku=${item?.book?.sku}`
                                                            )
                                                        }
                                                    >
                                                        {item?.book?.title
                                                            ?.length > 60
                                                            ? item?.book?.title?.substring(
                                                                  0,
                                                                  60
                                                              ) + '...'
                                                            : item?.book?.title}
                                                    </Button>
                                                </Space>
                                            </Col>

                                            <Col
                                                span={4}
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: size.text,
                                                }}
                                            >
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                ).format(item?.unitPrice)}
                                            </Col>

                                            <Col
                                                span={4}
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: size.text,
                                                }}
                                            >
                                                {item?.quantity}
                                            </Col>

                                            <Col
                                                span={4}
                                                style={{
                                                    textAlign: 'center',
                                                    color: '#d32f2f',
                                                    fontWeight: 500,
                                                    fontSize: size.text,
                                                }}
                                            >
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                ).format(item?.totalPrice)}
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            )}
                        </Flex>

                        <Flex
                            style={{
                                background: '#fff',
                                borderRadius: 8,
                                padding: 16,
                            }}
                            vertical
                            gap={16}
                        >
                            <Row>
                                <Col
                                    span={24}
                                    style={{
                                        fontSize: size.title,
                                        fontWeight: 500,
                                        marginBottom: 8,
                                    }}
                                >
                                    {common('module.order.label')}
                                </Col>
                            </Row>

                            <Row>
                                <Col
                                    span={20}
                                    style={{
                                        fontSize: size.text,
                                    }}
                                >
                                    {common('label.total_price')}
                                </Col>
                                <Col
                                    span={4}
                                    style={{
                                        fontSize: size.text,
                                        textAlign: 'center',
                                    }}
                                >
                                    {Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(
                                        orders?.reduce(
                                            (sum, item) =>
                                                sum + item?.totalPrice,
                                            0
                                        )
                                    )}
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col
                                    span={20}
                                    style={{
                                        fontSize: size.text,
                                    }}
                                >
                                    {common('label.total_payment')}
                                </Col>
                                <Col
                                    span={4}
                                    style={{
                                        fontSize: size.title,
                                        textAlign: 'center',
                                        color: '#d32f2f',
                                        fontWeight: 500,
                                    }}
                                >
                                    {Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(
                                        orders?.reduce(
                                            (sum, item) =>
                                                sum + item?.totalPrice,
                                            0
                                        )
                                    )}
                                </Col>
                            </Row>
                        </Flex>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <Form
                            onFinish={onFinish}
                            autoComplete="off"
                            layout={'vertical'}
                            form={form}
                            initialValues={{
                                name: user.name || '',
                                email: user.email || '',
                                address: user.address || '',
                                phone: user.phone || '',
                                invoice: 0,
                                method: 1,
                            }}
                            style={{
                                background: '#fff',
                                padding: 16,
                                borderRadius: 8,
                            }}
                        >
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.name')}
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'name.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 100,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'name.max',
                                                            {
                                                                max: 100,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.email')}
                                        name="email"
                                        rules={[
                                            {
                                                type: 'email',
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'email.invalid'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 100,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'email.max',
                                                            {
                                                                max: 100,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.address')}
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'address.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 100,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'address.max',
                                                            {
                                                                max: 20,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.phone')}
                                        name="phone"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'phone.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                pattern: new RegExp(
                                                    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
                                                ),
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'phone.invalid'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 10,
                                                min: 10,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'phone.length',
                                                            {
                                                                length: 10,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('label.note')}
                                        name="note"
                                        rules={[
                                            {
                                                max: 500,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'note.max',
                                                            {
                                                                max: 100,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.method')}
                                        name="method"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'method.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Select
                                            defaultValue={1}
                                            style={{
                                                width: '100%',
                                            }}
                                            options={methods}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.order.invoice')}
                                        name="invoice"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'invoice.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Select
                                            defaultValue={0}
                                            style={{
                                                width: '100%',
                                            }}
                                            options={invoices}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Button
                                        size={'large'}
                                        type={'primary'}
                                        style={{
                                            width: '100%',
                                            fontSize: size.subtitle,
                                        }}
                                        onClick={() => form.submit()}
                                        loading={loading}
                                    >
                                        {common('action.confirm')}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </>
            )}
            {current === 2 && (
                <Col span={24}>
                    <Result
                        status="success"
                        title={common('module.order.success')}
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
                </Col>
            )}
        </Row>
    )
}

export default CheckOutPage
