import {
    Button,
    Card,
    Divider,
    Flex,
    Image,
    Space,
    Tag,
    Typography,
    Grid,
} from 'antd'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
const { Text } = Typography
import { v4 as uuidv4 } from 'uuid'
import { memo, useState } from 'react'
import { addCartAPI } from '../../services/cart.service.js'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'
import { useDispatch } from 'react-redux'
import CancelModal from './cancel.jsx'
const { useBreakpoint } = Grid

const PurchaseItem = ({ data, getData, setCurrent }) => {
    const size = useResponsiveSize()
    const { t: common } = useTranslation('common')
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)

    const addToCart = async (item) => {
        const res = await addCartAPI(item)

        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
        } else {
            console.log(res.message)
        }
    }

    const buyAgain = async () => {
        const orderList = data?.orderItems?.map((item) => ({
            bookSku: item?.book?.sku,
            quantity: 1,
            unitPrice: item?.book?.finalPrice,
        }))

        if (orderList.length > 0) {
            setLoading(true)
            for (const item of orderList) {
                await addToCart(item)
            }
            setLoading(false)
        }
    }

    const status = [
        {
            key: 1,
            label: (
                <Tag color={'yellow'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_1')}
                </Tag>
            ),
        },
        {
            key: 2,
            label: (
                <Tag color={'blue'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_2')}
                </Tag>
            ),
        },
        {
            key: 3,
            label: (
                <Tag color={'orange'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_3')}
                </Tag>
            ),
        },
        {
            key: 4,
            label: (
                <Tag color={'purple'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_4')}
                </Tag>
            ),
        },
        {
            key: 5,
            label: (
                <Tag color={'green'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_5')}
                </Tag>
            ),
        },
        {
            key: -1,
            label: (
                <Tag color={'gray'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_-1')}
                </Tag>
            ),
        },
        {
            key: 0,
            label: (
                <Tag color={'red'} style={{ fontSize: size.subtext }}>
                    {common('module.order.status_0')}
                </Tag>
            ),
        },
    ]

    return (
        <Card
            style={{ background: '#fff' }}
            title={
                <div style={{ textAlign: 'right' }}>
                    {status.find((item) => item.key === data?.status)?.label}
                </div>
            }
        >
            <Flex vertical gap={8}>
                {data?.orderItems?.map((item) => (
                    <Flex
                        gap={8}
                        key={uuidv4()}
                        justify="space-between"
                        align={'center'}
                        style={{ padding: '0 16px' }}
                    >
                        <Space size={'middle'} align={'start'}>
                            <Image
                                preview={false}
                                src={`${import.meta.env.VITE_BACKEND_URL}${item?.book?.thumbnail}`}
                                width={60}
                                height={80}
                                style={{
                                    objectFit: 'cover',
                                    border: '1px solid #e8e8e8',
                                }}
                            />

                            <Flex vertical>
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
                                    {screens.md
                                        ? item?.book?.title
                                        : item?.book?.title?.substring(0, 50) +
                                          '...'}
                                </Button>
                                <Text
                                    type={'secondary'}
                                    style={{ fontSize: size.subtext }}
                                >
                                    {common('module.book.isbn')}:{' '}
                                    {item?.book?.isbn}
                                </Text>
                                <Text
                                    type={'secondary'}
                                    style={{ fontSize: size.subtext }}
                                >
                                    x{item?.quantity}
                                </Text>
                            </Flex>
                        </Space>

                        <div style={{ width: '30%', textAlign: 'right' }}>
                            <Text
                                style={{
                                    fontSize: size.text,
                                }}
                            >
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(item?.totalPrice)}
                            </Text>
                        </div>
                    </Flex>
                ))}
            </Flex>

            <Divider />

            <Flex align={'end'} vertical gap={16} style={{ padding: '0 16px' }}>
                <Space>
                    <Text style={{ fontSize: size.text }}>
                        {common('label.into_money')}:
                    </Text>
                    <Text
                        strong
                        style={{ fontSize: size.title, color: '#d32f2f' }}
                    >
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(data?.totalPrice)}
                    </Text>
                </Space>

                <Space>
                    {(data?.status === 5 || data?.status === 0) && (
                        <Button
                            type={'primary'}
                            style={{ fontSize: size.text }}
                            onClick={() => {
                                buyAgain()
                                navigate('/cart', {
                                    state: data?.orderItems?.map(
                                        (item) => item?.book?.sku
                                    ),
                                })
                            }}
                            loading={loading}
                        >
                            {common('label.buy_again')}
                        </Button>
                    )}

                    {data?.status === 1 && (
                        <Button
                            danger
                            type={'primary'}
                            style={{ fontSize: size.text }}
                            onClick={() => setOpen(true)}
                        >
                            {common('action.cancel')}
                        </Button>
                    )}

                    <Button
                        style={{ fontSize: size.text }}
                        onClick={() => navigate(`/purchase/${data?.id}`)}
                    >
                        {common('action.view')}
                    </Button>
                </Space>
            </Flex>
            <CancelModal
                open={open}
                setOpen={setOpen}
                id={data?.id}
                getData={getData}
                setCurrent={setCurrent}
            />
        </Card>
    )
}

export default memo(PurchaseItem)
