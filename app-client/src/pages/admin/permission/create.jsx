import { Form, Input, message, Modal, notification, Select } from 'antd'
import { useState } from 'react'
import { createPermissionAPI } from '../../../services/permission.service.js'
import { useTranslation } from 'react-i18next'

const CreateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData } = props
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values) => {
        setLoading(true)
        const res = await createPermissionAPI(values)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            await getData()
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
        createForm.resetFields()
    }

    const modules = [
        {
            value: 'USER',
            label: 'USER',
        },
        {
            value: 'ROLE',
            label: 'ROLE',
        },
        {
            value: 'PERMISSION',
            label: 'PERMISSION',
        },
        {
            value: 'PUBLISHER',
            label: 'PUBLISHER',
        },
        {
            value: 'SUPPLIER',
            label: 'SUPPLIER',
        },
        {
            value: 'CATEGORY',
            label: 'CATEGORY',
        },
        {
            value: 'BOOK',
            label: 'BOOK',
        },
        {
            value: 'FILE',
            label: 'FILE',
        },
        {
            value: 'LOG',
            label: 'LOG',
        },
        {
            value: 'ORDER',
            label: 'ORDER',
        },
    ]

    const methods = [
        {
            value: 'GET',
            label: 'GET',
        },
        {
            value: 'POST',
            label: 'POST',
        },
        {
            value: 'PATCH',
            label: 'PATCH',
        },
        {
            value: 'DELETE',
            label: 'DELETE',
        },
    ]

    return (
        <Modal
            title={common('action.create')}
            open={open}
            onOk={() => createForm.submit()}
            onCancel={resetForm}
            maskClosable={false}
            confirmLoading={loading}
            okText={common('action.save')}
            cancelText={common('action.create')}
        >
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={createForm}
                style={{ padding: '8px 0' }}
            >
                <Form.Item
                    label={common('module.permission.name')}
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
                    label={common('module.permission.api')}
                    name="apiPath"
                    rules={[
                        {
                            required: true,
                            message: validation('api.required'),
                        },
                        {
                            max: 100,
                            message: validation('api.max', { max: 100 }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.permission.method')}
                    name="method"
                    rules={[
                        {
                            required: true,
                            message: validation('method.required'),
                        },
                        {
                            max: 100,
                            message: validation('method.max', { max: 100 }),
                        },
                    ]}
                >
                    <Select
                        placeholder={common(
                            'module.permission.method_placeholder'
                        )}
                        options={methods}
                    />
                </Form.Item>

                <Form.Item
                    label={common('module.permission.module')}
                    name="module"
                    rules={[
                        {
                            required: true,
                            message: validation('module.required'),
                        },
                        {
                            max: 100,
                            message: validation('module.max', { max: 100 }),
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder={common(
                            'module.permission.module_placeholder'
                        )}
                        optionFilterProp="label"
                        options={modules}
                    />
                </Form.Item>

                <Form.Item
                    label={common('module.permission.description')}
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: validation('description.required'),
                        },
                        {
                            max: 100,
                            message: (
                                <>
                                    {validation('description.max', {
                                        max: 100,
                                    })}
                                </>
                            ),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal
