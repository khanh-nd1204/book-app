import { Form, Input, message, Modal, notification } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { updateSupplierAPI } from '../../../services/supplier.service.js'
const { TextArea } = Input

const UpdateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData, selected, setSelected } = props
    const [updateForm] = Form.useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selected) {
            updateForm.setFieldsValue({
                name: selected?.name,
                address: selected?.address,
                taxCode: selected?.taxCode,
                note: selected?.note,
            })
        }
    }, [selected])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await updateSupplierAPI({ ...values, id: selected?.id })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            await getData()
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
        setSelected({})
        updateForm.resetFields()
    }

    return (
        <Modal
            title={common('action.update')}
            open={open}
            onOk={() => updateForm.submit()}
            forceRender
            onCancel={resetForm}
            maskClosable={false}
            confirmLoading={loading}
            okText={common('action.save')}
            cancelText={common('action.cancel')}
        >
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={updateForm}
                style={{ padding: '8px 0' }}
            >
                <Form.Item
                    label={common('module.supplier.name')}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: validation('name.required'),
                        },
                        {
                            max: 100,
                            message: validation('name.max', { max: 100 }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.supplier.address')}
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: validation('address.required'),
                        },
                        {
                            max: 100,
                            message: validation('address.max', {
                                max: 100,
                            }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.supplier.tax_code')}
                    name="taxCode"
                    rules={[
                        {
                            required: true,
                            message: validation('tax_code.required'),
                        },
                        {
                            max: 13,
                            message: validation('tax_code.max', {
                                max: 13,
                            }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('label.note')}
                    name="note"
                    rules={[
                        {
                            max: 500,
                            message: validation('note.max', {
                                max: 500,
                            }),
                        },
                    ]}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateModal
