import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { getBookAPI, getBooksAPI } from '../../services/book.service.js'
import {
    Button,
    Col,
    Divider,
    Flex,
    Image,
    InputNumber,
    message,
    notification,
    Row,
    Skeleton,
    Space,
    Tag,
    Typography,
} from 'antd'
const { Text, Paragraph } = Typography
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import parse from 'react-html-parser'
import { sfEqual, sfLike, sfOr, sfAnd } from 'spring-filter-query-builder'
import BookCard from '../../components/book-card.jsx'
import { addCartAPI } from '../../services/cart.service.js'
import { useDispatch } from 'react-redux'
import { doUpdateCartAction } from '../../redux/cart/cartSlice.js'

const BookDetailPage = () => {
    const { t: common } = useTranslation('common')
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const sku = params.get('sku')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [data, setData] = useState(null)
    const [imagePrimary, setImagePrimary] = useState()
    const size = useResponsiveSize()
    const [quantity, setQuantity] = useState(1)
    const [suggest, setSuggest] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (!sku || sku === '') {
            navigate('/')
        } else {
            getData()
        }
    }, [sku])

    const getData = useCallback(async () => {
        const res = await getBookAPI(sku)
        setLoading(false)
        if (res && res.data) {
            setData(res.data)
            setImagePrimary(res.data.images[0])
            document.title = common('page.book', { title: res.data?.title })
        } else {
            setData(null)
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }, [sku])

    useEffect(() => {
        if (data) {
            getSuggest()
        }
    }, [data])

    const getSuggest = useCallback(async () => {
        const conditions = [
            sfAnd([
                sfEqual('status', 1),
                sfOr([
                    sfLike('authors', data?.authors),
                    sfLike('publisher.id', data?.publisher?.id),
                ]),
            ]),
        ]

        if (data?.categories?.length > 0) {
            conditions.push(
                sfOr(
                    data?.categories?.map(({ id }) =>
                        sfEqual('categories.id', id)
                    )
                )
            )
        }

        const filterStr = sfOr(conditions)

        const query = `page=${1}&size=${15}&sort=${'createdAt,desc'}&filter=${filterStr}`

        setLoading1(true)
        const res = await getBooksAPI(query)
        setLoading1(false)

        if (res && res.data) {
            setSuggest(res.data.data?.filter((item) => item?.sku !== sku))
        } else {
            setSuggest([])
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }, [data])

    const addToCart = async (type) => {
        const input = {
            bookSku: data?.sku,
            quantity: quantity,
            unitPrice: data?.finalPrice,
        }

        if (type && type === 1) setLoading2(true)
        else setLoading3(true)
        const res = await addCartAPI(input)
        setLoading2(false)
        setLoading3(false)

        if (res && res.data) {
            dispatch(doUpdateCartAction(res.data))
            if (type && type === 1) message.success(res.message)
            else
                navigate('/cart', {
                    state: [sku],
                })
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

    return (
        <>
            <Row
                gutter={[16, 16]}
                justify={'space-between'}
                style={{ marginBottom: 16 }}
            >
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div
                        style={{
                            position: 'sticky',
                            top: 16,
                            zIndex: 1,
                        }}
                    >
                        <Skeleton loading={loading}>
                            <Flex
                                vertical
                                gap={8}
                                style={{
                                    background: '#fff',
                                    padding: 16,
                                    borderRadius: 8,
                                    paddingBottom: 26,
                                }}
                            >
                                <Image
                                    preview={false}
                                    src={`${import.meta.env.VITE_BACKEND_URL}${imagePrimary?.url}`}
                                    height={400}
                                    style={{
                                        objectFit: 'contain',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: 8,
                                    }}
                                />
                                <LightGallery
                                    speed={500}
                                    mode="lg-fade"
                                    plugins={[lgThumbnail, lgZoom]}
                                    selector="a"
                                    download={false}
                                >
                                    <Flex style={{ overflow: 'auto' }}>
                                        {data?.images?.map((image) => (
                                            <a
                                                key={image.id}
                                                href={`${import.meta.env.VITE_BACKEND_URL}${image.url}`}
                                                data-src={`${import.meta.env.VITE_BACKEND_URL}${image.url}`}
                                                data-sub-html={`<h4>${data.title}</h4>`}
                                            >
                                                <Image
                                                    preview={false}
                                                    className="img-responsive"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}${image.url}`}
                                                    style={{
                                                        padding: 4,
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 4,
                                                        objectFit: 'contain',
                                                        border:
                                                            image.id ===
                                                            imagePrimary?.id
                                                                ? '2px solid #3795BD'
                                                                : 'none',
                                                    }}
                                                    onMouseEnter={() =>
                                                        setImagePrimary(image)
                                                    }
                                                />
                                            </a>
                                        ))}
                                    </Flex>
                                </LightGallery>

                                <Flex
                                    vertical
                                    gap={8}
                                    style={{ marginTop: 16 }}
                                >
                                    <Text
                                        style={{
                                            fontSize: size.text,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {common('label.quantity')}
                                    </Text>

                                    <Space>
                                        <Button
                                            disabled={quantity <= 1}
                                            onClick={() =>
                                                setQuantity((prev) => prev - 1)
                                            }
                                        >
                                            <MinusOutlined />
                                        </Button>
                                        <InputNumber
                                            value={quantity}
                                            onChange={(value) =>
                                                value >= 1 && setQuantity(value)
                                            }
                                            min={1}
                                            max={data?.stockQuantity}
                                            style={{ width: 60 }}
                                        />
                                        <Button
                                            disabled={
                                                quantity >= data?.stockQuantity
                                            }
                                            onClick={() =>
                                                setQuantity((prev) => prev + 1)
                                            }
                                        >
                                            <PlusOutlined />
                                        </Button>
                                    </Space>

                                    <Text
                                        style={{
                                            fontSize: size.text,
                                            fontWeight: 500,
                                            marginTop: 16,
                                        }}
                                    >
                                        {common('label.calculated')}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: size.priceLarge,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(quantity * data?.finalPrice)}
                                    </Text>

                                    <Space
                                        direction={'vertical'}
                                        size={'middle'}
                                        style={{ marginTop: 16 }}
                                    >
                                        <Button
                                            size="large"
                                            type="primary"
                                            loading={loading3}
                                            style={{
                                                width: '100%',
                                                fontSize: size.subtitle,
                                            }}
                                            onClick={addToCart}
                                        >
                                            {common('label.buy_now')}
                                        </Button>
                                        <Button
                                            size="large"
                                            style={{
                                                width: '100%',
                                                fontSize: size.subtitle,
                                            }}
                                            onClick={() => addToCart(1)}
                                            loading={loading2}
                                        >
                                            {common('label.add_cart')}
                                        </Button>
                                    </Space>
                                </Flex>
                            </Flex>
                        </Skeleton>
                    </div>
                </Col>

                <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={16}
                    xl={16}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    <Skeleton loading={loading}>
                        <Flex
                            vertical
                            gap={8}
                            style={{
                                background: '#fff',
                                padding: 16,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: size.title,
                                    fontWeight: 500,
                                }}
                            >
                                {data?.title}
                            </Text>

                            <Row justify={'space-between'}>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {common('module.author.label')}:{' '}
                                        {data?.authors}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {common('module.publisher.label')}:{' '}
                                        {data?.publisher?.name}
                                    </Text>
                                </Col>
                            </Row>

                            <Row justify={'space-between'}>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {common('module.book.form')}:{' '}
                                        {data?.form === 1
                                            ? common('module.book.form_1')
                                            : common('module.book.form_2')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {common('module.book.publish_year')}:{' '}
                                        {data?.publishYear}
                                    </Text>
                                </Col>
                            </Row>

                            <Space align={'center'}>
                                <Text
                                    strong
                                    style={{
                                        fontSize: size.priceLarge,
                                        color: '#d32f2f',
                                    }}
                                >
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(data?.finalPrice)}
                                </Text>
                                <Tag
                                    color="red"
                                    style={{ fontSize: size.subtext2 }}
                                >
                                    -{data?.discount}%
                                </Tag>
                                <Text
                                    delete
                                    type="secondary"
                                    style={{ fontSize: size.text }}
                                >
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(data?.sellingPrice)}
                                </Text>
                            </Space>

                            <Text
                                type="secondary"
                                style={{ fontSize: size.text }}
                            >
                                {common('module.book.sold_quantity')}{' '}
                                {data?.soldQuantity}
                            </Text>
                        </Flex>
                    </Skeleton>

                    <Skeleton loading={loading}>
                        <Flex
                            vertical
                            style={{
                                background: '#fff',
                                padding: 16,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: size.title,
                                    fontWeight: 500,
                                    marginBottom: 16,
                                }}
                            >
                                {common('label.detail')}
                            </Text>

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.book.isbn')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.isbn}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.author.label')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.authors}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.category.label')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.categories
                                            ?.map((item) => item.name)
                                            .join(', ')}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.publisher.label')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.publisher?.name}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.book.publish_year')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.publishYear}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.book.weight')} (gr)
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.weight}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.book.page_number')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.pageNumber}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '8px 0' }} />

                            <Row>
                                <Col span={12}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.text }}
                                    >
                                        {common('module.book.form')}
                                    </Text>
                                </Col>
                                <Col span={12}>
                                    <Text style={{ fontSize: size.text }}>
                                        {data?.form === 1
                                            ? common('module.book.form_1')
                                            : common('module.book.form_2')}
                                    </Text>
                                </Col>
                            </Row>
                        </Flex>
                    </Skeleton>

                    <Skeleton loading={loading}>
                        <Flex
                            vertical
                            style={{
                                background: '#fff',
                                padding: 16,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: size.title,
                                    fontWeight: 500,
                                    marginBottom: 16,
                                }}
                            >
                                {common('label.description')}
                            </Text>

                            <Paragraph
                                style={{ fontSize: size.text, marginBottom: 0 }}
                                ellipsis={{
                                    rows: 10,
                                    expandable: true,
                                    symbol: common('action.view_more'),
                                }}
                            >
                                {parse(data?.description)}
                            </Paragraph>
                        </Flex>
                    </Skeleton>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Flex
                        vertical
                        style={{
                            background: '#fff',
                            padding: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: size.title,
                                fontWeight: 500,
                                marginBottom: 16,
                            }}
                        >
                            {common('label.suggest')}
                        </Text>

                        <Skeleton loading={loading1}>
                            <Row
                                gutter={[16, 16]}
                                style={{ padding: '0 16px' }}
                            >
                                {suggest?.map((item) => (
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
                                    style={{
                                        textAlign: 'center',
                                        marginTop: 16,
                                    }}
                                >
                                    <Button
                                        style={{ fontSize: size.subtext }}
                                        onClick={() => navigate('/search')}
                                    >
                                        {common('action.view_more')}
                                    </Button>
                                </Col>
                            </Row>
                        </Skeleton>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export default BookDetailPage
