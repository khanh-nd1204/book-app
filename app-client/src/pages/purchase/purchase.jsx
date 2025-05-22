import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    notification,
    Flex,
    Input,
    Spin,
    Empty,
    Typography,
    Button,
    Card,
} from 'antd'
import { sfEqual, sfLike, sfOr, sfAnd } from 'spring-filter-query-builder'
import { getOrdersByUserAPI } from '../../services/order.service.js'
import { useDebouncedCallback } from 'use-debounce'
import PurchaseItem from './purchase-item.jsx'
import { ArrowDownOutlined } from '@ant-design/icons'
const { Text } = Typography

const PurchasePage = () => {
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = common('page.purchase')
    }, [])

    useEffect(() => {
        getData()
    }, [current, status, filter])

    const getData = useCallback(async () => {
        const filterStr =
            status !== ''
                ? sfAnd([
                      sfEqual('status', status),
                      sfOr([
                          sfLike('id', filter),
                          sfLike('orderItems.book.title', filter),
                      ]),
                  ])
                : sfOr([
                      sfLike('id', filter),
                      sfLike('orderItems.book.title', filter),
                  ])

        const queryStr = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)

        const res = await getOrdersByUserAPI(queryStr)

        setLoading(false)

        if (res && res.data) {
            if (current === 1) {
                setData(res.data.data)
            } else {
                setData((prev) => [...prev, ...res.data.data])
            }

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
    }, [current, status, filter])

    const items = [
        {
            key: '',
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_all')}
                </span>
            ),
        },
        {
            key: 1,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_1')}
                </span>
            ),
        },
        {
            key: 2,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_2')}
                </span>
            ),
        },
        {
            key: 3,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_3')}
                </span>
            ),
        },
        {
            key: 4,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_4')}
                </span>
            ),
        },
        {
            key: 5,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_5')}
                </span>
            ),
        },
        {
            key: -1,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_-1')}
                </span>
            ),
        },
        {
            key: 0,
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.status_0')}
                </span>
            ),
        },
    ]

    const debounced = useDebouncedCallback((value) => {
        setCurrent(1)
        setFilter(value)
    }, 1000)

    const onChange = (key) => {
        setCurrent(1)
        setStatus(key)
    }

    return (
        <Flex vertical gap={16}>
            <Card
                tabList={items}
                activeTabKey={status}
                onTabChange={onChange}
                tabProps={{
                    size: 'middle',
                }}
                style={{ padding: 16 }}
                className="custom-tabs-card"
            >
                <Input
                    placeholder={common('module.order.search')}
                    style={{ maxWidth: 400, fontSize: size.text }}
                    onChange={(e) => debounced(e.target.value)}
                />
            </Card>

            <Flex vertical gap={16}>
                {data && data?.length > 0 ? (
                    data?.map((item) => (
                        <PurchaseItem
                            data={item}
                            key={item.id}
                            getData={getData}
                            setCurrent={setCurrent}
                        />
                    ))
                ) : loading ? (
                    <Spin />
                ) : (
                    <div style={{ background: '#fff', borderRadius: 8 }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Text
                                    style={{
                                        fontSize: size.subtext,
                                        opacity: 0.5,
                                    }}
                                >
                                    {common('label.no_data')}
                                </Text>
                            }
                        />
                    </div>
                )}
            </Flex>
            <>
                {data.length > 0 && data.length < total && (
                    <div
                        style={{
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        {loading ? (
                            <Spin />
                        ) : (
                            <Button
                                loading={loading}
                                style={{
                                    fontSize: size.subtext,
                                }}
                                icon={<ArrowDownOutlined />}
                                iconPosition={'end'}
                                onClick={() => setCurrent((prev) => prev + 1)}
                            >
                                {common('action.view_more')}
                            </Button>
                        )}
                    </div>
                )}
            </>
        </Flex>
    )
}

export default PurchasePage
