import { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { message, Modal, notification, Table, Upload } from 'antd'
import * as xlsx from 'xlsx'
import sampleFile from './template.xlsx?url'
import { useTranslation } from 'react-i18next'
import { createBulkUserAPI } from '../../../services/user.service.js'

const ImportModal = (props) => {
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData } = props
    const [loading, setLoading] = useState(false)
    const { Dragger } = Upload
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const dummyRequest = async ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok')
        }, 1000)
    }

    const uploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file
            if (status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (status === 'done') {
                message.success(common('module.file.upload_success'))
                if (info.file && info.file.originFileObj) {
                    const file = info.file.originFileObj
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const data = e.target.result
                        const workbook = xlsx.read(data, { type: 'array' })
                        const sheetName = workbook.SheetNames[0]
                        const worksheet = workbook.Sheets[sheetName]
                        const json = xlsx.utils.sheet_to_json(worksheet, {
                            header: [
                                'name',
                                'email',
                                'phone',
                                'address',
                                'roleName',
                            ],
                            range: 1,
                        })
                        if (json && json.length > 0) {
                            const data = json.map(
                                (item) =>
                                    (item = { ...item, password: '123456' })
                            ) // password default
                            setData(data)
                        }
                    }
                    reader.readAsArrayBuffer(file)
                }
            } else if (status === 'error') {
                message.error(common('module.file.upload_fail'))
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files)
        },
        onRemove() {
            setData([])
        },
        beforeUpload(file) {
            const isExcelOrCSV =
                '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.includes(
                    file.type
                )
            if (!isExcelOrCSV) {
                message.error(common('module.file.upload_fail'))
            }
            return isExcelOrCSV
        },
    }

    const handleImport = async () => {
        setLoading(true)
        const res = await createBulkUserAPI(data)
        setLoading(false)
        if (res && !res.error) {
            message.success(res.message)
            resetUpload()
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

    const onChange = (pagination, filters, sorter, extra) => {
        //nếu thay đổi trang : current
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current) //"5" => 5
            }
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
        },
    ]

    const resetUpload = () => {
        setData([])
        setOpen(false)
    }

    return (
        <Modal
            title={common('action.import')}
            open={open}
            onOk={handleImport}
            onCancel={resetUpload}
            maskClosable={false}
            confirmLoading={loading}
            okText={common('action.save')}
            cancelText={common('action.cancel')}
            width={1000}
            okButtonProps={{ disabled: data.length === 0 }}
            destroyOnClose={true}
        >
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">{common('module.file.drag')}</p>
                <p className="ant-upload-hint">
                    {common('module.file.type')}.&nbsp;
                    <a
                        onClick={(e) => e.stopPropagation()}
                        href={sampleFile}
                        download
                    >
                        {common('module.file.template')}
                    </a>
                </p>
            </Dragger>

            <Table
                columns={columns}
                dataSource={data}
                rowKey={'email'}
                onChange={onChange}
                style={{ marginTop: 16 }}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: false,
                    total: total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {' '}
                                {range[0]} - {range[1]} / {total}{' '}
                                {common('pagination.record')}
                            </div>
                        )
                    },
                    locale: {
                        items_per_page: '/ ' + common('pagination.page'),
                    },
                }}
            />
        </Modal>
    )
}

export default ImportModal
