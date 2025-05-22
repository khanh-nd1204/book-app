import { Flex } from 'antd'
import RevenueSummary from '../../../components/revenue-summary.jsx'
import RevenueChart from '../../../components/revenue-chart.jsx'
import TopProducts from '../../../components/top-products.jsx'

const DashboardPage = () => {
    return (
        <Flex vertical gap={16} style={{ backgroundColor: '#f8f8f8' }}>
            <RevenueSummary />

            <RevenueChart />

            <TopProducts />
        </Flex>
    )
}

export default DashboardPage
