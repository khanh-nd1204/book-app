import { useEffect, useState } from 'react'
import { Button, DatePicker, Input, notification, Space, Table } from 'antd'
import { getLogsAPI } from '../../../services/log.service.js'
import dayjs from 'dayjs'
import viLocale from 'antd/es/date-picker/locale/vi_VN'
import enLocale from 'antd/es/date-picker/locale/en_US'
import { useTranslation } from 'react-i18next'
import { sfLike, sfAnd, sfGe, sfLe } from 'spring-filter-query-builder'
const { RangePicker } = DatePicker

const LogPage = () => {
    const { t: common } = useTranslation('common')
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [logDate, setLogDate] = useState([])
    const [logUser, setLogUser] = useState('')

    const locale =
        localStorage.getItem('lang') && localStorage.getItem('lang') === 'en'
            ? enLocale
            : viLocale

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter])

    const getData = async () => {
        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filter}`
        setLoading(true)
        const res = await getLogsAPI(query)
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

    const columns = [
        {
            title: common('label.index'),
            align: 'center',
            render: (_, record, index) => {
                return <>{index + 1 + (current - 1) * pageSize}</>
            },
        },
        {
            title: common('module.user.label'),
            dataIndex: 'createdBy',
            sorter: true,
        },
        {
            title: common('label.time'),
            dataIndex: 'createdAt',
            sorter: true,
        },
        {
            title: common('action.label'),
            dataIndex: 'action',
            align: 'center',
        },
        {
            title: common('label.description'),
            dataIndex: 'description',
        },
    ]

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day') + 1
    }

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <Space gap={8} style={{ marginBottom: 16 }}>
                <Input
                    placeholder={common('module.user.search')}
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

            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowKey={'id'}
                onChange={onChange}
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

export default LogPage
