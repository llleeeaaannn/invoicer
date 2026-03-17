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
  // Wait for fonts to be fully loaded before capturing
  await document.fonts.ready

  const canvas = await html2canvas(previewElement, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    onclone: (doc, clonedEl) => {
      // html2canvas has a known bug where it renders text too low due to
      // incorrect font baseline calculations. Fix by adjusting padding
      // on text-containing elements to shift text upward within their
      // boxes (preserving backgrounds and borders).
      const shift = 3
      clonedEl.querySelectorAll('*').forEach((el) => {
        const hasDirectText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
        )
        if (hasDirectText) {
          const computed = doc.defaultView.getComputedStyle(el)
          const pt = parseFloat(computed.paddingTop) || 0
          const pb = parseFloat(computed.paddingBottom) || 0
          el.style.paddingTop = Math.max(0, pt - shift) + 'px'
          el.style.paddingBottom = (pb + shift) + 'px'
        }
      })
    },
  })

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()   // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm
  // How many canvas pixels correspond to 1mm
  const pxPerMm = canvas.width / pdfWidth

  // Content fills the full page height
  const contentHeightMm = pdfHeight
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

    const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92)
    const sliceHeightMm = (srcHeight / pxPerMm)

    if (page > 0) pdf.addPage()
    pdf.addImage(sliceData, 'JPEG', 0, 0, pdfWidth, sliceHeightMm)
  }

  const numStr = String(invoiceNumber).padStart(3, '0')
  const clientSlug = clientName ? slugify(clientName) : 'client'
  const prefix = docType === 'quote' ? 'quote' : 'invoice'
  pdf.save(`${prefix}-${numStr}-${clientSlug}.pdf`)
}
