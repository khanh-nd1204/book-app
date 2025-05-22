import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    notification,
    Row,
    Select,
    Space,
    Table,
    Tooltip,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import 'react-quill/dist/quill.snow.css'
import { getBooksAPI } from '../../../services/book.service.js'
import { useDebouncedCallback } from 'use-debounce'
import { createStyles } from 'antd-style'
import { createImportAPI } from '../../../services/import.service.js'
import { DeleteOutlined } from '@ant-design/icons'
import { sfLike, sfOr } from 'spring-filter-query-builder'
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token
    return {
        customTable: css`
            ${antCls}-table {
                ${antCls}-table-container {
                    ${antCls}-table-body,
                    ${antCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    }
})

const BookTable = (props) => {
    const { open, setOpen, items, setItems } = props
    const { t: common } = useTranslation('common')
    const { styles } = useStyle()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter])

    const getData = useCallback(async () => {
        const filterStr = sfOr([
            sfLike('sku', filter),
            sfLike('title', filter),
            sfLike('isbn', filter),
        ])

        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getBooksAPI(query)
        setLoading(false)

        if (res && res.data) {
            setData(res.data.data)
            setCurrent(res.data.page)
            setPageSize(res.data.size)
            setTotal(res.data.totalElements)
        } else {
            setData([])
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }, [current, pageSize, sort, filter])

    const onChange = (pagination, filters, sorter) => {
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current)
            }
        }

        if (pagination && pagination.pageSize) {
            if (+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize)
            }
        }

        if (sorter && sorter.field && sorter.order) {
            const sortStr =
                sorter.order === 'descend'
                    ? `${sorter.field},desc`
                    : `${sorter.field},asc`
            setSort(sortStr)
        }
    }

    const debounced = useDebouncedCallback((value) => {
        setCurrent(1)
        setFilter(value)
    }, 1000)

    const columns = useMemo(
        () => [
            {
                title: common('module.book.sku'),
                dataIndex: 'sku',
                sorter: true,
                fixed: 'left',
            },
            {
                title: common('module.book.title'),
                dataIndex: 'title',
                render: (_, { title }) => (
                    <div style={{ maxWidth: 300 }}>{title}</div>
                ),
                sorter: true,
                fixed: 'left',
            },
            {
                title: common('module.book.isbn'),
                dataIndex: 'isbn',
                align: 'center',
                sorter: true,
            },
            {
                title: common('module.publisher.label'),
                dataIndex: 'publisher.name',
                render: (_, record) => <>{record?.publisher?.name}</>,
                sorter: true,
            },
            {
                title: common('module.book.publish_year'),
                dataIndex: 'publishYear',
                align: 'center',
                sorter: true,
            },
            {
                title: common('module.book.final_price'),
                dataIndex: 'finalPrice',
                render: (_, { finalPrice }) =>
                    new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(finalPrice),
                align: 'center',
                sorter: true,
            },
            {
                title: common('module.book.stock_quantity'),
                dataIndex: 'stockQuantity',
                render: (_, { stockQuantity }) =>
                    new Intl.NumberFormat('vi-VN').format(stockQuantity),
                align: 'center',
                sorter: true,
            },
        ],
        [current, pageSize]
    )

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setItems((prevItems) => {
                const newItems = selectedRows.map((item) => ({
                    bookSku: item.sku,
                    title: item.title,
                    isbn: item.isbn,
                    quantity: 1,
                    unitPrice: 0,
                    totalPrice: 0,
                }))

                const uniqueItems = newItems.filter(
                    (newItem) =>
                        !prevItems.some(
                            (prevItem) => prevItem.bookSku === newItem.bookSku
                        )
                )

                return [...prevItems, ...uniqueItems]
            })
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
    }

    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            maskClosable={true}
            width={1000}
            footer={null}
        >
            <Input
                placeholder={common('module.book.search')}
                style={{ maxWidth: 280, marginBottom: 16 }}
                onChange={(e) => debounced(e.target.value)}
            />

            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowKey={'sku'}
                onChange={onChange}
                className={styles.customTable}
                scroll={{ x: 'max-content' }}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: items?.map((item) => item.bookSku),
                    ...rowSelection,
                }}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {' '}
                                {range[0]} - {range[1]} / {total}{' '}
                                {common('pagination.record')}
                            </div>
                        )
                    },
                    locale: {
                        items_per_page: '/ ' + common('pagination.page'),
                    },
                }}
                locale={{
                    triggerDesc: common('pagination.desc'),
                    triggerAsc: common('pagination.asc'),
                    cancelSort: common('pagination.cancel'),
                    emptyText: common('label.no_data'),
                }}
            />
        </Modal>
    )
}

const ImportCreatePage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [suppliers, setSuppliers] = useState([])
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const location = useLocation()

    useEffect(() => {
        if (location.state) {
            setSuppliers(location.state)
        }
    }, [])

    const onFinish = async (values) => {
        if (items.length === 0) {
            message.error(validation('import_list.empty'))
        }
        const bookImportItemRequests = items.map((item) => {
            return {
                bookSku: item.bookSku,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            }
        })
        setLoading(true)
        const res = await createImportAPI({
            ...values,
            bookImportItemRequests,
        })
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
        createForm.resetFields()
    }

    const columns = [
        {
            title: common('module.book.sku'),
            dataIndex: 'bookSku',
        },
        {
            title: common('module.book.title'),
            dataIndex: 'title',
            width: 400,
        },
        {
            title: common('module.book.isbn'),
            dataIndex: 'isbn',
        },
        {
            title: common('module.book.stock_quantity'),
            dataIndex: 'quantity',
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity} // Đảm bảo mỗi hàng có giá trị riêng
                    onChange={(value) =>
                        handleQuantityChange(record.bookSku, value)
                    }
                />
            ),
        },
        {
            title: common('module.book.unit_price'),
            dataIndex: 'unitPrice',
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    addonAfter="đ"
                    formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value?.replace(/\D/g, '')}
                    min={0}
                    style={{ maxWidth: 160 }}
                    value={record.unitPrice}
                    onChange={(value) =>
                        handlePriceChange(record.bookSku, value)
                    }
                />
            ),
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
        {
            title: common('action.label'),
            align: 'center',
            render: (_, record) => (
                <Tooltip title={common('action.delete')}>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                            setItems(
                                items.filter(
                                    (item) => item.bookSku !== record.bookSku
                                )
                            )
                        }
                    />
                </Tooltip>
            ),
        },
    ]

    const handleQuantityChange = (key, value) => {
        setItems((prevData) =>
            prevData.map((item) =>
                item.bookSku === key
                    ? {
                          ...item,
                          quantity: value,
                          totalPrice: item.unitPrice * value,
                      }
                    : item
            )
        )
    }

    const handlePriceChange = (key, value) => {
        setItems((prevData) =>
            prevData.map((item) =>
                item.bookSku === key
                    ? {
                          ...item,
                          unitPrice: value,
                          totalPrice: item.quantity * value,
                      }
                    : item
            )
        )
    }

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                {common('action.create')}
            </div>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={createForm}
                style={{ padding: '8px 0' }}
                initialValues={{}}
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
                            <Input />
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
                                        partialSum + item.totalPrice,
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
                                    <Button
                                        type={'primary'}
                                        onClick={() => setOpen(true)}
                                    >
                                        {common('action.add')}
                                    </Button>
                                </Flex>
                            }
                            required
                        >
                            <Table
                                columns={columns}
                                dataSource={items}
                                rowKey={'bookSku'}
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
                            {common('action.cancel')}
                        </Button>
                        <Button
                            style={{ width: '100%' }}
                            type="primary"
                            onClick={() => createForm.submit()}
                            loading={loading}
                        >
                            {common('action.save')}
                        </Button>
                    </Space>
                </Row>
            </Form>
            <BookTable
                open={open}
                setOpen={setOpen}
                items={items}
                setItems={setItems}
            />
        </div>
    )
}

export default ImportCreatePage
