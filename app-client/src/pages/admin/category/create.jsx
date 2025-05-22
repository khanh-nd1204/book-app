import { Form, Image, Input, message, Modal, notification, Upload } from 'antd'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createCategoryAPI } from '../../../services/category.service.js'
import { uploadFileAPI } from '../../../services/file.service.js'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const CreateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData } = props
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [loadingImage, setLoadingImage] = useState(false)
    const [image, setImage] = useState()

    const onFinish = async (values) => {
        if (!image) {
            message.error(validation('category_image.required'))
            return
        }
        setLoading(true)
        const res = await createCategoryAPI({ ...values, imageId: image?.id })
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

    const dummyRequest = async ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok')
        }, 1000)
    }

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            message.error(common('module.file.image'))
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error(common('module.file.image_size'))
        }
        return isJpgOrPng && isLt2M
    }

    const onChangeFile = async (info) => {
        if (info.file.status === 'uploading') {
            setLoadingImage(true)
            setImage('')
            return
        }
        if (info.file.status === 'done') {
            const file = info.file.originFileObj
            const res = await uploadFileAPI(file, 'category')
            setLoadingImage(false)
            if (res.data) {
                setImage(res.data)
                message.success(res.message)
            } else {
                notification.error({
                    message: res.error,
                    description: res.message,
                    duration: 2,
                })
            }
        }
    }

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                {common('module.file.upload')}
            </div>
        </button>
    )

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
                    label={common('module.category.name')}
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
                    label={common('module.category.symbol')}
                    name="symbol"
                    rules={[
                        {
                            required: true,
                            message: validation('symbol.required'),
                        },
                        {
                            max: 10,
                            message: validation('symbol.max', {
                                max: 10,
                            }),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={common('module.category.image')} required>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        multiple={false}
                        accept=".png, .jpeg, .jpg"
                        maxCount={1}
                        customRequest={dummyRequest}
                        beforeUpload={beforeUpload}
                        onChange={onChangeFile}
                    >
                        {image ? (
                            <Image
                                src={`${import.meta.env.VITE_BACKEND_URL}${image.url}`}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal
