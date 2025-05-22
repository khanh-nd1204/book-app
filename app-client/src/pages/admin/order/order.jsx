import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {
    Button,
    Flex,
    Input,
    notification,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
} from 'antd'
import { useDebouncedCallback } from 'use-debounce'
import { getOrdersAPI } from '../../../services/order.service.js'
import { EditOutlined, EyeOutlined, RedoOutlined } from '@ant-design/icons'
import { createStyles } from 'antd-style'
import { useNavigate } from 'react-router-dom'
import { sfLike, sfOr, sfAnd, sfEqual } from 'spring-filter-query-builder'
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

const OrderPage = () => {
    const { t: common } = useTranslation('common')
    const { styles } = useStyle()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [status, setStatus] = useState(1)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter, status, refreshKey])

    const getData = async () => {
        const filterStr =
            status !== null
                ? sfAnd([
                      sfEqual('status', status),
                      sfOr([
                          sfLike('name', filter),
                          sfLike('email', filter),
                          sfLike('phone', filter),
                          sfLike('address', filter),
                          sfLike('createdBy', filter),
                      ]),
                  ])
                : sfOr([
                      sfLike('name', filter),
                      sfLike('email', filter),
                      sfLike('phone', filter),
                      sfLike('address', filter),
                      sfLike('createdBy', filter),
                  ])

        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getOrdersAPI(query)
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
    }

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

    const columns = [
        // {
        //     title: common('label.index'),
        //     align: 'center',
        //     render: (_, record, index) => {
        //         return <>{index + 1 + (current - 1) * pageSize}</>
        //     },
        // },
        {
            title: common('module.order.id'),
            dataIndex: 'id',
            fixed: 'left',
        },
        {
            title: common('module.order.name'),
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: common('module.order.email'),
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: common('module.order.phone'),
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: common('module.order.address'),
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: common('label.created_by'),
            dataIndex: 'createdBy',
            sorter: true,
        },
        {
            title: common('label.created_at'),
            dataIndex: 'createdAt',
            sorter: true,
        },
        {
            title: common('module.order.total_price'),
            dataIndex: 'totalPrice',
            render: (_, { totalPrice }) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(totalPrice),
            sorter: true,
            align: 'center',
        },
        {
            title: common('module.order.method'),
            dataIndex: 'method',
            render: (_, { method }) => (
                <>
                    {method === 1
                        ? common('module.order.method_1')
                        : method === 2
                          ? common('module.order.method_2')
                          : common('module.order.method_3')}
                </>
            ),
        },
        {
            title: common('module.order.status'),
            dataIndex: 'status',
            align: 'center',
            render: (_, { status }) => {
                let statusStr = ''
                let color = ''
                switch (status) {
                    case -1:
                        statusStr = common('module.order.status_-1')
                        color = 'gray'
                        break
                    case 0:
                        statusStr = common('module.order.status_0')
                        color = 'red'
                        break
                    case 1:
                        statusStr = common('module.order.status_1')
                        color = 'yellow'
                        break
                    case 2:
                        statusStr = common('module.order.status_2')
                        color = 'blue'
                        break
                    case 3:
                        statusStr = common('module.order.status_3')
                        color = 'orange'
                        break
                    case 4:
                        statusStr = common('module.order.status_4')
                        color = 'purple'
                        break
                    case 5:
                        statusStr = common('module.order.status_5')
                        color = 'green'
                        break
                    default:
                        statusStr = common('module.order.status_1')
                        color = 'yellow'
                        break
                }

                return <Tag color={color}>{statusStr}</Tag>
            },
        },
        {
            title: common('action.label'),
            render: (_, record) => {
                return (
                    <Space>
                        {record.status !== -1 &&
                            record.status !== 0 &&
                            record.status !== 1 &&
                            record.status !== 5 && (
                                <Tooltip title={common('action.update')}>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() =>
                                            navigate('/admin/order/update', {
                                                state: record,
                                            })
                                        }
                                    />
                                </Tooltip>
                            )}

                        <Tooltip title={common('action.view')}>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() =>
                                    navigate(`/admin/order/${record.id}`)
                                }
                            />
                        </Tooltip>
                    </Space>
                )
            },
            fixed: 'right',
        },
    ]

    const items = [
        {
            key: null,
            label: common('module.order.status_all'),
        },
        {
            key: 1,
            label: common('module.order.status_1'),
        },
        {
            key: 2,
            label: common('module.order.status_2'),
        },
        {
            key: 3,
            label: common('module.order.status_3'),
        },
        {
            key: 4,
            label: common('module.order.status_4'),
        },
        {
            key: 5,
            label: common('module.order.status_5'),
        },
        {
            key: -1,
            label: common('module.order.status_-1'),
        },
        {
            key: 0,
            label: common('module.order.status_0'),
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
                activeKey={status}
                items={items}
                onChange={(key) => setStatus(key)}
            />
            <Flex
                gap={8}
                style={{ marginBottom: 16 }}
                justify={'space-between'}
            >
                <Input
                    placeholder={common('module.order.search')}
                    style={{ maxWidth: 320 }}
                    value={searchValue}
                    onChange={(e) => {
                        const value = e.target.value
                        setSearchValue(value)
                        debounced(value)
                    }}
                />

                <Button
                    icon={<RedoOutlined />}
                    iconPosition={'end'}
                    type={'primary'}
                    onClick={() => {
                        setCurrent(1)
                        setFilter('')
                        setSearchValue('')
                        setRefreshKey((prev) => prev + 1)
                    }}
                >
                    {common('action.refresh')}
                </Button>
            </Flex>
            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowKey={'id'}
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
        </div>
    )
}

export default OrderPage
