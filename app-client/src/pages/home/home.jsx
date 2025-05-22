import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooksAPI } from '../../services/book.service.js'
import {
    notification,
    Row,
    Col,
    Button,
    Card,
    Flex,
    Typography,
    Spin,
} from 'antd'
import BookCard from '../../components/book-card.jsx'
import { useTranslation } from 'react-i18next'
import CategoryCarousel from './category-carousel.jsx'
import BookVoted from './book-voted.jsx'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { sfEqual } from 'spring-filter-query-builder'
const { Text } = Typography

const HomePage = () => {
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const [data, setData] = useState([])
    const [sort, setSort] = useState('createdAt,desc')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const categories = JSON.parse(localStorage.getItem('categories')) || []
    const [votes, setVotes] = useState([])
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)

    useEffect(() => {
        document.title = common('page.home')
        setLoading1(false)
    }, [])

    useEffect(() => {
        getData()
    }, [sort])

    const getData = async () => {
        const filterStr = sfEqual('status', 1)

        const query = `page=${1}&size=${15}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getBooksAPI(query)
        setLoading(false)
        if (res && res.data) {
            setData(res.data.data)
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

    useEffect(() => {
        const getVote = async () => {
            const filterStr = sfEqual('status', 1)

            const query = `page=${1}&size=${5}&sort=${'soldQuantity,desc'}&filter=${filterStr}`
            const res = await getBooksAPI(query)
            setLoading2(false)
            if (res && res.data) {
                setVotes(res.data.data)
            } else {
                setVotes([])
                notification.error({
                    message: res.error,
                    description: Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                    duration: 3,
                })
            }
        }
        getVote()
    }, [])

    const items = [
        {
            key: 'createdAt,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.new')}
                </Text>
            ),
        },
        {
            key: 'discount,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.reduction')}
                </Text>
            ),
        },
        {
            key: 'finalPrice,desc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.price_down')}
                </Text>
            ),
        },
        {
            key: 'finalPrice,asc',
            label: (
                <Text style={{ fontSize: size.text }}>
                    {common('module.book.price_up')}
                </Text>
            ),
        },
    ]

    const chunkArray = (array, size) => {
        return Array.from(
            { length: Math.ceil(array.length / size) },
            (_, index) =>
                array.slice(index * size, index * size + size).map((item) => ({
                    id: item.value,
                    name: item.label,
                    imageUrl: item.image,
                }))
        )
    }

    const categoryPages = useMemo(() => chunkArray(categories, 8), [categories])

    return (
        <Flex vertical gap={16}>
            <Card
                title={
                    <Text style={{ fontSize: size.title }}>
                        {common('module.book.categories')}
                    </Text>
                }
            >
                {loading1 ? (
                    <Spin style={{ width: '100%' }} />
                ) : (
                    <CategoryCarousel pages={categoryPages} />
                )}
            </Card>

            <Card
                title={
                    <Text style={{ fontSize: size.title }}>
                        {common('module.book.trending')}
                    </Text>
                }
                tabList={items}
                activeTabKey={sort}
                onTabChange={(key) => setSort(key)}
                tabProps={{
                    size: 'middle',
                }}
            >
                {loading ? (
                    <Spin style={{ width: '100%' }} />
                ) : (
                    <Row gutter={[16, 16]} style={{ padding: '0 16px' }}>
                        {data?.map((item) => (
                            <Col
                                xs={{ flex: '100%' }}
                                sm={{ flex: '100%' }}
                                md={{ flex: '50%' }}
                                lg={{ flex: '25%' }}
                                xl={{ flex: '20%' }}
                                key={item.sku}
                                style={{ display: 'flex' }}
                            >
                                <BookCard data={item} />
                            </Col>
                        ))}
                        <Col
                            span={24}
                            justify="center"
                            style={{ textAlign: 'center', marginTop: 16 }}
                        >
                            <Button
                                style={{ fontSize: size.subtext }}
                                onClick={() => navigate('/search')}
                            >
                                {common('action.view_more')}
                            </Button>
                        </Col>
                    </Row>
                )}
            </Card>

            <Card
                title={
                    <Text style={{ fontSize: size.title }}>
                        {common('module.book.seller_vote')}
                    </Text>
                }
            >
                {loading2 ? (
                    <Spin style={{ width: '100%' }} />
                ) : (
                    <Row style={{ padding: '0 16px' }}>
                        <BookVoted votes={votes} />
                        <Col
                            span={24}
                            justify="center"
                            style={{ textAlign: 'center', marginTop: 24 }}
                        >
                            <Button
                                style={{ fontSize: size.subtext }}
                                onClick={() => navigate('/search')}
                            >
                                {common('action.view_more')}
                            </Button>
                        </Col>
                    </Row>
                )}
            </Card>
        </Flex>
    )
}

export default HomePage
