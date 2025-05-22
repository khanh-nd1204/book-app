import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'

const NotFoundPage = () => {
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()

    useEffect(() => {
        document.title = common('page.error')
    }, [])

    return (
        <Result
            status="404"
            title={
                <span style={{ fontSize: size.title, fontWeight: 500 }}>
                    404
                </span>
            }
            subTitle={
                <span style={{ fontSize: size.subtitle }}>
                    {common('error.not_found')}
                </span>
            }
            extra={
                <Button type="primary" style={{ fontSize: size.text }}>
                    <Link to={'/'}>{common('label.home')}</Link>
                </Button>
            }
        />
    )
}

export default NotFoundPage
