import { useEffect, useState } from 'react'
import { Card, DatePicker, Select, Row, Col, Button } from 'antd'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import enLocale from 'antd/es/date-picker/locale/en_US.js'
import viLocale from 'antd/es/date-picker/locale/vi_VN.js'
import { getChartRevenueAPI } from '../services/revenue.service.js'
const { RangePicker } = DatePicker

const RevenueChart = () => {
    const [data, setData] = useState([])
    const [groupBy, setGroupBy] = useState('DAY')
    const [date, setDate] = useState([dayjs().subtract(7, 'day'), dayjs()])
    const [loading, setLoading] = useState(false)
    const { t: common } = useTranslation('common')

    const locale =
        localStorage.getItem('lang') && localStorage.getItem('lang') === 'en'
            ? enLocale
            : viLocale

    const fetchChart = async () => {
        setLoading(true)
        const res = await getChartRevenueAPI(
            dayjs(date[0]),
            dayjs(date[1]),
            groupBy
        )
        if (res && res.data) {
            setData(res.data)
        } else {
            console.log(res.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchChart()
    }, [])

    const config = {
        data,
        xField: 'label',
        yField: 'total',
        smooth: true,
        point: {
            shapeField: 'circle',
            sizeField: 4,
        },
        tooltip: {
            title: '',
            items: [
                { channel: 'x', name: common('module.revenue.date') },
                { channel: 'y', name: common('module.revenue.label') },
            ],
        },
        loading: loading,
    }

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day') + 1
    }

    return (
        <Card
            title={common('module.revenue.chart')}
            style={{ borderRadius: 8 }}
        >
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
                    <Select
                        value={groupBy}
                        onChange={setGroupBy}
                        style={{ width: 120 }}
                    >
                        <Select.Option value="DAY">
                            {common('module.revenue.group_day')}
                        </Select.Option>
                        <Select.Option value="MONTH">
                            {common('module.revenue.group_month')}
                        </Select.Option>
                    </Select>
                </Col>
                <Col>
                    <Button type="primary" onClick={fetchChart}>
                        {common('action.filter')}
                    </Button>
                </Col>
            </Row>
            <Line {...config} />
        </Card>
    )
}

export default RevenueChart
