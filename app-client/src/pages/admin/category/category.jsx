import {
    Button,
    Flex,
    Image,
    Input,
    message,
    notification,
    Popconfirm,
    Space,
    Table,
    Tooltip,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useDebouncedCallback } from 'use-debounce'
import { useTranslation } from 'react-i18next'
import { sfLike, sfOr } from 'spring-filter-query-builder'

import UpdateModal from './update.jsx'
import CreateModal from './create.jsx'

import {
    deleteCategoryAPI,
    getCategoriesAPI,
} from '../../../services/category.service.js'

const CategoryPage = () => {
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

    const getData = useCallback(async () => {
        const filterStr = sfOr([
            sfLike('name', filter),
            sfLike('symbol', filter),
        ])

        const query = `page=${current}&size=${pageSize}&sort=${sort}&filter=${filterStr}`

        setLoading(true)
        const res = await getCategoriesAPI(query)
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
    }, [current, pageSize, sort, filter])

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
        const res = await deleteCategoryAPI(id)
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
                title: common('module.category.name'),
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: common('module.category.symbol'),
                dataIndex: 'symbol',
                sorter: true,
            },
            {
                title: common('module.category.image'),
                dataIndex: 'image',
                render: (image) => (
                    <Image
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                        src={`${import.meta.env.VITE_BACKEND_URL}${image?.url}`}
                    />
                ),
            },
            {
                title: common('label.created_at'),
                dataIndex: 'createdAt',
                sorter: true,
            },
            {
                title: common('label.updated_at'),
                dataIndex: 'updatedAt',
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
                            title={common('module.category.delete')}
                            description={common(
                                'module.category.delete_confirm',
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
                ),
            },
        ],
        [current, pageSize]
    )

    return (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <Flex gap={8} style={{ marginBottom: 16 }} justify="space-between">
                <Input
                    placeholder={common('module.category.search')}
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

export default CategoryPage
