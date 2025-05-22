import { Form, Input, message, Modal, notification, Select } from 'antd'
import { useEffect, useState } from 'react'
import { updateUserAPI } from '../../../services/user.service.js'
import { useDispatch, useSelector } from 'react-redux'
import { doUpdateAccountAction } from '../../../redux/account/accountSlice.js'
import { useTranslation } from 'react-i18next'

const UpdateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData, selected, setSelected, roleList } = props
    const [updateForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.account.user)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selected) {
            updateForm.setFieldsValue({
                name: selected?.name,
                phone: selected?.phone,
                address: selected?.address,
                roleId: selected?.role?.id,
            })
        }
    }, [selected])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await updateUserAPI({ ...values, id: selected?.id })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            if (selected?.id === user.id) {
                dispatch(doUpdateAccountAction(res.data))
            }
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

export default UpdateModal
