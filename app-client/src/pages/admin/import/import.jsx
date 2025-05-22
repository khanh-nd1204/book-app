import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button,
    DatePicker,
    Flex,
    Input,
    notification,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import enLocale from 'antd/es/date-picker/locale/en_US.js'
import viLocale from 'antd/es/date-picker/locale/vi_VN.js'
import { getImportsAPI } from '../../../services/import.service.js'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import ExportPDF from './export-pdf.jsx'
import { getSuppliersAPI } from '../../../services/supplier.service.js'
import { sfLike, sfAnd, sfGe, sfLe } from 'spring-filter-query-builder'
const { RangePicker } = DatePicker
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

const BookImportPage = () => {
    const { t: common } = useTranslation('common')
    const { styles } = useStyle()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [logDate, setLogDate] = useState([])
    const [logUser, setLogUser] = useState('')
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState([])
    const navigate = useNavigate()

    const locale =
        localStorage.getItem('lang') && localStorage.getItem('lang') === 'en'
            ? enLocale
            : viLocale

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter])

    const getData = useCallback(async () => {
        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filter}`
        setLoading(true)
        const res = await getImportsAPI(query)
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

    useEffect(() => {
        const getSuppliers = async () => {
            const query = `page=${1}&size=${100}`
            const res = await getSuppliersAPI(query)
            if (res && res.data) {
                const arr = res.data.data.map((item) => {
                    return { label: item.name, value: item.id }
                })
                setSuppliers(arr)
            } else {
                console.error(res.message)
                setSuppliers([])
            }
        }
        getSuppliers()
    }, [])

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

    const columns = useMemo(
        () => [
            {
                title: common('module.import.id'),
                dataIndex: 'id',
                fixed: 'left',
            },
            {
                title: common('module.supplier.label'),
                dataIndex: 'supplier',
                render: (_, { supplier }) => <>{supplier.name}</>,
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
                title: common('module.import.note'),
                dataIndex: 'note',
                render: (_, { note }) => (
                    <div style={{ maxWidth: 300 }}>{note}</div>
                ),
            },
            {
                title: common('label.cancel_reason'),
                dataIndex: 'reason',
                render: (_, { reason }) => (
                    <div style={{ maxWidth: 300 }}>{reason}</div>
                ),
            },
            {
                title: common('label.status'),
                dataIndex: 'status',
                align: 'center',
                render: (_, { status }) => (
                    <Tag color={status ? 'green' : 'red'}>
                        {status
                            ? common('module.import.status_1')
                            : common('module.import.status_0')}
                    </Tag>
                ),
            },
            {
                title: common('action.label'),
                render: (_, record) => (
                    <Space>
                        <Tooltip title={common('action.update')}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                    navigate('/admin/import/update', {
                                        state: {
                                            ...record,
                                            suppliers,
                                        },
                                    })
                                }
                            />
                        </Tooltip>

                        {record.status && <ExportPDF books={record} />}
                    </Space>
                ),
            },
        ],
        [current, pageSize]
    )

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day') + 1
    }

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <Flex gap={8} style={{ marginBottom: 16 }} justify="space-between">
                <Space>
                    <Input
                        placeholder={common('action.search')}
                        style={{ maxWidth: 320 }}
                        onChange={(e) => setLogUser(e.target.value)}
                        allowClear
                    />

                    <RangePicker
                        style={{ maxWidth: 400 }}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={(value, dateString) => {
                            setLogDate(dateString)
                        }}
                        disabledDate={disabledDate}
                        locale={locale}
                    />

                    <Button
                        type="primary"
                        onClick={() => {
                            setCurrent(1)
                            let filterStr = ''
                            if (
                                logDate.length === 2 &&
                                logDate[0] !== '' &&
                                logDate[1] !== ''
                            ) {
                                filterStr =
                                    logUser !== ''
                                        ? sfAnd([
                                              sfLike('createdBy', logUser),
                                              sfGe('createdAt', logDate[0]),
                                              sfLe('createdAt', logDate[1]),
                                          ])
                                        : sfAnd([
                                              sfGe('createdAt', logDate[0]),
                                              sfLe('createdAt', logDate[1]),
                                          ])
                            } else {
                                filterStr =
                                    logUser !== ''
                                        ? sfLike('createdBy', logUser)
                                        : ''
                            }
                            setFilter(filterStr)
                        }}
                    >
                        {common('action.search')}
                    </Button>
                </Space>

                <Button
                    type="primary"
                    onClick={() =>
                        navigate('/admin/import/create', { state: suppliers })
                    }
                >
                    <PlusOutlined /> {common('action.create')}
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

export default BookImportPage
