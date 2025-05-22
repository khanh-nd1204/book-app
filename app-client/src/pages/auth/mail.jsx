import {
    Col,
    Form,
    Input,
    message,
    Modal,
    notification,
    Row,
    Typography,
} from 'antd'
import { useState } from 'react'
import PasswordModal from './password.jsx'
import { useTranslation } from 'react-i18next'
import Verify from './verify.jsx'
import { sendMailAPI } from '../../services/auth.service.js'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
const { Text } = Typography

const MailModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const { open, setOpen, type } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [openPassword, setOpenPassword] = useState(false)
    const [openVerify, setOpenVerify] = useState(false)
    const [email, setEmail] = useState('')

    const onFinish = async (values) => {
        setLoading(true)
        const res = await sendMailAPI({ ...values, type })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            setEmail(values.email)
            if (type === 1) {
                setOpenVerify(true)
            }
            if (type === 2) {
                setOpenPassword(true)
            }
            resetForm()
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

    const resetForm = () => {
        setOpen(false)
        form.resetFields()
    }

    return (
        <>
            <Modal
                title={
                    <Text style={{ fontSize: size.title }}>
                        {common('module.account.find')}
                    </Text>
                }
                open={open}
                onOk={() => form.submit()}
                onCancel={resetForm}
                maskClosable={false}
                confirmLoading={loading}
                okText={
                    <span style={{ fontSize: size.text }}>
                        {common('action.continue')}
                    </span>
                }
                cancelText={
                    <span style={{ fontSize: size.text }}>
                        {common('action.cancel')}
                    </span>
                }
            >
                <Form
                    onFinish={onFinish}
                    autoComplete="off"
                    layout={'vertical'}
                    form={form}
                    style={{ padding: '8px 0' }}
                >
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={24}>
                            <Text style={{ fontSize: size.text }}>
                                {common('module.account.email_desc')}
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label=""
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <span
                                                style={{ fontSize: size.text }}
                                            >
                                                {validation('email.required')}
                                            </span>
                                        ),
                                    },
                                    {
                                        type: 'email',
                                        message: (
                                            <span
                                                style={{ fontSize: size.text }}
                                            >
                                                {validation('email.invalid')}
                                            </span>
                                        ),
                                    },
                                    {
                                        max: 100,
                                        message: (
                                            <span
                                                style={{ fontSize: size.text }}
                                            >
                                                {validation('email.max', {
                                                    max: 100,
                                                })}
                                            </span>
                                        ),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <PasswordModal
                open={openPassword}
                setOpen={setOpenPassword}
                email={email}
            />
            <Verify open={openVerify} setOpen={setOpenVerify} email={email} />
        </>
    )
}

export default MailModal
