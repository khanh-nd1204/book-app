import { Badge, Descriptions, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

const ViewModal = (props) => {
    const { t: common } = useTranslation('common')
    const { open, setOpen, selected, setSelected } = props

    const onClose = () => {
        setOpen(false)
        setSelected(null)
    }

    return (
        <Modal
            title={common('module.user.detail')}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label={common('module.user.name')}>
                    {selected?.name}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.user.email')}>
                    {selected?.email}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.user.address')}>
                    {selected?.address}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.user.phone')}>
                    {selected?.phone}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.user.status')}>
                    {selected?.active ? (
                        <Badge
                            status="processing"
                            text={common('module.user.active')}
                        />
                    ) : (
                        <Badge
                            status="error"
                            text={common('module.user.inactive')}
                        />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={common('module.role.label')}>
                    {selected?.role?.name}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.created_at')}>
                    {selected?.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.created_by')}>
                    {selected?.createdBy}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.updated_at')}>
                    {selected?.updatedAt}
                </Descriptions.Item>
                <Descriptions.Item label={common('label.updated_by')}>
                    {selected?.updatedBy}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    )
}

export default ViewModal
