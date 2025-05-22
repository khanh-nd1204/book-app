import { Form, Input, message, Modal, notification } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cancelImportAPI } from '../../../services/import.service.js'

const CancelModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, id } = props
    const [deleteForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        const res = await cancelImportAPI({ id: id, ...values })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            navigate('/admin/import')
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

    const resetForm = useCallback(() => {
        setOpen(false)
        deleteForm.resetFields()
    }, [setOpen])

    return (
        <Modal
            title={common('module.import.cancel')}
            open={open}
            onOk={() => deleteForm.submit()}
            onCancel={resetForm}
            maskClosable={false}
            confirmLoading={loading}
            okText={common('action.confirm')}
            cancelText={common('action.cancel')}
        >
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={deleteForm}
                style={{ padding: '8px 0' }}
            >
                <Form.Item
                    label={common('label.cancel_reason')}
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: validation('cancel_reason.required'),
                        },
                        {
                            max: 200,
                            message: validation('cancel_reason.max', {
                                max: 200,
                            }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CancelModal
