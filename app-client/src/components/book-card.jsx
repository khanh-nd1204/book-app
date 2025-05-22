import { Card, Image, Progress, Space, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../hook/useResponsiveSize.js'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { memo } from 'react'
const { Text, Title } = Typography

const BookCard = ({ data }) => {
    const { t: common } = useTranslation('common')
    const totalQuantity = data?.stockQuantity + data?.soldQuantity
    const soldPercentage = (data?.soldQuantity / totalQuantity) * 100
    const size = useResponsiveSize()
    const navigate = useNavigate()
    const user = useSelector((state) => state.account.user)

    return (
        <Card
            hoverable
            style={{
                width: '100%',
                paddingBottom: 48,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            onClick={() => navigate(user ? `/book?sku=${data?.sku}` : '/login')}
        >
            <Image
                width={'100%'}
                height={260}
                src={`${import.meta.env.VITE_BACKEND_URL}${data?.images[0]?.url}`}
                preview={false}
                style={{
                    borderRadius: 8,
                    objectFit: 'cover',
                }}
            />

            <Title level={5} style={{ fontSize: size.subtext, marginTop: 16 }}>
                {data?.title?.length > 40
                    ? data?.title?.substring(0, 40) + '...'
                    : data?.title}
            </Title>

            <Space align={'center'}>
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
                    }).format(data?.finalPrice)}
                </Text>
                <Tag color="red" style={{ fontSize: size.subtext2 }}>
                    -{data?.discount}%
                </Tag>
            </Space>

            <div>
                <Text delete type="secondary" style={{ fontSize: size.text }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(data?.sellingPrice)}
                </Text>
            </div>

            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 16,
                    width: '100%',
                    padding: '0 12px',
                }}
            >
                <Progress
                    percent={soldPercentage}
                    showInfo={false}
                    status="active"
                    trailColor={'#f3aeae'}
                    strokeColor={'#ea3c3c'}
                />
                <Text type="secondary" style={{ fontSize: size.subtext }}>
                    {common('module.book.sold_quantity')} {data?.soldQuantity}
                </Text>
            </div>
        </Card>
    )
}

export default memo(BookCard)
