import {
    Button,
    Col,
    Form,
    message,
    notification,
    Row,
    Space,
    Image,
    Upload,
    Select,
    InputNumber,
    Input,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { uploadFileAPI } from '../../../services/file.service.js'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { createBookAPI } from '../../../services/book.service.js'
import dayjs from 'dayjs'

const BookCreatePage = () => {
    const { t: common } = useTranslation('common')
    const { t: validation } = useTranslation('validation')
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [images, setImages] = useState([])
    const [imagesTemp, setImagesTemp] = useState([])
    const [loadingImage, setLoadingImage] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const publishers = JSON.parse(localStorage.getItem('publishers'))
    const categories = JSON.parse(localStorage.getItem('categories'))

    const onFinish = async (values) => {
        const filteredImages = images
            .filter((item1) =>
                imagesTemp.some(
                    (item2) =>
                        item2.status === 'done' && item2.uid === item1.uid
                )
            )
            .map((item) => item.id)
        if (filteredImages.length === 0) {
            message.error(common('module.book.image_upload'))
            return
        }
        const data = {
            ...values,
            imageIds: filteredImages,
        }
        setLoading(true)
        const res = await createBookAPI(data)
        setLoading(false)
        if (res && res.data) {
            message.success(res.message)
            resetForm()
            navigate('/admin/book')
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
        createForm.resetFields()
    }

    const dummyRequest = async ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok')
        }, 1000)
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            message.error(common('module.file.image'))
            file.status = 'error'
        }
        const isLt1M = file.size / 1024 / 1024 < 2
        if (!isLt1M) {
            message.error(common('module.file.image_size'))
            file.status = 'error'
        }
        return isJpgOrPng && isLt1M
    }

    const handleChange = (info) => {
        setImagesTemp(info.fileList)
        if (info.file.status === 'uploading') {
            setLoadingImage(true)
            return
        }
        if (info.file.status === 'done') {
            uploadImage(info.file.originFileObj)
            setLoadingImage(false)
        }
    }

    const uploadImage = async (file) => {
        const res = await uploadFileAPI(file, 'book')
        if (res.data) {
            setImages((image) => [
                ...image,
                {
                    id: res.data.id,
                    uid: file.uid,
                },
            ])
            // message.success(res.message);
        } else {
            notification.error({
                message: 'Error',
                description: res.message,
                duration: 2,
            })
        }
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewOpen(true)
    }

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                {common('action.create')}
            </div>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={createForm}
                style={{ padding: '8px 0' }}
                initialValues={{
                    stockQuantity: 0,
                    soldQuantity: 0,
                    importPrice: 0,
                    form: 2,
                }}
            >
                <Row gutter={24}>
                    <Col span={10}>
                        <Form.Item
                            label={common('module.book.title')}
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: validation('title.required'),
                                },
                                {
                                    max: 100,
                                    message: validation('title.max', {
                                        max: 100,
                                    }),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item
                            label={common('module.category.label')}
                            name="categoryIds"
                            rules={[
                                {
                                    required: true,
                                    message: validation('category.required'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={common(
                                    'module.book.category_placeholder'
                                )}
                                optionFilterProp="label"
                                options={categories}
                                mode="multiple"
                                allowClear
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.publish_year')}
                            name="publishYear"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'publish_year.required'
                                    ),
                                },
                            ]}
                        >
                            <InputNumber
                                min={1950}
                                max={dayjs().year()}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            label={common('module.book.isbn')}
                            name="isbn"
                            rules={[
                                {
                                    max: 13,
                                    min: 13,
                                    message: validation('isbn.length', {
                                        length: 13,
                                    }),
                                },
                                {
                                    pattern: /^\d+$/,
                                    message: validation('isbn.invalid'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={common('module.author.label')}
                            name="authors"
                            rules={[
                                {
                                    required: true,
                                    message: validation('author.required'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label={common('module.publisher.label')}
                            name="publisherId"
                            rules={[
                                {
                                    required: true,
                                    message: validation('publisher.required'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={common(
                                    'module.book.publisher_placeholder'
                                )}
                                optionFilterProp="label"
                                options={publishers}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.stock_quantity')}
                            name="stockQuantity"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'stock_quantity.required'
                                    ),
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                parser={(value) =>
                                    value?.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.sold_quantity')}
                            name="soldQuantity"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'sold_quantity.required'
                                    ),
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                parser={(value) =>
                                    value?.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.import_price')}
                            name="importPrice"
                            rules={[
                                {
                                    required: true,
                                    message: validation(
                                        'import_price.required'
                                    ),
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                parser={(value) =>
                                    value?.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.weight')}
                            name="weight"
                            rules={[
                                {
                                    required: true,
                                    message: validation('weight.required'),
                                },
                            ]}
                        >
                            <InputNumber
                                min={100}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                addonAfter="gam"
                                parser={(value) =>
                                    value?.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.page_number')}
                            name="pageNumber"
                            rules={[
                                {
                                    required: true,
                                    message: validation('page_number.required'),
                                },
                            ]}
                        >
                            <InputNumber
                                min={100}
                                style={{ width: '100%' }}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                addonAfter={common('pagination.page')}
                                parser={(value) =>
                                    value?.replace(/\$\s?|(,*)/g, '')
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col span={4}>
                        <Form.Item
                            label={common('module.book.form')}
                            name="form"
                            rules={[
                                {
                                    required: true,
                                    message: validation('form.required'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder={common(
                                    'module.book.form_placeholder'
                                )}
                                optionFilterProp="label"
                                options={[
                                    {
                                        label: common('module.book.form_1'),
                                        value: 1,
                                    },
                                    {
                                        label: common('module.book.form_2'),
                                        value: 2,
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            label={common('module.book.description')}
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: validation('description.required'),
                                },
                                {
                                    max: 2000,
                                    message: validation('description.max', {
                                        max: 2000,
                                    }),
                                },
                            ]}
                        >
                            <ReactQuill className="bg-white" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label={common('module.book.image')} required>
                            <div>
                                <Upload
                                    multiple
                                    name="images"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    accept=".png, .jpeg, .jpg"
                                    maxCount={10}
                                    customRequest={dummyRequest}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info)}
                                    onPreview={handlePreview}
                                    fileList={imagesTemp}
                                >
                                    {imagesTemp &&
                                    imagesTemp.length >= 10 ? null : (
                                        <div>
                                            {loadingImage ? (
                                                <LoadingOutlined />
                                            ) : (
                                                <PlusOutlined />
                                            )}
                                            <div style={{ marginTop: 8 }}>
                                                {common('module.file.upload')}
                                            </div>
                                        </div>
                                    )}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify={'center'}>
                    <Space>
                        <Button
                            style={{ width: '100%' }}
                            onClick={() => navigate('/admin/book')}
                        >
                            {common('action.cancel')}
                        </Button>
                        <Button
                            style={{ width: '100%' }}
                            type="primary"
                            onClick={() => createForm.submit()}
                            loading={loading}
                        >
                            {common('action.save')}
                        </Button>
                    </Space>
                </Row>
            </Form>
        </div>
    )
}

export default BookCreatePage
