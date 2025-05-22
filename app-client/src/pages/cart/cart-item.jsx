import {
    Button,
    Checkbox,
    Col,
    Flex,
    Image,
    InputNumber,
    message,
    notification,
    Row,
    Space,
    Tooltip,
    Typography,
} from 'antd'
const { Text } = Typography
import { useNavigate } from 'react-router-dom'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { removeCartAPI, updateCartAPI } from '../../services/cart.service.js'
import { useDispatch } from 'react-redux'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const CartItem = ({ item, orderItems, setOrderItems }) => {
    const navigate = useNavigate()
    const size = useResponsiveSize()
    const dispatch = useDispatch()
    const { t: common } = useTranslation('common')

    const onChangeQuantity = (sku, value) => {
        if (value && value >= 1) {
            updateQuantity(sku, value)
        }
    }

    const updateQuantity = async (sku, value) => {
        const res = await updateCartAPI({ bookSku: sku, quantity: value })
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))

            setOrderItems((prev) =>
                prev.map((item) =>
                    item?.bookSku === sku ? { ...item, quantity: value } : item
                )
            )
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

    const removeItem = async (item) => {
        const res = await removeCartAPI({ id: item?.id })
        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
            message.success(res.message)

            setOrderItems((prev) =>
                prev.filter((i) => i.bookSku !== item?.book?.sku)
            )
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

    const onChange = (e) => {
        if (e.target.checked) {
            const data = {
                quantity: item?.quantity,
                bookSku: item?.book?.sku,
                unitPrice: item?.unitPrice,
                id: item?.id,
            }
            setOrderItems((prev) => [...prev, data])
        } else {
            setOrderItems((prev) =>
                prev.filter((i) => i.bookSku !== item?.book?.sku)
            )
        }
    }

    return (
        <Row gutter={[8, 8]}>
            <Col span={24}>
                <Flex gap={16}>
                    <Checkbox
                        onChange={onChange}
                        checked={orderItems?.find((i) => i?.id === item?.id)}
                    />
                    <Flex gap={16} style={{ width: '100%' }}>
                        <Image
                            style={{
                                width: 80,
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            src={`${import.meta.env.VITE_BACKEND_URL}${item?.book?.thumbnail}`}
                        />

                        <Flex vertical gap={4} style={{ width: '100%' }}>
                            <Button
                                variant={'link'}
                                color="default"
                                style={{
                                    fontSize: size.text,
                                    fontWeight: 500,
                                    padding: 0,
                                    justifyContent: 'start',
                                    textWrap: 'wrap',
                                    textAlign: 'left',
                                }}
                                onClick={() =>
                                    navigate(`/book?sku=${item?.book?.sku}`)
                                }
                            >
                                {item?.book?.title?.length > 50
                                    ? item?.book?.title?.substring(0, 50) +
                                      '...'
                                    : item?.book?.title}
                            </Button>

                            <Text
                                type={'secondary'}
                                style={{
                                    fontSize: size.text,
                                }}
                            >
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(item?.unitPrice)}
                            </Text>

                            <Text
                                strong
                                style={{
                                    fontSize: size.subtitle,
                                    color: '#d32f2f',
                                }}
                            >
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(item?.totalPrice)}
                            </Text>

                            <Flex justify={'space-between'}>
                                <Space>
                                    <Button
                                        size={'small'}
                                        disabled={item?.quantity <= 1}
                                        onClick={() =>
                                            onChangeQuantity(
                                                item?.book?.sku,
                                                item?.quantity - 1
                                            )
                                        }
                                    >
                                        <MinusOutlined />
                                    </Button>
                                    <InputNumber
                                        size={'small'}
                                        value={item?.quantity}
                                        onChange={(value) =>
                                            onChangeQuantity(
                                                item?.book?.sku,
                                                value
                                            )
                                        }
                                        min={1}
                                        max={item?.book?.stockQuantity}
                                        style={{ width: 40 }}
                                    />
                                    <Button
                                        size={'small'}
                                        disabled={
                                            item?.quantity >=
                                            item?.book?.stockQuantity
                                        }
                                        onClick={() =>
                                            onChangeQuantity(
                                                item?.book?.sku,
                                                item?.quantity + 1
                                            )
                                        }
                                    >
                                        <PlusOutlined />
                                    </Button>
                                </Space>
                                <Tooltip title={common('action.delete')}>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        danger
                                        type={'text'}
                                        onClick={() => removeItem(item)}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export default memo(CartItem)
