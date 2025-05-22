import { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { getTopProductsAPI } from '../services/revenue.service.js'
import { Bar } from '@ant-design/plots'
import enLocale from 'antd/es/date-picker/locale/en_US.js'
import viLocale from 'antd/es/date-picker/locale/vi_VN.js'
const { RangePicker } = DatePicker

const TopProducts = () => {
    const [data, setData] = useState([])
    const [date, setDate] = useState([dayjs().subtract(7, 'day'), dayjs()])
    const [loading, setLoading] = useState(false)
    const { t: common } = useTranslation('common')
    const [limit, setLimit] = useState(5)

    const locale =
        localStorage.getItem('lang') && localStorage.getItem('lang') === 'en'
            ? enLocale
            : viLocale

    const fetchProducts = async () => {
        setLoading(true)
        const res = await getTopProductsAPI(
            dayjs(date[0]),
            dayjs(date[1]),
            limit
        )
        if (res && res.data) {
            setData(res.data)
        } else {
            console.log(res.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const config = {
        data,
        xField: 'productName',
        yField: 'quantitySold',
        legend: false,
        tooltip: {
            title: '',
            items: [
                { channel: 'x', name: common('module.book.title') },
                { channel: 'y', name: common('module.book.sold_quantity') },
            ],
        },
        loading: loading,
        interactions: [{ type: 'active-region' }],
        label: {
            position: 'right',
            style: {
                fill: '#fff',
                fontSize: 14,
                fontWeight: 600,
            },
        },
    }

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day') + 1
    }

    return (
        <Card title={common('module.revenue.seller')}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col>
                    <RangePicker
                        onChange={(value, dateString) => {
                            setDate(dateString)
                        }}
                        disabledDate={disabledDate}
                        locale={locale}
                        defaultValue={date}
                    />
                </Col>

                <Col>
                    <Select value={limit} onChange={setLimit}>
                        <Select.Option value={5}>5</Select.Option>
                        <Select.Option value={10}>10</Select.Option>
                        <Select.Option value={20}>20</Select.Option>
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" onClick={fetchProducts}>
                        {common('action.filter')}
                    </Button>
                </Col>
            </Row>
            <Bar {...config} />
        </Card>
    )
}

export default TopProducts
