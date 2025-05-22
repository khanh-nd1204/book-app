import { useDispatch, useSelector } from 'react-redux'
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Empty,
    Flex,
    Grid,
    message,
    Row,
    Skeleton,
    Space,
    Tooltip,
    Typography,
} from 'antd'
const { Text } = Typography
import CartItem from './cart-item.jsx'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'
import { doClearCartAction } from '../../redux/cart/cartSlice.js'
import { resetCartAPI } from '../../services/cart.service.js'
const { useBreakpoint } = Grid

const CartPage = () => {
    const cart = useSelector((state) => state.cart.cart)
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const [orderItems, setOrderItems] = useState([])
    const user = useSelector((state) => state.account.user)
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const dispatch = useDispatch()
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [skuList, setSkuList] = useState(null)

    useEffect(() => {
        if (!user) navigate('/')
        document.title = common('page.cart')
    }, [])

    useEffect(() => {
        if (location.state) {
            setSkuList(location.state)
            navigate(location.pathname, { replace: true })
        } else {
            setLoading(false)
        }
    }, [location.state])

    useEffect(() => {
        if (!skuList || !cart?.cartItems) return

        const matchedItems = cart.cartItems.filter((item) =>
            skuList.includes(item?.book?.sku)
        )

        if (matchedItems.length > 0) {
            const formatted = matchedItems.map((item) => ({
                quantity: item?.quantity,
                bookSku: item?.book?.sku,
                unitPrice: item?.unitPrice,
                id: item?.id,
            }))
            setOrderItems(formatted)
        }

        setLoading(false)
    }, [skuList, cart?.cartItems])

    const onChange = (e) => {
        if (e.target.checked) {
            const data = cart?.cartItems?.map((item) => {
                return {
                    quantity: item?.quantity,
                    bookSku: item?.book?.sku,
                    unitPrice: item?.unitPrice,
                    id: item?.id,
                }
            })
            setOrderItems(data)
        } else {
            setOrderItems([])
        }
    }

    const clearCart = async () => {
        const res = await resetCartAPI(
            orderItems?.map((item) => {
                return { id: item?.id }
            })
        )
        if (res && res.data) {
            dispatch(doClearCartAction())
            setOrderItems([])
            message.success(res.message)
        } else {
            console.error(res.message)
        }
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                {cart && cart?.cartItems?.length > 0 ? (
                    <>
                        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                            <Col span={24}>
                                <Flex
                                    gap={16}
                                    align={'center'}
                                    justify={'space-between'}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#fff',
                                        padding: 16,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Space
                                        size={'middle'}
                                        style={{ padding: '4px 0' }}
                                    >
                                        <Checkbox
                                            onChange={onChange}
                                            checked={
                                                orderItems?.length ===
                                                cart?.cartItems?.length
                                            }
                                        />
                                        <Text
                                            style={{
                                                fontSize: size.text,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {common('label.product')}
                                        </Text>
                                    </Space>

                                    {orderItems?.length ===
                                        cart?.cartItems?.length && (
                                        <Tooltip
                                            title={common('action.delete_all')}
                                        >
                                            <Button
                                                icon={<DeleteOutlined />}
                                                danger
                                                type={'text'}
                                                onClick={clearCart}
                                            />
                                        </Tooltip>
                                    )}
                                </Flex>
                            </Col>

                            <Col span={24}>
                                <Flex vertical gap={8}>
                                    {cart?.cartItems?.map((item) => (
                                        <div
                                            style={{
                                                background: '#fff',
                                                borderRadius: 8,
                                                padding: 16,
                                            }}
                                            key={item.id}
                                        >
                                            <Skeleton loading={loading}>
                                                <CartItem
                                                    item={item}
                                                    orderItems={orderItems}
                                                    setOrderItems={
                                                        setOrderItems
                                                    }
                                                />
                                            </Skeleton>
                                        </div>
                                    ))}
                                </Flex>
                            </Col>
                        </Col>

                        {screens.lg ? (
                            <Col xs={0} sm={0} md={0} lg={8} xl={8}>
                                <Flex
                                    style={{
                                        background: '#fff',
                                        borderRadius: 8,
                                        padding: 16,
                                    }}
                                    vertical
                                    gap={8}
                                >
                                    <Text
                                        style={{
                                            fontSize: size.title,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {common('module.order.label')}
                                    </Text>

                                    <Flex
                                        align={'center'}
                                        justify={'space-between'}
                                    >
                                        <Text
                                            style={{
                                                fontSize: size.text,
                                            }}
                                        >
                                            {common('label.calculated')}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: size.text,
                                            }}
                                        >
                                            {Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(
                                                orderItems.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item?.quantity *
                                                            item?.unitPrice,
                                                    0
                                                )
                                            )}
                                        </Text>
                                    </Flex>

                                    <Divider style={{ margin: '8px 0' }} />

                                    <Flex
                                        align={'center'}
                                        justify={'space-between'}
                                    >
                                        <Text
                                            strong
                                            style={{
                                                fontSize: size.subtitle,
                                            }}
                                        >
                                            {common('label.total_price')}
                                        </Text>

                                        <Text
                                            strong
                                            style={{
                                                fontSize: size.subtitle,
                                                color: '#d32f2f',
                                            }}
                                        >
                                            {Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(
                                                orderItems.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item?.quantity *
                                                            item?.unitPrice,
                                                    0
                                                )
                                            )}
                                        </Text>
                                    </Flex>

                                    <Button
                                        disabled={orderItems?.length === 0}
                                        size={'large'}
                                        type={'primary'}
                                        style={{
                                            width: '100%',
                                            fontSize: size.subtitle,
                                            marginTop: 16,
                                        }}
                                        onClick={() =>
                                            navigate('/checkout', {
                                                state: orderItems,
                                            })
                                        }
                                    >
                                        {common('action.order')}
                                    </Button>
                                </Flex>
                            </Col>
                        ) : (
                            <Flex
                                style={{
                                    background: '#fff',
                                    padding: 16,
                                    position: 'fixed',
                                    left: 0,
                                    bottom: 0,
                                    width: '100%',
                                    zIndex: 1,
                                    boxShadow:
                                        'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                }}
                                vertical
                                gap={8}
                            >
                                <Text
                                    style={{
                                        fontSize: size.title,
                                        fontWeight: 500,
                                    }}
                                >
                                    {common('module.order.label')}
                                </Text>

                                <Flex
                                    align={'center'}
                                    justify={'space-between'}
                                >
                                    <Text
                                        strong
                                        style={{
                                            fontSize: size.subtitle,
                                        }}
                                    >
                                        {common('label.total_price')}
                                    </Text>

                                    <Text
                                        strong
                                        style={{
                                            fontSize: size.subtitle,
                                            color: '#d32f2f',
                                        }}
                                    >
                                        {Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(
                                            orderItems.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    item?.quantity *
                                                        item?.unitPrice,
                                                0
                                            )
                                        )}
                                    </Text>
                                </Flex>

                                <Button
                                    disabled={orderItems?.length === 0}
                                    size={'large'}
                                    type={'primary'}
                                    style={{
                                        width: '100%',
                                        fontSize: size.subtitle,
                                        marginTop: 16,
                                    }}
                                    onClick={() =>
                                        navigate('/checkout', {
                                            state: orderItems,
                                        })
                                    }
                                >
                                    {common('action.order')}
                                </Button>
                            </Flex>
                        )}
                    </>
                ) : (
                    <Col span={24}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Text
                                    style={{
                                        fontSize: size.subtext,
                                        opacity: 0.5,
                                    }}
                                >
                                    {common('label.no_data')}
                                </Text>
                            }
                        />
                    </Col>
                )}
            </Row>
        </>
    )
}

export default CartPage
