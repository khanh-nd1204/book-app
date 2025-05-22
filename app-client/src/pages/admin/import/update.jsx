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
import { useTranslation } from 'react-i18next'
import 'react-quill/dist/quill.snow.css'
import { updateImportAPI } from '../../../services/import.service.js'
import CancelModal from './cancel.jsx'

const ImportUpdatePage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const [updateForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const location = useLocation()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (location.state) {
            updateForm.setFieldsValue({
                id: location.state.id,
                supplierId: location.state?.supplier?.id,
                note: location.state.note,
            })
            setItems(location.state?.bookImportItems)
            setSuppliers(location.state?.suppliers)
        }
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await updateImportAPI(values)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            navigate('/admin/import')
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
            dataIndex: 'totalCost',
            align: 'center',
            render: (_, record) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(record.totalCost || 0),
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
                    <Col span={6}>
                        <Form.Item
                            label={common('module.import.id')}
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: validation('import_id.required'),
                                },
                                {
                                    max: 20,
                                    message: validation('import_id.max', {
                                        max: 20,
                                    }),
                                },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            label={common('module.supplier.label')}
                            name="supplierId"
                            rules={[
                                {
                                    required: true,
                                    message: validation('supplier.required'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={common(
                                    'module.import.supplier_placeholder'
                                )}
                                optionFilterProp="label"
                                options={suppliers}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={common('module.import.note')}
                            name="note"
                            rules={[
                                {
                                    max: 200,
                                    message: validation('note.max', {
                                        max: 200,
                                    }),
                                },
                            ]}
                        >
                            <Input />
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
                                value={items.reduce(
                                    (partialSum, item) =>
                                        partialSum + item.totalCost,
                                    0
                                )}
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
                                        {common('module.import.list')} (
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
                    <Space size={'middle'}>
                        <Button
                            style={{ width: '100%' }}
                            onClick={() => navigate('/admin/import')}
                        >
                            {common('action.exit')}
                        </Button>
                        {location.state.status && (
                            <>
                                <Button
                                    danger
                                    type="primary"
                                    style={{ width: '100%' }}
                                    onClick={() => setOpen(true)}
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
                            </>
                        )}
                    </Space>
                </Row>
            </Form>
            <CancelModal open={open} setOpen={setOpen} id={location.state.id} />
        </div>
    )
}

export default ImportUpdatePage
