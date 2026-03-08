import { useState, type RefObject } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useFreemium } from '@/hooks/useFreemium'
import { generatePDF } from '@/utils/pdfExport'

interface ExportButtonProps {
  targetRef: RefObject<HTMLElement>
  companyName: string
}

export default function ExportButton({ targetRef, companyName }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { isPro } = useFreemium()

  const handleExport = async () => {
    if (!targetRef.current) {
      alert('No se pudo encontrar el contenido del reporte para exportar.')
      return
    }

    setIsLoading(true)

    try {
      await generatePDF(targetRef.current, companyName, isPro)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert(
        'Ocurrio un error al generar el PDF. Por favor intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="primary"
      size="md"
      onClick={handleExport}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Download size={18} />
          Exportar PDF
        </>
      )}
    </Button>
  )
}
