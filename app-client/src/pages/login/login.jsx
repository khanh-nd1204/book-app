import {
    Avatar,
    Button,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    message,
    notification,
    Row,
    Select,
    Space,
    Image,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginAccountAPI, loginGoogleAPI } from '../../services/auth.service.js'
import { doLoginAccountAction } from '../../redux/account/accountSlice.js'
import { Typography } from 'antd'
import bgLogin from '../../assets/logo/bg-login.jpg'
import MailModal from '../auth/mail.jsx'
import { useTranslation } from 'react-i18next'
import viLogo from '../../assets/logo/vi-logo.jpg'
import enLogo from '../../assets/logo/en-logo.jpg'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { GoogleOutlined } from '@ant-design/icons'
const { Title, Text, Link } = Typography

const LoginPage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const size = useResponsiveSize()
    const [loginForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [type, setType] = useState()
    const [loading1, setLoading1] = useState(false)

    useEffect(() => {
        document.title = common('page.login')
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await loginAccountAPI(values)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            dispatch(doLoginAccountAction(res.data))
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

    const onChangeLang = (value) => {
        localStorage.setItem('lang', value)
        window.location.reload()
    }

    const loginWithGoogle = async () => {
        setLoading1(true)
        const res = await loginGoogleAPI()
        if (res && res.data) {
            window.location.href = res.data
        } else {
            console.log(res.error)
        }
        setLoading1(false)
    }

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                style={{
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${bgLogin})`,
                    backgroundSize: 'cover',
                }}
            >
                <Row justify={'center'} style={{ width: '100%', padding: 24 }}>
                    <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                        <Form
                            onFinish={onFinish}
                            autoComplete="off"
                            layout={'vertical'}
                            form={loginForm}
                            size={'large'}
                            style={{
                                background: '#fff',
                                boxShadow:
                                    'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                                borderRadius: 8,
                                padding: '48px 24px',
                                position: 'relative',
                            }}
                        >
                            <Select
                                defaultValue={
                                    localStorage.getItem('lang') || 'vi'
                                }
                                size="small"
                                variant="borderless"
                                style={{
                                    border: 'none',
                                    position: 'absolute',
                                    top: 24,
                                    right: 8,
                                }}
                                onChange={onChangeLang}
                                options={[
                                    {
                                        value: 'vi',
                                        label: (
                                            <Avatar
                                                size="small"
                                                src={
                                                    <Image
                                                        preview={false}
                                                        src={viLogo}
                                                        alt="lang"
                                                    />
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        value: 'en',
                                        label: (
                                            <Avatar
                                                size="small"
                                                src={
                                                    <Image
                                                        preview={false}
                                                        src={enLogo}
                                                        alt="lang"
                                                    />
                                                }
                                            />
                                        ),
                                    },
                                ]}
                            />

                            <Row style={{ marginBottom: 16 }}>
                                <Col span={24}>
                                    <Title
                                        style={{
                                            fontSize: size.title,
                                            textAlign: 'center',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {common('label.login')}
                                    </Title>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            <Text
                                                style={{
                                                    fontSize: size.text,
                                                }}
                                            >
                                                {common('module.user.email')}
                                            </Text>
                                        }
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'email.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                type: 'email',
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'email.invalid'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 100,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'email.max',
                                                            {
                                                                max: 100,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row justify={'center'}>
                                <Col span={24}>
                                    <Form.Item
                                        label={
                                            <Flex
                                                align={'center'}
                                                justify={'space-between'}
                                                style={{ width: '100%' }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: size.text,
                                                    }}
                                                >
                                                    {common(
                                                        'module.user.password'
                                                    )}
                                                </Text>
                                                <Button
                                                    type="link"
                                                    style={{
                                                        padding: 0,
                                                        fontSize: size.text,
                                                    }}
                                                    onClick={() => {
                                                        setType(2)
                                                        setOpen(true)
                                                    }}
                                                >
                                                    {common(
                                                        'module.account.forgot_password'
                                                    )}
                                                </Button>
                                            </Flex>
                                        }
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'password.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 20,
                                                min: 6,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'password.length',
                                                            {
                                                                min: 6,
                                                                max: 20,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    loginForm.submit()
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 16 }} justify={'center'}>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button
                                            style={{
                                                width: '100%',
                                                fontSize: size.text,
                                            }}
                                            type="primary"
                                            onClick={() => loginForm.submit()}
                                            loading={loading}
                                        >
                                            {common('label.login')}
                                        </Button>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item>
                                        <Button
                                            style={{
                                                width: '100%',
                                                fontSize: size.text,
                                            }}
                                            type="primary"
                                            icon={
                                                <GoogleOutlined
                                                    style={{
                                                        fontSize: size.subtitle,
                                                    }}
                                                />
                                            }
                                            onClick={loginWithGoogle}
                                            loading={loading1}
                                        >
                                            {common('label.login_google')}
                                        </Button>
                                    </Form.Item>
                                    <Space
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Link
                                            style={{ fontSize: size.text }}
                                            onClick={() =>
                                                navigate('/register')
                                            }
                                        >
                                            {common('label.register')}
                                        </Link>
                                        <span>|</span>
                                        <Link
                                            style={{ fontSize: size.text }}
                                            onClick={() => {
                                                setType(1)
                                                setOpen(true)
                                            }}
                                        >
                                            {common('module.account.activate')}
                                        </Link>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Flex>

            <MailModal open={open} setOpen={setOpen} type={type} />
        </>
    )
}

export default LoginPage
