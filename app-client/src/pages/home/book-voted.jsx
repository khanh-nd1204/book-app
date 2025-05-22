import { Flex, Space, Image, Typography, Tag, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { memo, useState } from 'react'
import parse from 'react-html-parser'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { useNavigate } from 'react-router-dom'
const { Title, Text, Paragraph } = Typography

const BookVoted = ({ votes }) => {
    const { t: common } = useTranslation('common')
    const [hover, setHover] = useState(votes[0])
    const size = useResponsiveSize()
    const navigate = useNavigate()

    const rating = ['🥇', '🥈', '🥉', '🔹', '🔸']

    return (
        <Row justify="space-between" gutter={[64, 16]}>
            <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={10}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
                {votes?.map((voted, index) => (
                    <Flex
                        key={voted?.sku}
                        gap={16}
                        onMouseEnter={() => setHover(voted)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Space size={'middle'}>
                            <div style={{ fontSize: size.icon }}>
                                {rating[index]}
                            </div>
                            <Image
                                preview={false}
                                width={80}
                                height={120}
                                style={{ objectFit: 'cover', borderRadius: 8 }}
                                src={`${import.meta.env.VITE_BACKEND_URL}${voted?.images[0]?.url}`}
                                alt={voted?.title}
                            />
                        </Space>

                        <Space
                            direction={'vertical'}
                            align={'start'}
                            style={{ gap: 0 }}
                            onClick={() => navigate(`/book?sku=${voted?.sku}`)}
                        >
                            <Text
                                style={{
                                    fontSize: size.text,
                                    fontWeight: 500,
                                }}
                                type={
                                    hover?.sku === voted?.sku ? 'success' : ''
                                }
                            >
                                {voted?.title?.length > 50
                                    ? voted?.title?.substring(0, 50) + '...'
                                    : voted?.title}
                            </Text>
                            <Text
                                type="secondary"
                                style={{ fontSize: size.text }}
                            >
                                {voted?.authors}
                            </Text>
                            <Text
                                type="secondary"
                                style={{ fontSize: size.subtext }}
                            >
                                {common('module.book.sold_quantity')}{' '}
                                {voted?.soldQuantity}
                            </Text>
                        </Space>
                    </Flex>
                ))}
            </Col>

            <Col xs={0} sm={0} md={0} lg={0} xl={14}>
                <Flex gap={16}>
                    <Image
                        width={180}
                        height={220}
                        style={{ objectFit: 'contain', borderRadius: 8 }}
                        src={`${import.meta.env.VITE_BACKEND_URL}${hover?.images[0]?.url}`}
                        alt={hover?.title}
                    />

                    <Flex vertical gap={16}>
                        <Space direction={'vertical'}>
                            <Title
                                level={5}
                                style={{
                                    fontSize: size.title,
                                    marginBottom: 0,
                                }}
                            >
                                {hover?.title}
                            </Title>

                            <Text
                                type={'secondary'}
                                style={{
                                    fontSize: size.text,
                                    marginBottom: 0,
                                }}
                            >
                                {common('module.author.label')}:{' '}
                                {hover?.authors}
                            </Text>

                            <Text
                                type={'secondary'}
                                style={{ fontSize: size.text, marginBottom: 0 }}
                            >
                                {common('module.publisher.label')}:{' '}
                                {hover?.publisher?.name}
                            </Text>
                        </Space>

                        <div>
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
                                    }).format(hover?.finalPrice)}
                                </Text>
                                <Tag
                                    color="red"
                                    style={{ fontSize: size.subtext2 }}
                                >
                                    -{hover?.discount}%
                                </Tag>
                            </Space>
                            <div>
                                <Text
                                    delete
                                    type="secondary"
                                    style={{ fontSize: size.text }}
                                >
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(hover?.sellingPrice)}
                                </Text>
                            </div>
                        </div>

                        <Paragraph
                            style={{ maxWidth: 500, fontSize: size.text }}
                        >
                            {parse(
                                hover?.description?.length > 800
                                    ? hover?.description?.substring(0, 800) +
                                          '...'
                                    : hover?.description
                            )}
                        </Paragraph>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}

export default memo(BookVoted)
