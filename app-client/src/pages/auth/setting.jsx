import { useEffect, useState } from 'react'
import { Form, Input, message, Modal, notification, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeUserPasswordAPI,
    updateUserAPI,
} from '../../services/user.service.js'
import { doUpdateAccountAction } from '../../redux/account/accountSlice.js'
import { useTranslation } from 'react-i18next'
import { useResponsiveSize } from '../../hook/useResponsiveSize.js'

const SettingModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const size = useResponsiveSize()
    const { openChange, setOpenChange } = props
    const [userForm] = Form.useForm()
    const [passwordForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.account.user)
    const dispatch = useDispatch()
    const [current, setCurrent] = useState('info')

    useEffect(() => {
        if (user) {
            userForm.setFieldsValue({
                name: user.name,
                phone: user.phone,
                address: user.address,
            })
        }
    }, [user])

    const onFinish = async (values) => {
        setLoading(true)
        const res = await updateUserAPI({
            id: user.id,
            ...values,
            roleId: user.role.id,
        })
        setLoading(false)
        if (res && res.data) {
            dispatch(doUpdateAccountAction(res.data))
            message.success(res.message)
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

    const changePassword = async (values) => {
        setLoading(true)
        const res = await changeUserPasswordAPI({ id: user.id, ...values })
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
        } else {
            notification.error({
                message: res.error,
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 3,
            })
        }
    }

    const resetForm = () => {
        setOpenChange(false)
        userForm.resetFields()
        passwordForm.resetFields()
    }

    const infoTab = (
        <Form
            onFinish={onFinish}
            autoComplete="off"
            layout={'vertical'}
            form={userForm}
            style={{ padding: '8px 0' }}
        >
            <Form.Item
                label={
                    <span style={{ fontSize: size.text }}>
                        {common('module.user.name')}
                    </span>
                }
                name="name"
                rules={[
                    {
                        required: true,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('name.required')}
                            </span>
                        ),
                    },
                    {
                        max: 100,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('name.max', { max: 100 })}
                            </span>
                        ),
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={
                    <span style={{ fontSize: size.text }}>
                        {common('module.user.phone')}
                    </span>
                }
                name="phone"
                rules={[
                    {
                        required: true,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('phone.required')}
                            </span>
                        ),
                    },
                    {
                        pattern: new RegExp(
                            /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g
                        ),
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('phone.invalid')}
                            </span>
                        ),
                    },
                    {
                        max: 10,
                        min: 10,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('phone.length', { length: 10 })}
                            </span>
                        ),
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label={
                    <span style={{ fontSize: size.text }}>
                        {common('module.user.address')}
                    </span>
                }
                name="address"
                rules={[
                    {
                        required: true,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('address.required')}
                            </span>
                        ),
                    },
                    {
                        max: 100,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('address.max', { max: 100 })}
                            </span>
                        ),
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </Form>
    )

    const passwordTab = (
        <Form
            onFinish={changePassword}
            autoComplete="off"
            layout={'vertical'}
            form={passwordForm}
            style={{ padding: '8px 0' }}
        >
            <Form.Item
                name="currentPassword"
                label={
                    <span style={{ fontSize: size.text }}>
                        {common('module.account.current_password')}
                    </span>
                }
                rules={[
                    {
                        required: true,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('password.current_required')}
                            </span>
                        ),
                    },
                    {
                        max: 20,
                        min: 6,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('password.length', {
                                    min: 6,
                                    max: 20,
                                })}
                            </span>
                        ),
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="newPassword"
                label={
                    <span style={{ fontSize: size.text }}>
                        {common('module.account.new_password')}
                    </span>
                }
                rules={[
                    {
                        required: true,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('password.new_required')}
                            </span>
                        ),
                    },
                    {
                        max: 20,
                        min: 6,
                        message: (
                            <span style={{ fontSize: size.text }}>
                                {validation('password.length', {
                                    min: 6,
                                    max: 20,
                                })}
                            </span>
                        ),
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
        </Form>
    )

    const items = [
        {
            key: 'info',
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.account.update')}
                </span>
            ),
            children: infoTab,
        },
        !user.googleId && {
            key: 'password',
            label: (
                <span style={{ fontSize: size.text }}>
                    {common('module.account.change_password')}
                </span>
            ),
            children: passwordTab,
        },
    ]

    return (
        <Modal
            title={
                <span style={{ fontSize: size.text }}>
                    {common('module.account.setting')}
                </span>
            }
            open={openChange}
            width={500}
            onOk={() => {
                current === 'info' ? userForm.submit() : passwordForm.submit()
            }}
            forceRender
            onCancel={() => setOpenChange(false)}
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
            <Tabs
                defaultActiveKey="info"
                items={items}
                onChange={(key) => setCurrent(key)}
            />
        </Modal>
    )
}

export default SettingModal
