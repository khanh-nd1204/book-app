import { Form, Input, message, Modal, notification, Select } from 'antd'
import { useCallback, useState } from 'react'
import { createUserAPI } from '../../../services/user.service.js'
import { useTranslation } from 'react-i18next'

const CreateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData, roleList } = props
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values) => {
        setLoading(true)
        const res = await createUserAPI(values)
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

    const resetForm = useCallback(() => {
        setOpen(false)
        createForm.resetFields()
    }, [setOpen, createForm])

    return (
        <Modal
            title={common('action.create')}
            open={open}
            onOk={() => createForm.submit()}
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
                form={createForm}
                style={{ padding: '8px 0' }}
            >
                <Form.Item
                    label={common('module.user.name')}
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
                    label={common('module.user.email')}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: validation('email.required'),
                        },
                        {
                            type: 'email',
                            message: validation('email.invalid'),
                        },
                        {
                            max: 100,
                            message: validation('email.max', { max: 100 }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.user.password')}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: validation('password.required'),
                        },
                        {
                            max: 20,
                            min: 6,
                            message: (
                                <>
                                    {validation('password.length', {
                                        min: 6,
                                        max: 20,
                                    })}
                                </>
                            ),
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={common('module.user.phone')}
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: validation('phone.required'),
                        },
                        {
                            pattern: new RegExp(
                                /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
                            ),
                            message: validation('phone.invalid'),
                        },
                        {
                            max: 10,
                            min: 10,
                            message: (
                                <>
                                    {validation('phone.length', { length: 10 })}
                                </>
                            ),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.user.address')}
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: validation('address.required'),
                        },
                        {
                            max: 100,
                            message: validation('address.max', { max: 100 }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={common('module.user.role')}
                    name="roleId"
                    rules={[
                        {
                            required: true,
                            message: validation('role.required'),
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder={common('module.user.role_placeholder')}
                        optionFilterProp="label"
                        options={roleList}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal
