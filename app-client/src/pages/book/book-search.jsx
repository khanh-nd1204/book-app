import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { getBooksAPI } from '../../services/book.service.js'
import {
    Col,
    notification,
    Row,
    Collapse,
    Checkbox,
    Button,
    Radio,
    Typography,
    Flex,
    Input,
    Spin,
    Card,
    Select,
    Empty,
} from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
const { Panel } = Collapse
const { Text } = Typography
import { v4 as uuidv4 } from 'uuid'
import {
    sfAnd,
    sfEqual,
    sfOr,
    sfGe,
    sfLe,
    sfLike,
} from 'spring-filter-query-builder'
import BookCard from '../../components/book-card.jsx'
import { useLocation, useNavigate } from 'react-router-dom'

const BookSearchPage = () => {
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [loading, setLoading] = useState(false)
    const [visibleCategories, setVisibleCategories] = useState(5)
    const [visiblePublishers, setVisiblePublishers] = useState(5)
    const [categoriesSelected, setCategoriesSelect] = useState([])
    const [publishersSelected, setPublishersSelect] = useState([])
    const [priceSelected, setPriceSelected] = useState()
    const [categorySearch, setCategorySearch] = useState('')
    const [publisherSearch, setPublisherSearch] = useState('')
    const categories = JSON.parse(localStorage.getItem('categories')) || []
    const publishers = JSON.parse(localStorage.getItem('publishers')) || []
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const query = params.get('query')
    const [isParamHandled, setIsParamHandled] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = common('page.search', {
            text: query ? `'${query}'` : '',
        })
    }, [query])

    const priceRanges = [
        {
            label: common('module.book.range_1'),
            value: JSON.stringify({ min: 0, max: 50000 }),
        },
        {
            label: common('module.book.range_2'),
            value: JSON.stringify({ min: 50000, max: 100000 }),
        },
        {
            label: common('module.book.range_3'),
            value: JSON.stringify({ min: 100000, max: 200000 }),
        },
        {
            label: common('module.book.range_4'),
            value: JSON.stringify({ min: 200000, max: 500000 }),
        },
        {
            label: common('module.book.range_5'),
            value: JSON.stringify({ min: 500000, max: null }),
        },
    ]

    useEffect(() => {
        if (location.state) {
            setCategoriesSelect([location.state])

            const index = categories.findIndex(
                (c) => c.value === location.state
            )
            if (index !== -1 && index >= visibleCategories) {
                setVisibleCategories(index + 1)
            }

            navigate(location.pathname, { replace: true })
        }
        setIsParamHandled(true)
    }, [location])

    useEffect(() => {
        if (isParamHandled) {
            getData()
        }
    }, [
        current,
        sort,
        categoriesSelected,
        priceSelected,
        publishersSelected,
        isParamHandled,
        query,
    ])

    useEffect(() => {
        setData([])
        setCurrent(1)
    }, [query])

    const getData = useCallback(async () => {
        const conditions = [sfEqual('status', 1)]

        if (categoriesSelected.length > 0) {
            conditions.push(
                sfOr(
                    categoriesSelected.map((id) => sfEqual('categories.id', id))
                )
            )
        }

        if (publishersSelected.length > 0) {
            conditions.push(
                sfOr(
                    publishersSelected.map((id) => sfEqual('publisher.id', id))
                )
            )
        }

        if (priceSelected) {
            conditions.push(
                priceSelected.max !== null
                    ? sfAnd([
                          sfGe('sellingPrice', priceSelected.min),
                          sfLe('sellingPrice', priceSelected.max),
                      ])
                    : sfGe('sellingPrice', priceSelected.min)
            )
        }

        if (query)
            conditions.push(
                sfOr([sfLike('title', query), sfLike('authors', query)])
            )

        const filterStr = sfAnd(conditions)

        const queryStr = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getBooksAPI(queryStr)
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
    }, [
        current,
        sort,
        categoriesSelected,
        priceSelected,
        publishersSelected,
        query,
    ])

    const onChangeCategories = (values) => {
        setCurrent(1)
        setData([])
        setCategoriesSelect(values)
    }

    const clearCategories = () => {
        setCurrent(1)
        setData([])
        setCategoriesSelect([])
    }

    const onChangePrice = ({ target: { value } }) => {
        setCurrent(1)
        setData([])
        setPriceSelected(JSON.parse(value))
    }

    const clearPrice = () => {
        setCurrent(1)
        setData([])
        setPriceSelected(null)
    }

    const onChangePublishers = (values) => {
        setCurrent(1)
        setData([])
        setPublishersSelect(values)
    }

    const clearPublishers = () => {
        setCurrent(1)
        setData([])
        setPublishersSelect([])
    }

    const filteredCategories = categories.filter((c) =>
        c.label.toLowerCase().includes(categorySearch.toLowerCase())
    )

    const filteredPublishers = publishers.filter((p) =>
        p.label.toLowerCase().includes(publisherSearch.toLowerCase())
    )

    const items = [
        {
            value: 'createdAt,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.new')}
                </Text>
            ),
        },
        {
            value: 'discount,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.reduction')}
                </Text>
            ),
        },
        {
            value: 'soldQuantity,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.seller')}
                </Text>
            ),
        },
        {
            value: 'finalPrice,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.price_down')}
                </Text>
            ),
        },
        {
            value: 'finalPrice,asc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.price_up')}
                </Text>
            ),
        },
    ]

    return (
        <Row gutter={[16, 16]} justify={'space-between'}>
            <Col xs={0} sm={0} md={0} lg={6} xl={6}>
                <div
                    style={{
                        position: 'sticky',
                        top: 16,
                        zIndex: 1,
                        maxHeight: 'calc(100vh - 32px)',
                        overflowY: 'auto',
                        paddingRight: 4,
                    }}
                >
                    <Collapse
                        defaultActiveKey={['1', '2', '3']}
                        style={{
                            background: '#fff',
                        }}
                        bordered={false}
                    >
                        <Panel
                            header={
                                <Flex
                                    align={'center'}
                                    justify={'space-between'}
                                >
                                    <>{common('module.category.label')}</>
                                    {categoriesSelected.length > 0 && (
                                        <Button
                                            size={'small'}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearCategories()
                                            }}
                                            type={'text'}
                                            style={{
                                                fontSize: size.subtext,
                                            }}
                                        >
                                            {common('action.clear_filter')}
                                        </Button>
                                    )}
                                </Flex>
                            }
                            key="1"
                        >
                            <Input
                                placeholder={common('module.category.name')}
                                value={categorySearch}
                                onChange={(e) =>
                                    setCategorySearch(e.target.value)
                                }
                                allowClear
                                style={{ marginBottom: 8 }}
                            />
                            <Checkbox.Group
                                onChange={onChangeCategories}
                                value={categoriesSelected}
                            >
                                <Row gutter={[4, 4]}>
                                    {filteredCategories
                                        .slice(0, visibleCategories)
                                        .map((category) => (
                                            <Col span={24} key={category.value}>
                                                <Checkbox
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                </Row>
                            </Checkbox.Group>
                            <div style={{ textAlign: 'center' }}>
                                {filteredCategories.length >
                                    visibleCategories && (
                                    <Button
                                        icon={<ArrowDownOutlined />}
                                        type={'text'}
                                        onClick={() =>
                                            setVisibleCategories(
                                                (prev) => prev + 10
                                            )
                                        }
                                    />
                                )}
                                {visibleCategories > 10 && (
                                    <Button
                                        icon={<ArrowUpOutlined />}
                                        type={'text'}
                                        onClick={() =>
                                            setVisibleCategories(
                                                (prev) => prev - 10
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </Panel>

                        <Panel
                            header={
                                <Flex
                                    align={'center'}
                                    justify={'space-between'}
                                >
                                    <>{common('module.book.range')}</>
                                    {priceSelected && (
                                        <Button
                                            size={'small'}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearPrice()
                                            }}
                                            type={'text'}
                                            style={{
                                                fontSize: size.subtext,
                                            }}
                                        >
                                            {common('action.clear_filter')}
                                        </Button>
                                    )}
                                </Flex>
                            }
                            key="2"
                        >
                            <Radio.Group
                                onChange={onChangePrice}
                                value={JSON.stringify(priceSelected)}
                            >
                                <Row gutter={[4, 4]}>
                                    {priceRanges.map((price) => (
                                        <Col span={24} key={uuidv4()}>
                                            <Radio value={price.value}>
                                                {price.label}
                                            </Radio>
                                        </Col>
                                    ))}
                                </Row>
                            </Radio.Group>
                        </Panel>

                        <Panel
                            header={
                                <Flex
                                    align={'center'}
                                    justify={'space-between'}
                                >
                                    <>{common('module.publisher.label')}</>
                                    {publishersSelected.length > 0 && (
                                        <Button
                                            size={'small'}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearPublishers()
                                            }}
                                            type={'text'}
                                            style={{
                                                fontSize: size.subtext,
                                            }}
                                        >
                                            {common('action.clear_filter')}
                                        </Button>
                                    )}
                                </Flex>
                            }
                            key="3"
                        >
                            <Input
                                placeholder={common('module.publisher.name')}
                                value={publisherSearch}
                                onChange={(e) =>
                                    setPublisherSearch(e.target.value)
                                }
                                allowClear
                                style={{ marginBottom: 8 }}
                            />
                            <Checkbox.Group
                                onChange={onChangePublishers}
                                value={publishersSelected}
                            >
                                <Row gutter={[4, 4]}>
                                    {filteredPublishers
                                        .slice(0, visiblePublishers)
                                        .map((publisher) => (
                                            <Col
                                                span={24}
                                                key={publisher.value}
                                            >
                                                <Checkbox
                                                    value={publisher.value}
                                                >
                                                    {publisher.label}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                </Row>
                            </Checkbox.Group>
                            <div style={{ textAlign: 'center' }}>
                                {filteredPublishers.length >
                                    visiblePublishers && (
                                    <Button
                                        icon={<ArrowDownOutlined />}
                                        type={'text'}
                                        onClick={() =>
                                            setVisiblePublishers(
                                                (prev) => prev + 10
                                            )
                                        }
                                    />
                                )}
                                {visiblePublishers > 10 && (
                                    <Button
                                        icon={<ArrowUpOutlined />}
                                        type={'text'}
                                        onClick={() =>
                                            setVisiblePublishers(
                                                (prev) => prev - 10
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <Card
                    title={
                        <Flex align={'center'} justify={'space-between'}>
                            <Text style={{ fontSize: size.title }}>
                                {common('label.result', {
                                    value: !query
                                        ? null
                                        : query.length > 30
                                          ? `'${query.substring(0, 30) + '...'}'`
                                          : `'${query}'`,
                                    total: total,
                                })}
                            </Text>

                            <Select
                                options={items}
                                value={sort}
                                onChange={(value) => {
                                    setData([])
                                    setCurrent(1)
                                    setSort(value)
                                }}
                                style={{ minWidth: 150 }}
                            />
                        </Flex>
                    }
                >
                    <Row gutter={[8, 8]} style={{ padding: '0 8px' }}>
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={12}
                                    lg={8}
                                    xl={6}
                                    key={item.sku}
                                    style={{ display: 'flex' }}
                                >
                                    <BookCard data={item} />
                                </Col>
                            ))
                        ) : loading ? (
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <Spin />
                            </Col>
                        ) : (
                            <Col span={24}>
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
                            </Col>
                        )}

                        {data.length > 0 && data.length < total && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    marginTop: 16,
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
                                        onClick={() =>
                                            setCurrent((prev) => prev + 1)
                                        }
                                    >
                                        {common('action.view_more')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </Row>
                </Card>
            </Col>
        </Row>
    )
}

export default BookSearchPage
