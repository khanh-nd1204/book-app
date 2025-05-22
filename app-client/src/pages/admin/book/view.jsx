import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Card,
    Descriptions,
    notification,
    Image,
    Tag,
    Typography,
    Flex,
} from 'antd'
import { getBookAPI } from '../../../services/book.service.js'
import parse from 'react-html-parser'

const BookViewPage = () => {
    const { t: common } = useTranslation('common')
    const [loading, setLoading] = useState(false)
    const { bookSku } = useParams()
    const [bookDetail, setBookDetail] = useState()

    useEffect(() => {
        getData()
    }, [bookSku])

    const getData = async () => {
        setLoading(true)
        const res = await getBookAPI(bookSku)
        setLoading(false)
        if (res && res.data) {
            setBookDetail(res.data)
        } else {
            setBookDetail(null)
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }

    const statusMap = [
        { value: -1, text: common('module.book.status_-1'), color: 'gray' },
        { value: 0, text: common('module.book.status_0'), color: 'red' },
        { value: 1, text: common('module.book.status_1'), color: 'green' },
    ]

    return (
        <Card
            title={`${common('module.book.detail')} ${bookDetail?.sku}`}
            loading={loading}
        >
            <Descriptions bordered column={2} style={{ padding: 8 }}>
                <Descriptions.Item label={common('module.book.sku')}>
                    {bookDetail?.sku}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.title')}>
                    {bookDetail?.title}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.isbn')}>
                    {bookDetail?.isbn}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.author.label')}>
                    {bookDetail?.authors}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.publisher.label')}>
                    {bookDetail?.publisher?.name}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.category.label')}>
                    {bookDetail?.categories
                        ?.map((item) => item.name)
                        .join(', ')}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.publish_year')}>
                    {bookDetail?.publishYear}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.import_price')}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(bookDetail?.importPrice)}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.profit')}>
                    <Tag color={'green'}>{bookDetail?.profit}%</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.selling_price')}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(bookDetail?.sellingPrice)}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.discount')}>
                    <Tag color={'red'}>{bookDetail?.discount}%</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.final_price')}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(bookDetail?.finalPrice)}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.stock_quantity')}>
                    {new Intl.NumberFormat('vi-VN').format(
                        bookDetail?.stockQuantity
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.sold_quantity')}>
                    {new Intl.NumberFormat('vi-VN').format(
                        bookDetail?.soldQuantity
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.weight')}>
                    {bookDetail?.weight} gam
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.page_number')}>
                    {`${bookDetail?.pageNumber} ${common('pagination.page')}`}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.form')}>
                    {bookDetail?.from === 1
                        ? common('module.book.form_1')
                        : common('module.book.form_2')}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.book.status')}>
                    <Tag
                        color={
                            statusMap.find(
                                (item) => item.value === bookDetail?.status
                            )?.color
                        }
                    >
                        {
                            statusMap.find(
                                (item) => item.value === bookDetail?.status
                            )?.text
                        }
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={common('label.created_at')}>
                    {bookDetail?.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.created_by')}>
                    {bookDetail?.createdBy}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.updated_at')}>
                    {bookDetail?.updatedAt}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.updated_by')}>
                    {bookDetail?.updatedBy}
                </Descriptions.Item>
            </Descriptions>

            <Flex style={{ padding: 8 }} gap={16} vertical>
                <div>
                    <Image.PreviewGroup>
                        {bookDetail?.images.map((image) => (
                            <Image
                                key={image.id}
                                width={100}
                                height={100}
                                src={`${import.meta.env.VITE_BACKEND_URL}${image.url}`}
                                style={{ marginRight: 10 }}
                            />
                        ))}
                    </Image.PreviewGroup>
                </div>

                <Typography.Paragraph
                    ellipsis={{
                        rows: 4,
                        expandable: true,
                        symbol: common('action.view_more'),
                    }}
                >
                    {parse(bookDetail?.description)}
                </Typography.Paragraph>
            </Flex>
        </Card>
    )
}
export default BookViewPage
