import {
    Button,
    Flex,
    Input,
    message,
    notification,
    Popconfirm,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd'
import { useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useDebouncedCallback } from 'use-debounce'
import {
    deletePermissionAPI,
    getPermissionsAPI,
} from '../../../services/permission.service.js'
import CreateModal from './create.jsx'
import UpdateModal from './update.jsx'
import { useTranslation } from 'react-i18next'
import { sfLike, sfOr } from 'spring-filter-query-builder'

const PermissionPage = () => {
    const { t: common } = useTranslation('common')
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState({})
    const [openCreate, setOpenCreate] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter])

    const getData = async () => {
        const filterStr = sfOr([
            sfLike('name', filter),
            sfLike('apiPath', filter),
            sfLike('method', filter),
            sfLike('module', filter),
        ])

        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`
        setLoading(true)
        const res = await getPermissionsAPI(query)
        setLoading(false)
        if (res && res.data) {
            setData(res.data.data)
            setCurrent(res.data.page)
            setPageSize(res.data.size)
            setTotal(res.data.totalElements)
        } else {
            setData([])
            notification.error({
                message: res.error,
                description: Array.isArray(res.message)
                    ? res.message[0]
                    : res.message,
                duration: 3,
            })
        }
    }

    const onChange = (pagination, filters, sorter) => {
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current)
            }
        }

        if (pagination && pagination.pageSize) {
            if (+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize)
            }
        }

        if (sorter && sorter.field && sorter.order) {
            const sortStr =
                sorter.order === 'descend'
                    ? `${sorter.field},desc`
                    : `${sorter.field},asc`
            setSort(sortStr)
        }
    }

    const debounced = useDebouncedCallback((value) => {
        setCurrent(1)
        setFilter(value)
    }, 1000)

    const onDelete = async (id) => {
        const res = await deletePermissionAPI(id)
        if (res && res.data) {
            message.success(res.message)
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

    const columns = [
        {
            title: common('label.index'),
            align: 'center',
            render: (_, record, index) => {
                return <>{index + 1 + (current - 1) * pageSize}</>
            },
        },
        {
            title: common('module.permission.name'),
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: common('module.permission.api'),
            dataIndex: 'apiPath',
            sorter: true,
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
            sorter: true,
        },
        {
            title: common('module.permission.module'),
            dataIndex: 'module',
            sorter: true,
        },
        {
            title: common('module.permission.description'),
            dataIndex: 'description',
        },
        {
            title: common('action.label'),
            render: (_, record) => {
                return (
                    <Space>
                        <Tooltip title={common('action.update')}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setOpenUpdate(true)
                                    setSelected(record)
                                }}
                            />
                        </Tooltip>
                        <Popconfirm
                            title={common('module.permission.delete')}
                            description={common(
                                'module.permission.delete_confirm',
                                {
                                    name: record?.name,
                                }
                            )}
                            onConfirm={() => onDelete(record.id)}
                            placement="left"
                            okText={common('action.confirm')}
                            cancelText={common('action.cancel')}
                        >
                            <Tooltip title={common('action.delete')}>
                                <Button danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <Flex gap={8} style={{ marginBottom: 16 }} justify="space-between">
                <Input
                    placeholder={common('module.permission.search')}
                    style={{ maxWidth: 320 }}
                    onChange={(e) => debounced(e.target.value)}
                />
                <Button type="primary" onClick={() => setOpenCreate(true)}>
                    <PlusOutlined /> {common('action.create')}
                </Button>
            </Flex>

            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowKey={'id'}
                onChange={onChange}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
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
                locale={{
                    triggerDesc: common('pagination.desc'),
                    triggerAsc: common('pagination.asc'),
                    cancelSort: common('pagination.cancel'),
                    emptyText: common('label.no_data'),
                }}
            />

            <CreateModal
                open={openCreate}
                setOpen={setOpenCreate}
                getData={getData}
            />
            <UpdateModal
                open={openUpdate}
                setOpen={setOpenUpdate}
                getData={getData}
                selected={selected}
                setSelected={setSelected}
            />
        </div>
    )
}

export default PermissionPage
