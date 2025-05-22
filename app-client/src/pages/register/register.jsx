import {
    Avatar,
    Button,
    Col,
    Divider,
    Flex,
    Form,
    Image,
    Input,
    message,
    notification,
    Row,
    Select,
} from 'antd'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Typography } from 'antd'
import bgLogin from '../../assets/logo/bg-login.jpg'
import { useTranslation } from 'react-i18next'
import viLogo from '../../assets/logo/vi-logo.jpg'
import enLogo from '../../assets/logo/en-logo.jpg'
import VerifyModal from '../auth/verify.jsx'
import { registerAccountAPI } from '../../services/auth.service.js'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
const { Title, Text } = Typography

const RegisterPage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const size = useResponsiveSize()
    const [registerForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState()

    useEffect(() => {
        document.title = common('page.register')
    }, [])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await registerAccountAPI(values)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            setEmail(values.email)
            setOpen(true)
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

    return (
        <>
            <Flex
                justify={'center'}
                align={'center'}
                style={{
                    minHeight: '100vh',
                    padding: 16,
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
                            size={'large'}
                            form={registerForm}
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
                                        {common('label.register')}
                                    </Title>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.user.name')}
                                        name="name"
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
                                                            'name.required'
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
                                                            'name.max',
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

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.user.email')}
                                        name="email"
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

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.user.password')}
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
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.user.address')}
                                        name="address"
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
                                                            'address.required'
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
                                                            'address.max',
                                                            {
                                                                max: 20,
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

                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label={common('module.user.phone')}
                                        name="phone"
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
                                                            'phone.required'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                pattern: new RegExp(
                                                    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
                                                ),
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'phone.invalid'
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                max: 10,
                                                min: 10,
                                                message: (
                                                    <span
                                                        style={{
                                                            fontSize: size.text,
                                                        }}
                                                    >
                                                        {validation(
                                                            'phone.length',
                                                            {
                                                                length: 10,
                                                            }
                                                        )}
                                                    </span>
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    registerForm.submit()
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 16 }}>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button
                                            style={{
                                                width: '100%',
                                                fontSize: size.text,
                                            }}
                                            type="primary"
                                            onClick={() =>
                                                registerForm.submit()
                                            }
                                            loading={loading}
                                        >
                                            {common('label.register')}
                                        </Button>
                                    </Form.Item>
                                    <Divider />
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            fontSize: size.text,
                                        }}
                                    >
                                        {common('module.account.login')}{' '}
                                        <Link to={'/login'}>
                                            {common('label.login')}
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Flex>

            <VerifyModal email={email} open={open} setOpen={setOpen} />
        </>
    )
}

export default RegisterPage
