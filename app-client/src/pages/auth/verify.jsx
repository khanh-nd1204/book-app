import { Form, Input, message, Modal, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { activateAccountAPI } from '../../services/auth.service.js'
import { useNavigate } from 'react-router-dom'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'

const VerifyModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const { open, setOpen, email } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        values.otp = Number(values.otp)
        setLoading(true)
        const res = await activateAccountAPI({ ...values, email })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            navigate('/login')
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
        <Modal
            title={
                <span style={{ fontSize: size.text }}>
                    {common('module.account.activate')}
                </span>
            }
            open={open}
            onOk={() => form.submit()}
            onCancel={resetForm}
            maskClosable={false}
            confirmLoading={loading}
            okText={
                <span style={{ fontSize: size.text }}>
                    {common('action.save')}
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
                <Form.Item
                    label={<span style={{ fontSize: size.text }}>OTP</span>}
                    name="otp"
                    rules={[
                        {
                            required: true,
                            message: (
                                <span style={{ fontSize: size.text }}>
                                    {validation('otp.required')}
                                </span>
                            ),
                        },
                        {
                            pattern: /^[0-9]{6}$/,
                            message: (
                                <span style={{ fontSize: size.text }}>
                                    {validation('otp.invalid')}
                                </span>
                            ),
                        },
                    ]}
                >
                    <Input.OTP length={6} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default VerifyModal
