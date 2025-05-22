import { Form, Input, message, Modal, notification, Select } from 'antd'
const { TextArea } = Input
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'
import { cancelOrderAPI } from '../../services/order.service.js'

const CancelModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, id, getData, setCurrent } = props
    const [deleteForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const size = useResponsiveSize()
    const [selectedReason, setSelectedReason] = useState(null)

    const items = [
        {
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.cancel_reason_1')}
                </span>
            ),
            value: common('module.order.cancel_reason_1'),
        },
        {
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.cancel_reason_2')}
                </span>
            ),
            value: common('module.order.cancel_reason_2'),
        },
        {
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.cancel_reason_3')}
                </span>
            ),
            value: common('module.order.cancel_reason_3'),
        },
        {
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.order.cancel_reason_4')}
                </span>
            ),
            value: common('module.order.cancel_reason_4'),
        },
    ]

    const onFinish = async (values) => {
        const data = {
            id,
            reason:
                selectedReason === common('module.order.cancel_reason_4')
                    ? values.ortherReason
                    : values.reason,
        }

        setLoading(true)
        const res = await cancelOrderAPI(data)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            navigate('/purchase')
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
        setCurrent(1)
        getData()
    }, [setOpen])

    return (
        <Modal
            title={common('module.order.cancel')}
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
                            message: validation('cancel_reason.required'),
                        },
                    ]}
                >
                    <Select
                        options={items}
                        placeholder={common(
                            'module.order.cancel_select_placeholder'
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
                                message: validation('cancel_reason.required'),
                            },
                            {
                                max: 100,
                                message: validation('cancel_reason.max', {
                                    max: 100,
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            placeholder={common(
                                'module.order.cancel_input_placeholder'
                            )}
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    )
}

export default CancelModal
