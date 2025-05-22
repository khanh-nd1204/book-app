import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    Flex,
    Input,
    message,
    notification,
    Popconfirm,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
} from 'antd'
import { deleteBookAPI, getBooksAPI } from '../../../services/book.service.js'
import { useDebouncedCallback } from 'use-debounce'
import * as xlsx from 'xlsx'
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    ImportOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ImportModal from './import.jsx'
import { sfAnd, sfEqual, sfLike, sfOr } from 'spring-filter-query-builder'
import { createStyles } from 'antd-style'
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

const BookPage = () => {
    const { t: common } = useTranslation('common')
    const { styles } = useStyle()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [status, setStatus] = useState(1)
    const [openImport, setOpenImport] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter, status])

    const getData = useCallback(async () => {
        const filterStr = status
            ? sfAnd([
                  sfEqual('status', status),
                  sfOr([
                      sfLike('sku', filter),
                      sfLike('title', filter),
                      sfLike('isbn', filter),
                      sfLike('authors', filter),
                  ]),
              ])
            : sfOr([
                  sfLike('sku', filter),
                  sfLike('title', filter),
                  sfLike('isbn', filter),
                  sfLike('authors', filter),
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
    }, [current, pageSize, sort, filter, status])

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

    const onDelete = async (id) => {
        const res = await deleteBookAPI(id)
        if (res && res.data) {
            message.success(res.message)
            await getData()
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

    const columns = useMemo(
        () => [
            // {
            //     title: common('label.index'),
            //     align: 'center',
            //     render: (_, record, index) => (
            //         <>{index + 1 + (current - 1) * pageSize}</>
            //     ),
            // },
            {
                title: common('module.book.sku'),
                dataIndex: 'sku',
                render: (sku) => (
                    <Tooltip title={common('action.view')}>
                        <a onClick={() => navigate(`/admin/book/${sku}`)}>
                            {sku}
                        </a>
                    </Tooltip>
                ),
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
                title: common('module.author.label'),
                dataIndex: 'authors',
                sorter: true,
            },
            {
                title: common('module.category.label'),
                dataIndex: 'categories',
                render: (_, { categories }) => (
                    <Space
                        wrap
                        style={{ maxWidth: 300, gap: 4 }}
                        align={'center'}
                    >
                        {categories.map((item) => {
                            return (
                                <Tag color={'#007BFF'} key={item.id}>
                                    {item.symbol}
                                </Tag>
                            )
                        })}
                    </Space>
                ),
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
                title: common('module.book.form'),
                dataIndex: 'form',
                render: (_, { form }) => (
                    <>
                        {form === 1
                            ? common('module.book.form_1')
                            : common('module.book.form_2')}
                    </>
                ),
                sorter: true,
            },
            {
                title: common('module.book.import_price'),
                dataIndex: 'importPrice',
                render: (_, { importPrice }) =>
                    new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(importPrice),
                align: 'center',
                sorter: true,
            },
            // {
            //     title: common('module.book.discount'),
            //     dataIndex: 'discount',
            //     render: (_, { discount }) => (
            //         <Tag color={'#cd201f'}>{discount}%</Tag>
            //     ),
            //     align: 'center',
            //     sorter: true,
            // },
            {
                title: common('module.book.selling_price'),
                dataIndex: 'sellingPrice',
                render: (_, { sellingPrice }) =>
                    new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(sellingPrice),
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
            {
                title: common('module.book.sold_quantity'),
                dataIndex: 'soldQuantity',
                render: (_, { soldQuantity }) =>
                    new Intl.NumberFormat('vi-VN').format(soldQuantity),
                align: 'center',
                sorter: true,
            },
            {
                title: common('module.book.isbn'),
                dataIndex: 'isbn',
                align: 'center',
                sorter: true,
            },
            {
                title: common('module.book.status'),
                dataIndex: 'status',
                render: (_, { status }) => {
                    let statusStr = ''
                    let color = ''
                    switch (status) {
                        case -1:
                            statusStr = common('module.book.status_-1')
                            color = 'gray'
                            break
                        case 0:
                            statusStr = common('module.book.status_0')
                            color = 'red'
                            break
                        case 1:
                            statusStr = common('module.book.status_1')
                            color = 'green'
                            break
                        default:
                            statusStr = common('module.book.status_1')
                            color = 'green'
                            break
                    }

                    return <Tag color={color}>{statusStr}</Tag>
                },
            },
            {
                title: common('action.label'),
                render: (_, record) => (
                    <Space>
                        <Tooltip title={common('action.update')}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                    navigate('/admin/book/update', {
                                        state: record,
                                    })
                                }
                            />
                        </Tooltip>
                        <Popconfirm
                            title={common('module.book.delete')}
                            description={common('module.book.delete_confirm', {
                                title: record?.title,
                            })}
                            onConfirm={() => onDelete(record?.sku)}
                            placement="left"
                            okText={common('action.confirm')}
                            cancelText={common('action.cancel')}
                        >
                            <Tooltip title={common('action.delete')}>
                                <Button danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                ),
                fixed: 'right',
            },
        ],
        [current, pageSize]
    )

    const exportData = () => {
        if (data.length > 0) {
            const filteredData = data.map((item) => ({
                SKU: item.sku,
                Title: item.title,
                ImportPrice: item.importPrice,
                SellingPrice: item.sellingPrice,
                FinalPrice: item.finalPrice,
                Profit: item.profit,
                Discount: item.discount,
                PublishYear: item.publishYear,
                Stock: item.stockQuantity,
                Sold: item.soldQuantity,
                Weight: item.weight,
                PageNumber: item.pageNumber,
                ISBN: item?.isbn,
                Form:
                    item.form === 1
                        ? common('module.book.form_1')
                        : common('module.book.form_2'),
                Status:
                    item.status === 1
                        ? common('module.book.status_1')
                        : item.status === 0
                          ? common('module.book.status_0')
                          : common('module.book.status_-1'),
                Authors: item.authors,
                Categories: item?.categories
                    ?.map((item) => item.name)
                    .join(', '),
                Publisher: item?.publisher?.name,
                // Supplier: item?.supplier?.name,
            }))
            const worksheet = xlsx.utils.json_to_sheet(filteredData)
            const workbook = xlsx.utils.book_new()
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
            xlsx.writeFile(workbook, 'books.csv')
        } else {
            message.error('No data!')
        }
    }

    const items = [
        {
            key: null,
            label: common('module.order.status_all'),
        },
        {
            key: 1,
            label: common('module.book.status_1'),
        },
        {
            key: 0,
            label: common('module.book.status_0'),
        },
        {
            key: -1,
            label: common('module.book.status_-1'),
        },
    ]

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 8,
                padding: '0 16px 16px 16px',
            }}
        >
            <Tabs
                defaultActiveKey={status}
                items={items}
                onChange={(key) => setStatus(key)}
            />
            <Flex gap={8} style={{ marginBottom: 16 }} justify="space-between">
                <Input
                    placeholder={common('module.book.search')}
                    style={{ maxWidth: 320 }}
                    onChange={(e) => debounced(e.target.value)}
                />
                <Space>
                    <Button type="primary" onClick={() => setOpenImport(true)}>
                        <ImportOutlined /> {common('action.import')}
                    </Button>
                    <Button type="primary" onClick={exportData}>
                        <ExportOutlined /> {common('action.export')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate('/admin/book/create')}
                    >
                        <PlusOutlined /> {common('action.create')}
                    </Button>
                </Space>
            </Flex>

            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowKey={'sku'}
                onChange={onChange}
                className={styles.customTable}
                scroll={{ x: 'max-content' }}
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

            <ImportModal
                open={openImport}
                setOpen={setOpenImport}
                getData={getData}
            />
        </div>
    )
}

export default BookPage
