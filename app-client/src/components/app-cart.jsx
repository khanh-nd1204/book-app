import { useSelector } from 'react-redux'
import {
    Badge,
    Button,
    Empty,
    Flex,
    Image,
    Popover,
    Typography,
    Grid,
    Avatar,
} from 'antd'
const { Text } = Typography
const { useBreakpoint } = Grid
import { useNavigate } from 'react-router-dom'
import { memo, useState } from 'react'
import { useResponsiveSize } from '../hook/useResponsiveSize.js'
import { useTranslation } from 'react-i18next'
import { ShoppingFilled } from '@ant-design/icons'

const AppCart = () => {
    const cart = useSelector((state) => state.cart.cart)
    const navigate = useNavigate()
    const [hoverCart, setHoverCart] = useState(null)
    const size = useResponsiveSize()
    const { t: common } = useTranslation('common')
    const screens = useBreakpoint()

    const content = (
        <>
            {cart?.cartItems && cart?.cartItems?.length > 0 ? (
                <>
                    {cart?.cartItems?.map((item, index) => {
                        if (index < 5)
                            return (
                                <Flex
                                    gap={8}
                                    key={item?.id}
                                    onClick={() => {
                                        navigate(`/book?sku=${item?.book?.sku}`)
                                    }}
                                    onMouseEnter={() => setHoverCart(index)}
                                    onMouseLeave={() => setHoverCart(null)}
                                    style={{
                                        padding: 8,
                                        background:
                                            index === hoverCart
                                                ? '#f0f0f0'
                                                : 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Image
                                        preview={false}
                                        style={{
                                            width: 40,
                                            height: 60,
                                            objectFit: 'cover',
                                        }}
                                        src={`${import.meta.env.VITE_BACKEND_URL}${item?.book?.thumbnail}`}
                                    />

                                    <Flex
                                        vertical
                                        style={{
                                            width: screens.md ? 260 : 180,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: size.subtext,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item?.book?.title?.length > 30
                                                ? item?.book?.title?.substring(
                                                      0,
                                                      30
                                                  ) + '...'
                                                : item?.book?.title}
                                        </Text>

                                        <Flex
                                            align={'center'}
                                            justify={'space-between'}
                                        >
                                            <Text
                                                type={'secondary'}
                                                style={{
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
                                            </Text>
                                            <Text
                                                type={'secondary'}
                                                style={{
                                                    fontSize: size.subtext,
                                                }}
                                            >
                                                x{item?.quantity}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                    })}
                </>
            ) : (
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
            )}
        </>
    )

    return (
        <Popover
            placement="bottom"
            title={
                <Flex align={'center'} justify={'space-between'}>
                    <span style={{ fontSize: size.text }}>
                        {common('label.cart')}
                    </span>
                    {cart?.cartItems?.length > 0 && (
                        <Button
                            variant={'filled'}
                            color="default"
                            onClick={() => {
                                navigate('/cart')
                            }}
                            size={'small'}
                            style={{ fontSize: size.subtext }}
                        >
                            {common('action.view_all')}
                        </Button>
                    )}
                </Flex>
            }
            content={content}
        >
            <Badge
                count={cart?.cartItems?.length || 0}
                overflowCount={99}
                size="small"
            >
                <Avatar
                    size={36}
                    style={{
                        cursor: 'pointer',
                        background: '#EBEDEF',
                    }}
                >
                    <ShoppingFilled
                        style={{ fontSize: size.subtitle, color: '#080809' }}
                    />
                </Avatar>
            </Badge>
        </Popover>
    )
}

export default memo(AppCart)
