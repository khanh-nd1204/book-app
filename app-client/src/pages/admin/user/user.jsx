import {
    Button,
    Flex,
    Input,
    message,
    notification,
    Popconfirm,
    Space,
    Table,
    Tabs,
    Tooltip,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteUserAPI, getUsersAPI } from '../../../services/user.service.js'
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    ImportOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import CreateModal from './create.jsx'
import UpdateModal from './update.jsx'
import { useDebouncedCallback } from 'use-debounce'
import { getRolesAPI } from '../../../services/role.service.js'
import ViewModal from './view.jsx'
import { useTranslation } from 'react-i18next'
import * as xlsx from 'xlsx'
import ImportModal from './import.jsx'
import { sfLike, sfAnd, sfOr, sfEqual } from 'spring-filter-query-builder'

const UserPage = () => {
    const { t: common } = useTranslation('common')
    const [data, setData] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('createdAt,desc')
    const [filter, setFilter] = useState('')
    const [role, setRole] = useState('ADMIN')
    const [selected, setSelected] = useState({})
    const [openCreate, setOpenCreate] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [openView, setOpenView] = useState(false)
    const [openImport, setOpenImport] = useState(false)
    const [loading, setLoading] = useState(false)
    const [roleList, setRoleList] = useState([])

    useEffect(() => {
        getData()
    }, [current, pageSize, sort, filter, role])

    useEffect(() => {
        const getRoleList = async () => {
            const query = `page=${1}&size=${100}`
            const res = await getRolesAPI(query)
            if (res && res.data) {
                const arr = res.data.data.map((item) => {
                    return { label: item.name, value: item.id }
                })
                setRoleList(arr)
            } else {
                console.error(res.message)
                setRoleList([])
            }
        }
        getRoleList()
    }, [])

    const getData = useCallback(async () => {
        const filterStr = role
            ? sfAnd([
                  sfEqual('role.name', role),
                  sfOr([
                      sfLike('name', filter),
                      sfLike('email', filter),
                      sfLike('phone', filter),
                      sfLike('address', filter),
                  ]),
              ])
            : sfOr([
                  sfLike('name', filter),
                  sfLike('email', filter),
                  sfLike('phone', filter),
                  sfLike('address', filter),
              ])

        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getUsersAPI(query)
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
    }, [current, pageSize, sort, filter, role])

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
        const res = await deleteUserAPI(id)
        if (res && res.data) {
            message.success(res.message)
            setData([])
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

    const columns = useMemo(
        () => [
            {
                title: common('label.index'),
                align: 'center',
                render: (_, record, index) => (
                    <>{index + 1 + (current - 1) * pageSize}</>
                ),
            },
            {
                title: common('module.user.name'),
                dataIndex: 'name',
                render: (_, record) => (
                    <Tooltip title={common('action.view')}>
                        <a
                            onClick={() => {
                                setSelected(record)
                                setOpenView(true)
                            }}
                        >
                            {record.name}
                        </a>
                    </Tooltip>
                ),
                sorter: true,
            },
            {
                title: common('module.user.email'),
                dataIndex: 'email',
                sorter: true,
            },
            {
                title: common('module.user.phone'),
                dataIndex: 'phone',
                sorter: true,
            },
            {
                title: common('module.user.address'),
                dataIndex: 'address',
                sorter: true,
            },
            {
                title: common('module.user.role'),
                dataIndex: 'role.name',
                render: (_, record) => <>{record?.role?.name}</>,
                sorter: true,
            },
            {
                title: common('action.label'),
                render: (_, record) => (
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
                            title={common('module.user.delete')}
                            description={common('module.user.delete_confirm', {
                                name: record?.name,
                            })}
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
                ),
            },
        ],
        [current, pageSize]
    )

    const exportData = () => {
        if (data.length > 0) {
            const filteredData = data.map((item) => ({
                Name: item.name,
                Email: item.email,
                Phone: item.phone,
                Address: item.address,
                Role: item.role?.name,
            }))
            const worksheet = xlsx.utils.json_to_sheet(filteredData)
            const workbook = xlsx.utils.book_new()
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
            xlsx.writeFile(workbook, 'users.csv')
        } else {
            message.error('No data!')
        }
    }

    const items = [
        {
            key: null,
            label: common('module.role.all'),
        },
        {
            key: 'ADMIN',
            label: common('module.role.admin'),
        },
        {
            key: 'EMPLOYEE',
            label: common('module.role.employee'),
        },
        {
            key: 'CUSTOMER',
            label: common('module.role.customer'),
        },
    ]

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 8,
                padding: '0 16px 16px 16px',
            }}
        >
            <Tabs
                activeKey={role}
                items={items}
                onChange={(key) => setRole(key)}
            />
            <Flex gap={8} style={{ marginBottom: 16 }} justify="space-between">
                <Input
                    placeholder={common('module.user.search')}
                    style={{ maxWidth: 320 }}
                    onChange={(e) => debounced(e.target.value)}
                />
                <Space>
                    <Button type="primary" onClick={() => setOpenImport(true)}>
                        <ImportOutlined /> {common('action.import')}
                    </Button>
                    <Button type="primary" onClick={exportData}>
                        <ExportOutlined /> {common('action.export')}
                    </Button>
                    <Button type="primary" onClick={() => setOpenCreate(true)}>
                        <PlusOutlined /> {common('action.create')}
                    </Button>
                </Space>
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
                roleList={roleList}
            />
            <UpdateModal
                open={openUpdate}
                setOpen={setOpenUpdate}
                getData={getData}
                selected={selected}
                setSelected={setSelected}
                roleList={roleList}
            />
            <ViewModal
                open={openView}
                setOpen={setOpenView}
                selected={selected}
                setSelected={setSelected}
            />
            <ImportModal
                open={openImport}
                setOpen={setOpenImport}
                getData={getData}
            />
        </div>
    )
}

export default UserPage
