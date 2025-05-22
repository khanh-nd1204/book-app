import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    Card,
    Flex,
    notification,
    Steps,
    Tag,
    Typography,
    Grid,
    Space,
    Col,
    Row,
    Image,
    Button,
    Divider,
    Skeleton,
} from 'antd'
const { Text } = Typography
import { getOrderAPI } from '../../services/order.service.js'
import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import {
    CheckCircleOutlined,
    FileDoneOutlined,
    ShoppingOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
const { useBreakpoint } = Grid

const PurchaseDetailPage = () => {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const screens = useBreakpoint()
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = common('page.purchase_detail', { id: id })
        getData()
    }, [id])

    const statusMap = {
        1: 0,
        2: 1,
        3: 1,
        4: 1,
        5: 2,
    }

    const getData = async () => {
        const res = await getOrderAPI(id)
        setLoading(false)
        if (res && res.data) {
            setData(res.data)
            setCurrent(statusMap[res.data.status] ?? 0)
        } else {
            setData(null)
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
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

    const items = [
        {
            title: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.ordered')}
                </span>
            ),
            description: (
                <span style={{ fontSize: size.subtext }}>
                    {data?.createdAt}
                </span>
            ),
            icon: <ShoppingOutlined />,
        },
        {
            title: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_2')}
                </span>
            ),
            description: (
                <span style={{ fontSize: size.subtext }}>
                    {data?.confirmedAt}
                </span>
            ),
            icon: <FileDoneOutlined />,
        },
        // {
        //     title: (
        //         <span style={{ fontSize: size.text }}>
        //             {common('module.order.status_3')}
        //         </span>
        //     ),
        //     description: (
        //         <span style={{ fontSize: size.subtext }}>
        //             {data?.deliveredAt}
        //         </span>
        //     ),
        //     icon: <TruckOutlined />,
        // },
        {
            title: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_5')}
                </span>
            ),
            description: (
                <span style={{ fontSize: size.subtext }}>
                    {data?.deliveredAt}
                </span>
            ),
            icon: <CheckCircleOutlined />,
        },
    ]

    return (
        <Flex vertical gap={16}>
            <Card
                title={
                    <Flex gap={8} align={'center'} justify={'end'}>
                        <Text
                            style={{ fontSize: size.text }}
                        >{`${common('module.order.id')}: #${id}`}</Text>
                        <div>|</div>
                        {
                            status.find((item) => item.key === data?.status)
                                ?.label
                        }
                    </Flex>
                }
                loading={loading}
            >
                {data?.status !== -1 && data?.status !== 0 ? (
                    <Steps
                        current={current}
                        labelPlacement="vertical"
                        items={items}
                        direction={screens.md ? 'horizontal' : 'vertical'}
                        style={{ padding: 16 }}
                    />
                ) : (
                    <>
                        {data?.status === 0 && (
                            <Space
                                direction={'vertical'}
                                style={{ paddingLeft: 4 }}
                            >
                                <Text
                                    strong
                                    style={{ fontSize: size.subtitle }}
                                >
                                    {common('module.order.canceled')}
                                </Text>
                                <Text
                                    type={'secondary'}
                                    style={{ fontSize: size.text }}
                                >
                                    {data?.canceledAt}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('label.cancel_reason')}:{' '}
                                    {data?.reason}
                                </Text>
                            </Space>
                        )}

                        {data?.status === -1 && (
                            <Space
                                direction={'vertical'}
                                style={{ paddingLeft: 4 }}
                            >
                                <Text
                                    strong
                                    style={{ fontSize: size.subtitle }}
                                >
                                    {common('module.order.rejected')}
                                </Text>
                                <Text type={'secondary'}>
                                    {data?.rejectedAt}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('label.reject_reason')}:{' '}
                                    {data?.reason}
                                </Text>
                            </Space>
                        )}
                    </>
                )}
            </Card>

            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Flex
                        vertical
                        gap={16}
                        style={{
                            background: '#fff',
                            borderRadius: 8,
                            padding: 16,
                        }}
                    >
                        <Skeleton loading={loading}>
                            {data?.orderItems?.map((item) => (
                                <Flex
                                    gap={8}
                                    key={uuidv4()}
                                    justify="space-between"
                                    align={'center'}
                                >
                                    <Space size={'middle'}>
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
                                                    marginBottom: 4,
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/book?sku=${item?.book?.sku}`
                                                    )
                                                }
                                            >
                                                {screens.md
                                                    ? item?.book?.title
                                                    : item?.book?.title?.substring(
                                                          0,
                                                          50
                                                      ) + '...'}
                                            </Button>
                                            <Text
                                                type={'secondary'}
                                                style={{
                                                    fontSize: size.subtext,
                                                }}
                                            >
                                                {common('module.book.isbn')}:{' '}
                                                {item?.book?.isbn}
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
                                    </Space>

                                    <div
                                        style={{
                                            width: '30%',
                                            textAlign: 'right',
                                        }}
                                    >
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
                            <Divider style={{ margin: '8px 0' }} />

                            <Flex align={'end'} vertical gap={16}>
                                <Space>
                                    <Text style={{ fontSize: size.text }}>
                                        {common('label.total_price')}:
                                    </Text>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: size.title,
                                            color: '#d32f2f',
                                        }}
                                    >
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(data?.totalPrice)}
                                    </Text>
                                </Space>
                            </Flex>
                        </Skeleton>
                    </Flex>
                </Col>

                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Flex
                        vertical
                        style={{
                            background: '#fff',
                            padding: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Skeleton loading={loading}>
                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.name')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.name}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.email')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.email}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.address')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.address}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.phone')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.phone}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            {data?.status !== 0 && data?.status !== -1 && (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: size.text }}
                                            >
                                                {common('module.order.method')}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text
                                                style={{ fontSize: size.text }}
                                            >
                                                {data?.method === 1
                                                    ? common(
                                                          'module.order.method_1'
                                                      )
                                                    : data?.method === 2
                                                      ? common(
                                                            'module.order.method_2'
                                                        )
                                                      : common(
                                                            'module.order.method_3'
                                                        )}
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Divider style={{ margin: '8px 0' }} />

                                    <Row>
                                        <Col span={12}>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: size.text }}
                                            >
                                                {common('module.order.invoice')}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text
                                                style={{ fontSize: size.text }}
                                            >
                                                {data?.invoice === 1
                                                    ? common(
                                                          'module.order.invoice_1'
                                                      )
                                                    : common(
                                                          'module.order.invoice_0'
                                                      )}
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Divider style={{ margin: '8px 0' }} />
                                </>
                            )}

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.created_at')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.createdAt}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.order.created_by')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.createdBy}
                                    </Text>
                                </Col>
                            </Row>
                        </Skeleton>
                    </Flex>
                </Col>
            </Row>
        </Flex>
    )
}

export default PurchaseDetailPage
