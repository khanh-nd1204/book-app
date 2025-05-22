import { useEffect, useState } from 'react'
import { Card, Statistic, Row, Col, DatePicker, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import enLocale from 'antd/es/date-picker/locale/en_US.js'
import viLocale from 'antd/es/date-picker/locale/vi_VN.js'
import dayjs from 'dayjs'
import { getSummaryRevenueAPI } from '../services/revenue.service.js'
const { RangePicker } = DatePicker

const RevenueSummary = () => {
    const [data, setData] = useState(null)
    const [date, setDate] = useState([dayjs().subtract(7, 'day'), dayjs()])
    const [loading, setLoading] = useState(true)
    const { t: common } = useTranslation('common')

    const locale =
        localStorage.getItem('lang') && localStorage.getItem('lang') === 'en'
            ? enLocale
            : viLocale

    const fetchSummary = async () => {
        const res = await getSummaryRevenueAPI(dayjs(date[0]), dayjs(date[1]))
        if (res && res.data) {
            setData(res.data)
        } else {
            console.log(res.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day') + 1
    }

    return (
        <Card
            title={common('module.revenue.summary')}
            loading={loading}
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
                    <Button type="primary" onClick={fetchSummary}>
                        {common('action.filter')}
                    </Button>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={6}>
                    <Statistic
                        title={common('module.revenue.total_revenue')}
                        value={new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(data?.totalRevenue)}
                        precision={2}
                    />
                </Col>
                <Col span={4}>
                    <Statistic
                        title={common('module.revenue.total_order')}
                        value={new Intl.NumberFormat('vi-VN').format(
                            data?.orderCount
                        )}
                    />
                </Col>
                <Col span={4}>
                    <Statistic
                        title={common('module.revenue.finished')}
                        value={new Intl.NumberFormat('vi-VN').format(
                            data?.finishedCount
                        )}
                    />
                </Col>
                <Col span={4}>
                    <Statistic
                        title={common('module.revenue.canceled')}
                        value={new Intl.NumberFormat('vi-VN').format(
                            data?.canceledCount
                        )}
                    />
                </Col>
                <Col span={4}>
                    <Statistic
                        title={common('module.revenue.rejected')}
                        value={new Intl.NumberFormat('vi-VN').format(
                            data?.rejectedCount
                        )}
                    />
                </Col>
            </Row>
        </Card>
    )
}

export default RevenueSummary
