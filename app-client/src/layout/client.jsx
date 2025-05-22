import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Link,
    ScrollRestoration,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {
    Avatar,
    Col,
    Dropdown,
    Flex,
    Image,
    Layout,
    message,
    notification,
    Row,
    Select,
    Space,
    theme,
    Typography,
    Grid,
    Menu,
    Button,
    Drawer,
    AutoComplete,
    Input,
    Tooltip,
} from 'antd'
import { logoutAccountAPI } from '../services/auth.service.js'
import { doLogoutAccountAction } from '../redux/account/accountSlice.js'
import viLogo from '../assets/logo/vi-logo.jpg'
import enLogo from '../assets/logo/en-logo.jpg'
import SettingModal from '../pages/auth/setting.jsx'
import logo from '../assets/logo/logo.png'
import {
    ArrowLeftOutlined,
    FacebookOutlined,
    GlobalOutlined,
    InstagramOutlined,
    MenuOutlined,
    TwitterOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { useResponsiveSize } from '../hook/useResponsiveSize.js'
import AppCart from '../components/app-cart.jsx'
import { doClearCartAction } from '../redux/cart/cartSlice.js'
import { getBooksAPI } from '../services/book.service.js'
const { Text, Title } = Typography
const { Header, Content, Footer } = Layout
const { useBreakpoint } = Grid
const { Option } = Select
import { sfAnd, sfEqual, sfLike, sfOr } from 'spring-filter-query-builder'
import { useDebouncedCallback } from 'use-debounce'
import NotificationBell from '../components/notification-bell.jsx'
const { Search } = Input

const ClientLayout = (props) => {
    const size = useResponsiveSize()
    const { t: common } = useTranslation('common')
    const user = useSelector((state) => state.account.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const [openChange, setOpenChange] = useState(false)
    const screens = useBreakpoint()
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(false)
    const location = useLocation()

    const logout = async () => {
        const res = await logoutAccountAPI()
        if (res && res.data) {
            dispatch(doLogoutAccountAction())
            dispatch(doClearCartAction())
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
        }
        if (key === 'account') {
            setOpenChange(true)
        }
        if (key === 'login') {
            navigate('/login')
        }
        if (key === 'register') {
            navigate('/register')
        }
        setOpen(false)
    }

    const items = user?.id
        ? [
              user.role &&
                  user.role.name === 'ADMIN' && {
                      label: <Link to={'/admin'}>{common('label.admin')}</Link>,
                      key: 'admin',
                  },
              {
                  label: common('label.setting'),
                  key: 'account',
              },
              {
                  label: (
                      <Link to={'/purchase'}>{common('page.purchase')}</Link>
                  ),
                  key: 'purchase',
              },
              {
                  label: common('label.logout'),
                  key: 'logout',
              },
          ]
        : [
              {
                  label: common('label.login'),
                  key: 'login',
              },
              {
                  label: common('label.register'),
                  key: 'register',
              },
          ]

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

    const onChangeLang = ({ key }) => {
        if (localStorage.getItem('lang') !== key) {
            localStorage.setItem('lang', key)
            window.location.reload()
        }
    }

    const fetchSuggestions = async (value) => {
        if (!value) {
            setOptions([])
            return
        }

        const filterStr = sfAnd([
            sfEqual('status', 1),
            sfOr([
                sfLike('title', value),
                sfLike('authors', value),
                sfLike('categories.name', value),
                sfLike('publisher.name', value),
            ]),
        ])

        const query = `page=${1}&size=${10}&filter=${filterStr}`

        setLoading(true)
        const res = await getBooksAPI(query)
        setLoading(false)

        if (res && res.data) {
            setOptions(
                res.data.data.map((book) => ({
                    value: book.sku,
                    label: (
                        <Space>
                            <Image
                                width={30}
                                height={40}
                                src={`${import.meta.env.VITE_BACKEND_URL}${book?.images[0]?.url}`}
                                preview={false}
                                style={{
                                    objectFit: 'cover',
                                }}
                            />

                            <Text
                                style={{
                                    fontSize: size.subtext,
                                    textWrap: 'wrap',
                                }}
                            >
                                {book.title.length > 50
                                    ? book.title.substring(0, 50) + '...'
                                    : book.title}
                            </Text>
                        </Space>
                    ),
                }))
            )
        }
    }

    const debounced = useDebouncedCallback((value) => {
        fetchSuggestions(value)
    }, 500)

    const onSearch = (value) => {
        setSearchText(value)
        debounced(value)
    }

    useEffect(() => {
        return () => debounced.cancel()
    }, [])

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Header
                    style={{
                        padding: '0 16px',
                        background: colorBgContainer,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    }}
                >
                    <Row justify={'center'}>
                        <Col xs={24} sm={24} md={24} lg={22} xl={20}>
                            <Flex
                                align={'center'}
                                justify={'space-between'}
                                style={{ width: '100%' }}
                            >
                                <Space>
                                    {location.pathname !== '/' && (
                                        <Button
                                            icon={<ArrowLeftOutlined />}
                                            variant={'filled'}
                                            color="default"
                                            onClick={() => navigate(-1)}
                                            style={{ marginRight: 16 }}
                                        />
                                    )}
                                    <Image
                                        preview={false}
                                        src={logo}
                                        style={{
                                            height: size.logo,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate('/')}
                                    />
                                </Space>

                                <AutoComplete
                                    value={searchText}
                                    options={options}
                                    onSearch={onSearch}
                                    onSelect={(value) => {
                                        navigate(`/book?sku=${value}`)
                                        setSearchText('')
                                        setOptions([])
                                    }}
                                    style={{
                                        width: screens.md ? '40%' : '60%',
                                    }}
                                >
                                    <Search
                                        placeholder={common('action.search')}
                                        enterButton
                                        loading={loading}
                                        size={screens.md ? 'large' : 'middle'}
                                        onSearch={(value) => {
                                            navigate(
                                                value
                                                    ? `/search?query=${encodeURIComponent(value)}`
                                                    : '/search'
                                            )
                                            setSearchText('')
                                            setOptions([])
                                        }}
                                    />
                                </AutoComplete>

                                <Flex align={'center'} gap={8}>
                                    {user && user?.id && (
                                        <>
                                            <AppCart />

                                            <NotificationBell
                                                userId={user.id}
                                            />
                                        </>
                                    )}

                                    {screens.md ? (
                                        <Flex align={'center'} gap={8}>
                                            {user?.id ? (
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
                                                            background:
                                                                '#EBEDEF',
                                                        }}
                                                        size={36}
                                                    >
                                                        <Text
                                                            strong
                                                            style={{
                                                                fontSize:
                                                                    size.subtitle,
                                                                color: '#080809',
                                                            }}
                                                        >
                                                            {user.name[0]}
                                                        </Text>
                                                    </Avatar>
                                                </Dropdown>
                                            ) : (
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
                                                            background:
                                                                '#EBEDEF',
                                                        }}
                                                        size={36}
                                                    >
                                                        <UserOutlined
                                                            style={{
                                                                fontSize:
                                                                    size.subtitle,
                                                                color: '#080809',
                                                            }}
                                                        />
                                                    </Avatar>
                                                </Dropdown>
                                            )}

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
                                                                    preview={
                                                                        false
                                                                    }
                                                                    src={
                                                                        localStorage.getItem(
                                                                            'lang'
                                                                        ) ===
                                                                        'en'
                                                                            ? enLogo
                                                                            : viLogo
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    }
                                                />
                                            </Dropdown>
                                        </Flex>
                                    ) : (
                                        <Button
                                            type="text"
                                            icon={<MenuOutlined />}
                                            onClick={() => setOpen(true)}
                                        />
                                    )}

                                    <Drawer
                                        title="Menu"
                                        placement="right"
                                        onClose={() => setOpen(false)}
                                        open={open}
                                    >
                                        <Menu
                                            mode="vertical"
                                            items={items}
                                            selectedKeys={null}
                                            onClick={onClick}
                                        />
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '16px',
                                            }}
                                        >
                                            <Select
                                                defaultValue={
                                                    localStorage.getItem(
                                                        'lang'
                                                    ) || 'vi'
                                                }
                                                onChange={onChangeLang}
                                                style={{ width: '80%' }}
                                                suffixIcon={<GlobalOutlined />}
                                            >
                                                <Option value="vi">
                                                    {common('label.lang_vi')}
                                                </Option>
                                                <Option value="en">
                                                    {common('label.lang_en')}
                                                </Option>
                                            </Select>
                                        </div>
                                    </Drawer>
                                </Flex>
                            </Flex>
                        </Col>
                    </Row>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        // padding: '16px 120px',
                        // background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Row justify={'center'}>
                        <Col xs={24} sm={24} md={24} lg={22} xl={20}>
                            {props.children}
                            <ScrollRestoration />
                        </Col>
                    </Row>
                </Content>

                <Footer
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Space direction={'vertical'}>
                                <Title style={{ fontSize: size.text }}>
                                    {common('footer.about')}
                                </Title>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.desc')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.info')}
                                </Text>
                                <Space size="middle" style={{ marginTop: 8 }}>
                                    <FacebookOutlined
                                        style={{
                                            fontSize: size.icon,
                                            color: '#1890ff',
                                        }}
                                    />
                                    <TwitterOutlined
                                        style={{
                                            fontSize: size.icon,
                                            color: '#1DA1F2',
                                        }}
                                    />
                                    <InstagramOutlined
                                        style={{
                                            fontSize: size.icon,
                                            color: '#E4405F',
                                        }}
                                    />
                                </Space>
                            </Space>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Title style={{ fontSize: size.title }}>
                                {common('footer.service')}
                            </Title>
                            <Space
                                direction="vertical"
                                style={{ color: '#d9d9d9' }}
                            >
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.clause')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.info_security')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.payment_security')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.intro')}
                                </Text>
                            </Space>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Title style={{ fontSize: size.title }}>
                                {common('footer.categories')}
                            </Title>
                            <Space
                                direction="vertical"
                                style={{ color: '#d9d9d9' }}
                            >
                                <Text style={{ fontSize: size.text }}>
                                    Sách văn học
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    Sách thiếu nhi
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    Sách kinh tế
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    Sách khoa học
                                </Text>
                            </Space>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Title style={{ fontSize: size.title }}>
                                {common('footer.support')}
                            </Title>
                            <Space
                                direction="vertical"
                                style={{ color: '#d9d9d9' }}
                            >
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.warranty')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.payment_method')}
                                </Text>
                                <Text style={{ fontSize: size.text }}>
                                    {common('footer.contact')}
                                </Text>
                            </Space>
                        </Col>
                    </Row>

                    <Row justify="center" style={{ marginTop: 24 }}>
                        <Text
                            style={{
                                fontSize: size.subtext,
                                color: '#d9d9d9',
                            }}
                        >
                            {common('footer.copyright')}
                        </Text>
                    </Row>
                </Footer>
            </Layout>
            <SettingModal
                openChange={openChange}
                setOpenChange={setOpenChange}
            />
        </Layout>
    )
}

export default ClientLayout
