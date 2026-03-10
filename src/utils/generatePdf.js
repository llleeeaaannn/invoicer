import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generatePdf(previewElement, invoiceNumber, clientName, docType = 'invoice') {
  const canvas = await html2canvas(previewElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()   // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm
  const margin = 10 // mm — padding at top and bottom of each page

  // How many canvas pixels correspond to 1mm
  const pxPerMm = canvas.width / pdfWidth

  // Usable content height per page in mm and px
  const contentHeightMm = pdfHeight - margin * 2
  const contentHeightPx = contentHeightMm * pxPerMm

  const totalPages = Math.ceil(canvas.height / contentHeightPx)

  const sliceCanvas = document.createElement('canvas')
  sliceCanvas.width = canvas.width

  for (let page = 0; page < totalPages; page++) {
    const srcY = page * contentHeightPx
    const srcHeight = Math.min(contentHeightPx, canvas.height - srcY)

    sliceCanvas.height = contentHeightPx
    const ctx = sliceCanvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, 0, canvas.width, srcHeight)

    const sliceData = sliceCanvas.toDataURL('image/png')
    const sliceHeightMm = (srcHeight / pxPerMm)

    if (page > 0) pdf.addPage()
    pdf.addImage(sliceData, 'PNG', 0, margin, pdfWidth, sliceHeightMm)
  }

  const numStr = String(invoiceNumber).padStart(3, '0')
  const clientSlug = clientName ? slugify(clientName) : 'client'
  const prefix = docType === 'quote' ? 'quote' : 'invoice'
  pdf.save(`${prefix}-${numStr}-${clientSlug}.pdf`)
}
