import { useTranslation } from 'react-i18next'
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    notification,
    Row,
    Select,
    Space,
    Table,
} from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateOrderAPI } from '../../../services/order.service.js'

const OrderUpdatePage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const [updateForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [items, setItems] = useState([])

    useEffect(() => {
        if (location.state) {
            updateForm.setFieldsValue({
                id: location.state.id,
                name: location.state.name,
                email: location.state.email,
                phone: location.state.phone,
                address: location.state.address,
                invoice: location.state.invoice,
                method: location.state.method,
                status: location.state.status,
                reason: location.state.reason,
                totalPrice: location.state.totalPrice,
            })
            setItems(location.state.orderItems)
        }
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await updateOrderAPI(values)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            navigate('/admin/order')
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

    const resetForm = () => {
        updateForm.resetFields()
        window.history.replaceState({}, '')
    }

    const columns = [
        {
            title: common('module.book.sku'),
            dataIndex: 'sku',
            render: (_, { book }) => <>{book.sku}</>,
        },
        {
            title: common('module.book.title'),
            dataIndex: 'title',
            render: (_, { book }) => <>{book.title}</>,
        },
        {
            title: common('module.book.isbn'),
            dataIndex: 'isbn',
            render: (_, { book }) => <>{book.isbn}</>,
        },
        {
            title: common('module.book.stock_quantity'),
            dataIndex: 'quantity',
            align: 'center',
            render: (_, { quantity }) =>
                new Intl.NumberFormat('vi-VN').format(quantity),
        },
        {
            title: common('module.book.unit_price'),
            dataIndex: 'unitPrice',
            align: 'center',
            render: (_, record) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(record.unitPrice || 0),
        },
        {
            title: common('module.import.total_price'),
            dataIndex: 'totalPrice',
            align: 'center',
            render: (_, record) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(record.totalPrice || 0),
        },
    ]

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                {common('action.update')}
            </div>

            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={updateForm}
                style={{ padding: '8px 0' }}
            >
                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item label={common('module.order.id')} name="id">
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label={common('module.order.name')}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: validation('name.required'),
                                },
                                {
                                    max: 100,
                                    message: validation('name.max', {
                                        max: 100,
                                    }),
                                },
                            ]}
                        >
                            <Input
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label={common('module.order.email')}
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: validation('email.invalid'),
                                },
                                {
                                    max: 100,
                                    message: validation('email.max', {
                                        max: 100,
                                    }),
                                },
                            ]}
                        >
                            <Input
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={common('module.order.address')}
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: validation('address.required'),
                                },
                                {
                                    max: 100,
                                    message: validation('address.max', {
                                        max: 100,
                                    }),
                                },
                            ]}
                        >
                            <Input
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                            label={common('module.order.phone')}
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: validation('phone.required'),
                                },
                                {
                                    pattern: new RegExp(
                                        /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
                                    ),
                                    message: validation('phone.invalid'),
                                },
                                {
                                    max: 10,
                                    min: 10,
                                    message: (
                                        <>
                                            {validation('phone.length', {
                                                length: 10,
                                            })}
                                        </>
                                    ),
                                },
                            ]}
                        >
                            <Input
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label={common('module.order.method')}
                            name="method"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'payment_method.required'
                                    ),
                                },
                            ]}
                        >
                            <Select
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                                placeholder={common(
                                    'module.order.method_placeholder'
                                )}
                                optionFilterProp="label"
                                options={[
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
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.order.invoice')}
                            name="invoice"
                            rules={[
                                {
                                    required: true,
                                    message: validation('invoice.required'),
                                },
                            ]}
                        >
                            <Select
                                disabled={
                                    location.state.status !== 1 &&
                                    location.state.status !== 2
                                }
                                placeholder={common(
                                    'module.order.invoice_placeholder'
                                )}
                                optionFilterProp="label"
                                options={[
                                    {
                                        label: common('module.order.invoice_0'),
                                        value: 0,
                                    },
                                    {
                                        label: common('module.order.invoice_1'),
                                        value: 1,
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.order.status')}
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'order_status.required'
                                    ),
                                },
                            ]}
                        >
                            <Select
                                disabled={
                                    location.state.status === 0 ||
                                    location.state.status === -1
                                }
                                placeholder={common(
                                    'module.order.status_placeholder'
                                )}
                                optionFilterProp="label"
                                options={[
                                    {
                                        label: common('module.order.status_-1'),
                                        value: -1,
                                        disabled: true,
                                    },
                                    {
                                        label: common('module.order.status_0'),
                                        value: 0,
                                        disabled: true,
                                    },
                                    {
                                        label: common('module.order.status_1'),
                                        value: 1,
                                        disabled: true,
                                    },
                                    {
                                        label: common('module.order.status_2'),
                                        value: 2,
                                    },
                                    {
                                        label: common('module.order.status_3'),
                                        value: 3,
                                    },
                                    {
                                        label: common('module.order.status_4'),
                                        value: 4,
                                    },
                                    {
                                        label: common('module.order.status_5'),
                                        value: 5,
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item label={common('module.import.total_price')}>
                            <InputNumber
                                disabled
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                addonAfter="đ"
                                value={location.state.totalPrice}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label={
                                <Flex
                                    style={{ width: '100%' }}
                                    justify={'space-between'}
                                    align={'center'}
                                >
                                    <div>
                                        {common('module.order.list')} (
                                        {items.length || 0})
                                    </div>
                                </Flex>
                            }
                        >
                            <Table
                                columns={columns}
                                dataSource={items}
                                rowKey={(record) => record.book.sku}
                                pagination={{
                                    showSizeChanger: true,
                                    showTotal: (total, range) => {
                                        return (
                                            <div>
                                                {' '}
                                                {range[0]} - {range[1]} /{' '}
                                                {total}{' '}
                                                {common('pagination.record')}
                                            </div>
                                        )
                                    },
                                    locale: {
                                        items_per_page:
                                            '/ ' + common('pagination.page'),
                                    },
                                }}
                                locale={{
                                    emptyText: common('label.no_data'),
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={'center'}>
                    <Space>
                        <Button
                            style={{ width: '100%' }}
                            onClick={() => navigate('/admin/order')}
                        >
                            {common('action.cancel')}
                        </Button>
                        <Button
                            style={{ width: '100%' }}
                            type="primary"
                            onClick={() => updateForm.submit()}
                            loading={loading}
                        >
                            {common('action.save')}
                        </Button>
                    </Space>
                </Row>
            </Form>
        </div>
    )
}

export default OrderUpdatePage
