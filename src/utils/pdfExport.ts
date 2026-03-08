import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Generates a PDF from the given HTML element.
 * Captures the element with html2canvas, splits it into A4 pages,
 * and optionally adds a watermark for free-plan users.
 */
export async function generatePDF(
  element: HTMLElement,
  companyName: string,
  isPro: boolean
): Promise<void> {
  // Capture the element at high resolution
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
  })

  const imgData = canvas.toDataURL('image/png')

  // A4 dimensions in mm
  const pageWidth = 210
  const pageHeight = 297

  const pdf = new jsPDF('p', 'mm', 'a4')

  // Calculate the image dimensions scaled to fit the page width
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // Calculate the number of pages needed
  const totalPages = Math.ceil(imgHeight / pageHeight)

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage()
    }

    // Calculate the source slice for this page
    const sourceY = (page * pageHeight * canvas.width) / imgWidth
    const sourceHeight = (pageHeight * canvas.width) / imgWidth
    const sliceHeight = Math.min(sourceHeight, canvas.height - sourceY)

    // Create a temporary canvas for the current page slice
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = sliceHeight

    const ctx = pageCanvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      )
    }

    const pageImgData = pageCanvas.toDataURL('image/png')
    const renderedHeight = (sliceHeight * imgWidth) / canvas.width

    pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, renderedHeight)

    // Add watermark for free-plan users
    if (!isPro) {
      pdf.saveGraphicsState()
      // Semi-transparent gray watermark
      pdf.setTextColor(180, 180, 180)
      pdf.setFontSize(28)

      // Rotate text diagonally across the page
      const centerX = pageWidth / 2
      const centerY = pageHeight / 2

      // Use text rotation via translation and rotation
      pdf.internal.write('q') // save state
      const angle = -45 * (Math.PI / 180)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      // Convert mm to PDF units (points at 72 DPI: 1mm = 2.835pt)
      const pxX = centerX * 2.835
      const pxY = centerY * 2.835

      pdf.internal.write(
        `${cos.toFixed(4)} ${sin.toFixed(4)} ${(-sin).toFixed(4)} ${cos.toFixed(4)} ${pxX.toFixed(2)} ${pxY.toFixed(2)} cm`
      )

      // Draw text at origin (since we translated to center)
      pdf.text(
        'VERSION GRATUITA - Estramipyme Digital',
        0,
        0,
        { align: 'center' }
      )

      pdf.internal.write('Q') // restore state
      pdf.restoreGraphicsState()
    }
  }

  // Generate filename and save
  const sanitizedName = companyName.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')
  const filename = `${sanitizedName}_reporte_estrategico.pdf`
  pdf.save(filename)
}
