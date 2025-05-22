import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    Descriptions,
    Flex,
    message,
    notification,
    Table,
    Tag,
} from 'antd'
import { useEffect, useState } from 'react'
import {
    confirmOrderAPI,
    getOrderAPI,
} from '../../../services/order.service.js'
import ExportPDF from './export-pdf.jsx'
import RejectModal from './reject.jsx'

const OrderViewPage = () => {
    const { t: common } = useTranslation('common')
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const { orderId } = useParams()
    const [orderDetail, setOrderDetail] = useState()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getData()
    }, [orderId])

    const getData = async () => {
        setLoading(true)
        const res = await getOrderAPI(orderId)
        setLoading(false)
        if (res && res.data) {
            setOrderDetail(res.data)
        } else {
            setOrderDetail(null)
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
        { value: -1, text: common('module.order.status_-1'), color: 'gray' },
        { value: 0, text: common('module.order.status_0'), color: 'red' },
        { value: 1, text: common('module.order.status_1'), color: 'yellow' },
        { value: 2, text: common('module.order.status_2'), color: 'blue' },
        { value: 3, text: common('module.order.status_3'), color: 'orange' },
        { value: 4, text: common('module.order.status_4'), color: 'purple' },
        { value: 5, text: common('module.order.status_5'), color: 'green' },
    ]

    const columns = [
        {
            title: common('module.book.sku'),
            dataIndex: 'book',
            key: 'sku',
            render: (book) => book.sku,
        },
        {
            title: common('module.book.title'),
            dataIndex: 'book',
            key: 'title',
            render: (book) => book.title,
        },
        {
            title: common('module.book.isbn'),
            dataIndex: 'book',
            key: 'isbn',
            render: (book) => book.isbn,
        },
        {
            title: common('label.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: common('module.book.unit_price'),
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (_, { unitPrice }) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(unitPrice),
            align: 'center',
        },
        {
            title: common('label.total_price'),
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, { totalPrice }) =>
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(totalPrice),
            align: 'center',
        },
    ]

    const confirmOrder = async () => {
        setLoading1(true)
        const res = await confirmOrderAPI(orderDetail?.id)
        setLoading1(false)
        if (res && res.data) {
            message.success(res.message)
            navigate('/admin/order')
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
        <Card
            title={
                <Flex justify={'space-between'} align={'center'}>
                    <>{`${common('module.order.detail')} #${orderDetail?.id}`}</>
                    {orderDetail?.status === 5 && (
                        <ExportPDF order={orderDetail} />
                    )}
                </Flex>
            }
            loading={loading}
        >
            <Descriptions bordered column={2} style={{ padding: 8 }}>
                <Descriptions.Item label={common('module.order.name')}>
                    {orderDetail?.name}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.order.email')}>
                    {orderDetail?.email}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.order.phone')}>
                    {orderDetail?.phone}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.order.address')}>
                    {orderDetail?.address}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.order.total_price')}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    }).format(orderDetail?.totalPrice)}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.order.method')}>
                    {orderDetail?.method === 1
                        ? common('module.order.method_1')
                        : orderDetail?.method === 2
                          ? common('module.order.method_2')
                          : common('module.order.method_3')}
                </Descriptions.Item>

                <Descriptions.Item label={common('module.order.invoice')}>
                    {orderDetail?.invoice
                        ? common('module.order.invoice_1')
                        : common('module.order.invoice_0')}
                </Descriptions.Item>

                <Descriptions.Item label={common('module.order.payment')}>
                    {orderDetail?.isPayment
                        ? common('module.order.payment_1')
                        : common('module.order.payment_0')}
                </Descriptions.Item>

                <Descriptions.Item label={common('module.order.status')}>
                    <Tag
                        color={
                            statusMap.find(
                                (item) => item.value === orderDetail?.status
                            )?.color
                        }
                    >
                        {
                            statusMap.find(
                                (item) => item.value === orderDetail?.status
                            )?.text
                        }
                    </Tag>
                </Descriptions.Item>
                {orderDetail?.status === -1 && (
                    <Descriptions.Item label={common('label.reject_reason')}>
                        {orderDetail?.reason}
                    </Descriptions.Item>
                )}
                {orderDetail?.status === 0 && (
                    <Descriptions.Item label={common('label.cancel_reason')}>
                        {orderDetail?.reason}
                    </Descriptions.Item>
                )}

                <Descriptions.Item label={common('module.order.created_at')}>
                    {orderDetail?.createdAt}
                </Descriptions.Item>

                <Descriptions.Item label={common('module.order.created_by')}>
                    {orderDetail?.createdBy}
                </Descriptions.Item>

                {orderDetail?.status >= 2 && (
                    <Descriptions.Item
                        label={common('module.order.confirmed_at')}
                    >
                        {orderDetail?.confirmedAt}
                    </Descriptions.Item>
                )}
                {orderDetail?.status === 5 && (
                    <Descriptions.Item
                        label={common('module.order.delivered_at')}
                    >
                        {orderDetail?.deliveredAt}
                    </Descriptions.Item>
                )}

                {orderDetail?.status === 0 && (
                    <Descriptions.Item
                        label={common('module.order.canceled_at')}
                    >
                        {orderDetail?.canceledAt}
                    </Descriptions.Item>
                )}

                {orderDetail?.status === -1 && (
                    <Descriptions.Item
                        label={common('module.order.rejected_at')}
                    >
                        {orderDetail?.rejectedAt}
                    </Descriptions.Item>
                )}

                <Descriptions.Item label={common('label.updated_by')}>
                    {orderDetail?.updatedBy}
                </Descriptions.Item>

                {orderDetail?.note && (
                    <Descriptions.Item label={common('label.note')}>
                        {orderDetail?.note}
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Table
                style={{ marginTop: 16 }}
                dataSource={orderDetail?.orderItems}
                columns={columns}
                rowKey={(record) => record.book.sku}
                pagination={{
                    showSizeChanger: true,
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
                    emptyText: common('label.no_data'),
                }}
            />

            {orderDetail?.status === 1 && (
                <Flex align={'center'} justify={'center'} gap={8}>
                    <Button danger type="primary" onClick={() => setOpen(true)}>
                        {common('action.reject')}
                    </Button>
                    <Button
                        type="primary"
                        loading1={loading1}
                        onClick={confirmOrder}
                    >
                        {common('action.confirm')}
                    </Button>
                </Flex>
            )}

            <RejectModal open={open} setOpen={setOpen} id={orderDetail?.id} />
        </Card>
    )
}

export default OrderViewPage
