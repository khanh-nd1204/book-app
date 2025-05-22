import { Form, Input, message, Modal, notification, Select } from 'antd'
const { TextArea } = Input
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { rejectOrderAPI } from '../../../services/order.service.js'

const RejectModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, id } = props
    const [deleteForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [selectedReason, setSelectedReason] = useState(null)

    const items = [
        {
            label: common('module.order.reject_reason_1'),
            value: common('module.order.reject_reason_1'),
        },
        {
            label: common('module.order.reject_reason_2'),
            value: common('module.order.reject_reason_2'),
        },
        {
            label: common('module.order.reject_reason_3'),
            value: common('module.order.reject_reason_3'),
        },
        {
            label: common('module.order.reject_reason_4'),
            value: common('module.order.reject_reason_4'),
        },
    ]

    const onFinish = async (values) => {
        const data = {
            id,
            reason:
                selectedReason === common('module.order.reject_reason_4')
                    ? values.ortherReason
                    : values.reason,
        }

        setLoading(true)
        const res = await rejectOrderAPI(data)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            navigate('/admin/order')
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
            title={common('module.order.reject')}
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
                    label=""
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: validation('reject_reason.required'),
                        },
                    ]}
                >
                    <Select
                        options={items}
                        placeholder={common(
                            'module.order.reject_select_placeholder'
                        )}
                        onChange={(value) => setSelectedReason(value)}
                    />
                </Form.Item>

                {selectedReason === common('module.order.cancel_reason_4') && (
                    <Form.Item
                        label=""
                        name="ortherReason"
                        rules={[
                            {
                                required: true,
                                message: validation('reject_reason.required'),
                            },
                            {
                                max: 100,
                                message: validation('reject_reason.max', {
                                    max: 100,
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            placeholder={common(
                                'module.order.reject_input_placeholder'
                            )}
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    )
}

export default RejectModal
