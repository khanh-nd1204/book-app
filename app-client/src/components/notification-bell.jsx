import { useState, useCallback, useEffect } from 'react'
import {
    Badge,
    Popover,
    List,
    Typography,
    Button,
    notification,
    Flex,
    Grid,
    Avatar,
} from 'antd'
const { useBreakpoint } = Grid
import {
    BellFilled,
    CloseCircleFilled,
    ExclamationCircleFilled,
    InfoCircleFilled,
} from '@ant-design/icons'
import useNotificationSocket from '../hook/useNotificationSocket.js'
import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../hook/useResponsiveSize.js'
import {
    getNotificationsAPI,
    maskReadAllNotificationAPI,
} from '../services/notification.service.js'

const { Text } = Typography

const NotificationBell = ({ userId, position }) => {
    const [notifications, setNotifications] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const [loading, setLoading] = useState(false)
    const screens = useBreakpoint()
    const [refreshTrigger, setRefreshTrigger] = useState(false)

    useEffect(() => {
        if (!userId) {
            return
        }
        getData()
    }, [userId, current, refreshTrigger])

    const getData = async () => {
        const query = `page=${current}&size=${pageSize}&sort=createdAt,desc`
        setLoading(true)
        const res = await getNotificationsAPI(query)
        if (res && res.data) {
            setNotifications((prev) =>
                current === 1 ? res.data.data : [...prev, ...res.data.data]
            )
            setCurrent(res.data.page)
            setPageSize(res.data.size)
            setTotal(res.data.totalElements)
        } else {
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
        setLoading(false)
    }

    const maskAllRead = async () => {
        const res = await maskReadAllNotificationAPI()
        if (res && !res.error) {
            if (res.data > 0) {
                setCurrent(1)
                setNotifications([])
                setRefreshTrigger((prev) => prev + 1)
            }
        } else {
            console.error(res.error)
        }
    }

    const handleNewNotification = useCallback((noti) => {
        setNotifications((prev) => {
            const isDuplicate = prev.some((n) => n.id === noti.id)
            return isDuplicate ? prev : [noti, ...prev.slice(0, 4)]
        })
    }, [])

    useNotificationSocket(userId, handleNewNotification)

    const content = (
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
            <List
                size="small"
                dataSource={notifications}
                locale={{
                    emptyText: common('module.notification.empty'),
                }}
                loading={current === 1 && loading}
                rowKey={(item) => item.id}
                renderItem={(item) => {
                    let icon = <InfoCircleFilled style={{ color: '#1890ff' }} />
                    if (item.type === 2) {
                        icon = (
                            <ExclamationCircleFilled
                                style={{ color: '#faad14' }}
                            />
                        )
                    } else if (item.type === 3) {
                        icon = (
                            <CloseCircleFilled style={{ color: '#f5222d' }} />
                        )
                    }

                    return (
                        <List.Item style={{ marginLeft: -12 }}>
                            <Flex
                                gap={8}
                                style={{ maxWidth: screens.md ? 280 : 200 }}
                            >
                                <div style={{ fontSize: size.subtitle }}>
                                    {icon}
                                </div>
                                <div>
                                    <Text
                                        strong={!item.read}
                                        style={{ fontSize: size.subtext }}
                                    >
                                        {item.content}
                                    </Text>
                                    <br />
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: size.subtext2 }}
                                    >
                                        {item.createdAt}
                                    </Text>
                                </div>
                            </Flex>
                        </List.Item>
                    )
                }}
            />
            {notifications.length < total && !loading && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Button
                        type="link"
                        size="small"
                        style={{ fontSize: size.subtext }}
                        onClick={() => setCurrent((prev) => prev + 1)}
                        loading={current !== 1 && loading}
                    >
                        {common('action.view_more')}
                    </Button>
                </div>
            )}
        </div>
    )

    return (
        <Popover
            content={content}
            title={
                <Flex align={'center'} justify={'space-between'} gap={24}>
                    <span style={{ fontSize: size.text }}>
                        {common('module.notification.label')}
                    </span>
                    {notifications.length > 0 && (
                        <Button
                            variant={'filled'}
                            color="default"
                            size={'small'}
                            style={{ fontSize: size.subtext }}
                            onClick={maskAllRead}
                        >
                            {common('module.notification.mark')}
                        </Button>
                    )}
                </Flex>
            }
            placement={position || 'bottom'}
        >
            <Badge
                count={notifications.filter((n) => !n.read).length}
                overflowCount={99}
                size="small"
            >
                <Avatar
                    size={36}
                    style={{
                        cursor: 'pointer',
                        background: '#EBEDEF',
                    }}
                >
                    <BellFilled
                        style={{ fontSize: size.subtitle, color: '#080809' }}
                    />
                </Avatar>
            </Badge>
        </Popover>
    )
}

export default NotificationBell
