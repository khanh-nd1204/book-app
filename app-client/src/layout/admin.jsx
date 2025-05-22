import { useEffect, useState } from 'react'
import {
    AppstoreOutlined,
    DollarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    SettingOutlined,
    ShoppingOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    Dropdown,
    Flex,
    Image,
    Layout,
    Menu,
    message,
    notification,
    Space,
    theme,
    Tooltip,
    Typography,
} from 'antd'
import {
    Link,
    ScrollRestoration,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import logo from '../assets/logo/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAccountAPI } from '../services/auth.service.js'
import { doLogoutAccountAction } from '../redux/account/accountSlice.js'
import SettingModal from '../pages/auth/setting.jsx'
import viLogo from '../assets/logo/vi-logo.jpg'
import enLogo from '../assets/logo/en-logo.jpg'
import { useTranslation } from 'react-i18next'
import NotificationBell from '../components/notification-bell.jsx'
import { useResponsiveSize } from '../hook/useResponsiveSize.js'
const { Text } = Typography

const { Header, Sider, Content, Footer } = Layout

const AdminLayout = (props) => {
    const { t: common } = useTranslation('common')
    const [collapsed, setCollapsed] = useState(false)
    const user = useSelector((state) => state.account.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [current, setCurrent] = useState('')
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const [openChange, setOpenChange] = useState(false)
    const location = useLocation()
    const size = useResponsiveSize()

    useEffect(() => {
        document.title = common('page.admin')
    }, [])

    useEffect(() => {
        if (location && location.pathname) {
            const currentRoute = location.pathname.slice(
                location.pathname.lastIndexOf('/') + 1
            )
            setCurrent(currentRoute)
        }
    }, [location])

    const logout = async () => {
        const res = await logoutAccountAPI()
        if (res && res.data) {
            dispatch(doLogoutAccountAction())
            message.success(res.message)
            navigate('/')
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

    const onClick = ({ key }) => {
        if (key === 'logout') {
            logout()
        } else if (key === 'account') {
            setOpenChange(true)
        }
    }

    const items = [
        {
            label: <Link to={'/'}>{common('label.home')}</Link>,
            key: 'home',
        },
        {
            label: common('label.setting'),
            key: 'account',
        },
        {
            label: common('label.logout'),
            key: 'logout',
        },
    ]

    const onChangeLang = ({ key }) => {
        console.log(key)
        if (localStorage.getItem('lang') !== key) {
            localStorage.setItem('lang', key)
            window.location.reload()
        }
    }

    const langOptions = [
        {
            key: 'vi',
            label: (
                <Tooltip title={common('label.lang_vi')} placement={'left'}>
                    <Avatar
                        size="small"
                        src={<Image preview={false} src={viLogo} alt="vi" />}
                    />
                </Tooltip>
            ),
        },
        {
            key: 'en',
            label: (
                <Tooltip title={common('label.lang_en')} placement={'left'}>
                    <Avatar
                        size="small"
                        src={<Image preview={false} src={enLogo} alt="en" />}
                    />
                </Tooltip>
            ),
        },
    ]

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
                style={{ position: 'fixed', top: 0, bottom: 0, zIndex: 1 }}
            >
                <Flex
                    align="center"
                    justify="center"
                    gap={8}
                    style={{ padding: 8 }}
                >
                    <Image
                        preview={false}
                        src={logo}
                        style={{ height: 48, cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </Flex>
                <Menu
                    theme="light"
                    mode="inline"
                    style={{ borderInlineEndStyle: 'none' }}
                    selectedKeys={[current]}
                    items={[
                        {
                            key: 'admin',
                            icon: <DollarOutlined />,
                            label: (
                                <Link to={'/admin'}>
                                    {common('label.revenue')}
                                </Link>
                            ),
                        },
                        {
                            key: 'system',
                            icon: <SettingOutlined />,
                            label: common('label.system'),
                            children: [
                                {
                                    key: 'user',
                                    label: (
                                        <Link to={'/admin/user'}>
                                            {common('module.user.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'role',
                                    label: (
                                        <Link to={'/admin/role'}>
                                            {common('module.role.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'permission',
                                    label: (
                                        <Link to={'/admin/permission'}>
                                            {common('module.permission.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'log',
                                    label: (
                                        <Link to={'/admin/log'}>
                                            {common('label.log')}
                                        </Link>
                                    ),
                                },
                            ],
                        },
                        {
                            key: 'books',
                            icon: <ReadOutlined />,
                            label: common('module.book.label'),
                            children: [
                                {
                                    key: 'book',
                                    label: (
                                        <Link to={'/admin/book'}>
                                            {common('module.book.list')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'import',
                                    label: (
                                        <Link to={'/admin/import'}>
                                            {common('module.import.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'export',
                                    label: (
                                        <Link to={'/admin/export'}>
                                            {common('module.export.label')}
                                        </Link>
                                    ),
                                },
                            ],
                        },
                        {
                            key: 'order',
                            icon: <ShoppingOutlined />,
                            label: (
                                <Link to={'/admin/order'}>
                                    {common('module.order.label')}
                                </Link>
                            ),
                        },
                        {
                            key: 'categories',
                            icon: <AppstoreOutlined />,
                            label: common('label.category'),
                            children: [
                                {
                                    key: 'category',
                                    label: (
                                        <Link to={'/admin/category'}>
                                            {common('module.category.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'publisher',
                                    label: (
                                        <Link to={'/admin/publisher'}>
                                            {common('module.publisher.label')}
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'supplier',
                                    label: (
                                        <Link to={'/admin/supplier'}>
                                            {common('module.supplier.label')}
                                        </Link>
                                    ),
                                },
                            ],
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: 16,
                            width: 64,
                            height: 64,
                            marginLeft: collapsed ? '80px' : '200px',
                        }}
                    />

                    <Space style={{ paddingRight: 16 }}>
                        <NotificationBell
                            userId={user.id}
                            position="bottomRight"
                        />

                        <Dropdown
                            menu={{
                                items,
                                onClick,
                            }}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <Avatar
                                style={{
                                    cursor: 'pointer',
                                    background: '#EBEDEF',
                                }}
                                size={36}
                            >
                                <Text
                                    strong
                                    style={{
                                        fontSize: size.subtitle,
                                        color: '#080809',
                                    }}
                                >
                                    {user.name[0]}
                                </Text>
                            </Avatar>
                        </Dropdown>

                        <Dropdown
                            menu={{
                                items: langOptions,
                                onClick: onChangeLang,
                            }}
                            placement="bottom"
                            arrow
                        >
                            <Button
                                type="link"
                                icon={
                                    <Avatar
                                        size={36}
                                        src={
                                            <Image
                                                preview={false}
                                                src={
                                                    localStorage.getItem(
                                                        'lang'
                                                    ) === 'en'
                                                        ? enLogo
                                                        : viLogo
                                                }
                                            />
                                        }
                                    />
                                }
                            />
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{ marginLeft: collapsed ? '96px' : '200px' }}>
                    <div
                        style={{
                            margin: '24px 16px',
                            // padding: '0 16px 24px',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {props.children}
                        <ScrollRestoration />
                    </div>
                </Content>
            </Layout>

            <SettingModal
                openChange={openChange}
                setOpenChange={setOpenChange}
            />
        </Layout>
    )
}
export default AdminLayout
