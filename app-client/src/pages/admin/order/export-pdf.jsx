import 'jspdf-autotable'
import { PrinterOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import font from '../../../assets/base64/Inter-Regular-normal.js'

const ExportPDF = ({ order }) => {
    const { t: common } = useTranslation('common')

    const generatePDF = () => {
        const doc = new jsPDF()
        doc.addFileToVFS('Inter-Regular.ttf', font)
        doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
        doc.setFont('Inter')
        const pageWidth = doc.internal.pageSize.getWidth()

        doc.text(common('CỬA HÀNG SÁCH'), pageWidth / 2, 15, {
            align: 'center',
        })
        doc.text(common('HÓA ĐƠN BÁN HÀNG'), pageWidth / 2, 25, {
            align: 'center',
        })

        doc.setFontSize(11)
        doc.text(`${common('Mã đơn hàng')}: #${order?.id}`, 20, 40)
        doc.text(
            `${common('Ngày đặt hàng')}: ${order?.createdAt?.split(' ')[1]}`,
            pageWidth - 60,
            40
        )
        doc.text(`${common('Tên khách hàng')}: ${order?.name}`, 20, 47)
        doc.text(`${common('Email')}: ${order?.email}`, 20, 54)
        doc.text(`${common('Địa chỉ')}: ${order?.address}`, 20, 61)
        doc.text(`${common('Số điện thoại')}: ${order?.phone}`, 20, 68)
        doc.text(
            `${common('Tổng tiền')}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.totalPrice)}`,
            20,
            75
        )

        const tableColumn = [
            'STT',
            'Tên sách',
            'ISBN',
            'Số lượng',
            'Đơn giá',
            'Tổng tiền',
        ]
        const tableRows = []

        order?.orderItems?.forEach((item, index) => {
            tableRows.push([
                index + 1,
                item.book.title,
                item.book.isbn,
                new Intl.NumberFormat('vi-VN').format(item.quantity),
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(item.unitPrice),
                new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(item.totalPrice),
            ])
        })

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 90,
            theme: 'grid',
            styles: { font: 'Inter', fontStyle: 'normal' },
            headStyles: { fillColor: [169, 169, 169], halign: 'center' },
            columnStyles: {
                0: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'center' },
            },
        })

        let finalY = doc.lastAutoTable.finalY + 20
        doc.text(common('Người lập hóa đơn'), 20, finalY)
        doc.text(common('Người giao'), pageWidth / 2 - 10, finalY)
        doc.text(common('Người nhận'), pageWidth - 50, finalY)

        doc.save(`${order?.id}.pdf`)
    }

    return (
        <Tooltip title={common('action.print')}>
            <Button icon={<PrinterOutlined />} onClick={generatePDF} />
        </Tooltip>
    )
}

export default ExportPDF
