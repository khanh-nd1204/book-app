import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    notification,
    Row,
    Space,
    Table,
    Tag,
} from 'antd'
import { useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { createRoleAPI } from '../../../services/role.service.js'
import { useTranslation } from 'react-i18next'

const CreateModal = (props) => {
    const { t: validation } = useTranslation('validation')
    const { t: common } = useTranslation('common')
    const { open, setOpen, getData, permissionList } = props
    const [createForm] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [permissionIds, setPermissionIds] = useState([])
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }

    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`${common('action.search')} ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        {common('action.search')}
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        {common('action.reset')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100)
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    })

    const columns = [
        {
            title: common('module.permission.name'),
            dataIndex: 'name',
            ...getColumnSearchProps('name', common('module.permission.name')),
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: common('module.permission.api'),
            dataIndex: 'apiPath',
            ...getColumnSearchProps('apiPath', common('module.permission.api')),
            sorter: (a, b) => a.apiPath.length - b.apiPath.length,
        },
        {
            title: common('module.permission.method'),
            dataIndex: 'method',
            render: (_, { method }) => {
                let color = 'green'
                switch (method) {
                    case 'POST':
                        color = 'yellow'
                        break
                    case 'DELETE':
                        color = 'red'
                        break
                    case 'PATCH':
                        color = 'purple'
                        break
                }
                return <Tag color={color}>{method}</Tag>
            },
            ...getColumnSearchProps(
                'method',
                common('module.permission.method')
            ),
            sorter: (a, b) => a.method.length - b.method.length,
        },
        {
            title: common('module.permission.module'),
            dataIndex: 'module',
            ...getColumnSearchProps(
                'module',
                common('module.permission.module')
            ),
            sorter: (a, b) => a.module.length - b.module.length,
        },
    ]

    const onFinish = async (values) => {
        setLoading(true)
        const res = await createRoleAPI({ ...values, permissionIds })
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
        setPermissionIds([])
    }

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setPermissionIds([...selectedRowKeys])
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
    }

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
            width={1000}
        >
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={'vertical'}
                form={createForm}
                style={{ padding: '8px 0' }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={common('module.role.name')}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: validation('name.required'),
                                },
                                {
                                    max: 100,
                                    message: (
                                        <>
                                            {validation('name.max', {
                                                max: 100,
                                            })}
                                        </>
                                    ),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={common('module.role.description')}
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <>
                                            {validation('description.required')}
                                        </>
                                    ),
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
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label={
                                <>
                                    {common('module.role.permission')} (
                                    {permissionIds?.length
                                        ? permissionIds?.length
                                        : 0}
                                    )
                                </>
                            }
                            required
                        >
                            <Table
                                columns={columns}
                                dataSource={permissionList}
                                rowKey={'id'}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection,
                                }}
                                pagination={{
                                    showSizeChanger: true,
                                    showTotal: (total, range) => {
                                        return (
                                            <div>
                                                {' '}
                                                {range[0]} - {range[1]} /{' '}
                                                {total}{' '}
                                                {common('pagination.record')}
                                            </div>
                                        )
                                    },
                                    locale: {
                                        items_per_page:
                                            '/ ' + common('pagination.page'),
                                    },
                                }}
                                locale={{
                                    emptyText: common('label.no_data'),
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CreateModal
