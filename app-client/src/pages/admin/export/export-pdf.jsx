import 'jspdf-autotable'
import { PrinterOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'
import font from '../../../assets/base64/Inter-Regular-normal.js'

const ExportPDF = ({ books }) => {
    const { t: common } = useTranslation('common')

    const generatePDF = () => {
        const doc = new jsPDF()
        doc.addFileToVFS('Inter-Regular.ttf', font)
        doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
        doc.setFont('Inter')
        const pageWidth = doc.internal.pageSize.getWidth()

        doc.setFontSize(16)
        doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, 15, {
            align: 'center',
        })
        doc.setFontSize(12)
        doc.text(common('Độc lập - Tự do - Hạnh phúc'), pageWidth / 2, 22, {
            align: 'center',
        })

        doc.setFontSize(14)
        doc.text(common('CỬA HÀNG SÁCH'), pageWidth / 2, 35, {
            align: 'center',
        })
        doc.text(common('BIÊN BẢN XUẤT SÁCH'), pageWidth / 2, 45, {
            align: 'center',
        })

        doc.setFontSize(11)
        doc.text(`${common('Mã phiếu xuất')}: ${books?.id}`, 10, 60)

        doc.text(
            `${common('Ngày')}: ${books?.createdAt?.split(' ')[1]}`,
            pageWidth - 40,
            60
        )

        if (books?.supplier) {
            doc.text(
                `${common('Nhà cung cấp')}: ${books?.supplier?.name || ''}`,
                10,
                67
            )
        }

        doc.text(
            `${common('Lý do xuất')}: ${books?.note || ''}`,
            10,
            books?.supplier ? 74 : 67
        )

        doc.text(
            `${common('Tổng tiền')} ${new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(books?.totalCost)}`,
            10,
            books?.supplier ? 81 : 74
        )

        const tableColumn = [
            'STT',
            'Nhan đề',
            'ISBN',
            'Số lượng',
            'Đơn giá',
            'Tổng tiền',
        ]
        const tableRows = []

        books?.bookExportItems?.forEach((item, index) => {
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
                }).format(item.totalCost),
            ])
        })

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: books?.supplier ? 90 : 80,
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
        doc.text(common('Người lập biên bản'), 20, finalY)
        doc.text(common('Người nhận'), pageWidth / 2 - 10, finalY)

        doc.save(`${books?.id}.pdf`)
    }

    return (
        <Tooltip title={common('action.print')}>
            <Button icon={<PrinterOutlined />} onClick={generatePDF} />
        </Tooltip>
    )
}

export default ExportPDF
