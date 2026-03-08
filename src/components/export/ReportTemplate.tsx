import { forwardRef } from 'react'
import { useCompany } from '@/hooks/useCompany'
import { STAGES } from '@/utils/constants'

/* ------------------------------------------------------------------ */
/*  Strategic Clock segment labels (mirrored from StrategicClock.tsx)  */
/* ------------------------------------------------------------------ */
const CLOCK_SEGMENTS: Record<number, string> = {
  1: 'Bajo precio / bajo valor',
  2: 'Bajo precio',
  3: 'Hibrido',
  4: 'Diferenciacion',
  5: 'Diferenciacion enfocada',
  6: 'Alto precio / estandar',
  7: 'Precio elevado / bajo valor',
  8: 'Bajo valor / precio estandar',
}

/* ------------------------------------------------------------------ */
/*  Questionnaire categories derived from answer keys                 */
/*  Keys follow the pattern "category_questionNumber"                 */
/* ------------------------------------------------------------------ */
function computeCategoryAverages(
  answers: Record<string, number>
): { category: string; average: number; count: number }[] {
  const buckets: Record<string, { sum: number; count: number }> = {}

  for (const [key, value] of Object.entries(answers)) {
    const category = key.replace(/_\d+$/, '') // strip trailing _N
    if (!buckets[category]) buckets[category] = { sum: 0, count: 0 }
    buckets[category].sum += value
    buckets[category].count += 1
  }

  return Object.entries(buckets).map(([category, { sum, count }]) => ({
    category,
    average: Math.round((sum / count) * 10) / 10,
    count,
  }))
}

/* ------------------------------------------------------------------ */
/*  Shared inline styles (for html2canvas fidelity)                   */
/* ------------------------------------------------------------------ */
const PAGE_STYLE: React.CSSProperties = {
  background: '#FFFFFF',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  color: '#1A1A1A',
  maxWidth: 800,
  margin: '0 auto',
  padding: 40,
}

const SECTION_STYLE: React.CSSProperties = {
  marginBottom: 32,
  pageBreakInside: 'avoid' as const,
}

const HEADING_STYLE: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#E8682A',
  borderBottom: '2px solid #E8682A',
  paddingBottom: 6,
  marginBottom: 16,
}

const SUB_HEADING_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#2D5016',
  marginBottom: 8,
}

const TEXT_STYLE: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  color: '#1A1A1A',
  marginBottom: 6,
}

const MUTED_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#8B8B7A',
}

const BADGE_STYLE: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  background: '#EDEDEA',
  borderRadius: 4,
  padding: '2px 8px',
  marginRight: 6,
  marginBottom: 4,
}

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontSize: 13,
  marginBottom: 12,
}

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left' as const,
  borderBottom: '1px solid #EDEDEA',
  padding: '6px 8px',
  fontWeight: 600,
  color: '#2D5016',
  fontSize: 12,
}

const TD_STYLE: React.CSSProperties = {
  textAlign: 'left' as const,
  borderBottom: '1px solid #EDEDEA',
  padding: '6px 8px',
  fontSize: 12,
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatDate(iso?: string): string {
  if (!iso) return new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const timelineLabels: Record<string, string> = {
  corto: 'Corto plazo',
  mediano: 'Mediano plazo',
  largo: 'Largo plazo',
}

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completado: 'Completado',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const ReportTemplate = forwardRef<HTMLDivElement>(function ReportTemplate(_props, ref) {
  const { currentCompany } = useCompany()

  if (!currentCompany) {
    return (
      <div ref={ref} style={PAGE_STYLE}>
        <p style={MUTED_STYLE}>No hay empresa seleccionada.</p>
      </div>
    )
  }

  const { stages, questionnaire } = currentCompany
  const { stage1, stage2, stage3, stage4, stage5, stage6 } = stages

  // -- Derived data ------------------------------------------------

  // Stage 4: VRIN analysis result
  const vrinAnalysis = stage4.vrinAnalysis
  const hasStrongVRIN =
    vrinAnalysis?.valuable === true &&
    vrinAnalysis?.rare === true &&
    vrinAnalysis?.inimitable === true &&
    vrinAnalysis?.nonSubstitutable === true

  // Stage 5: Canvas note counts
  const vpNotesCount = stage5.valuePropCanvas.length
  const bmcNotesCount = stage5.businessModelCanvas.length

  // Stage 5: Ad-Lib full text
  const adLib = stage5.adLib
  const adLibText = [
    adLib.productosServicios && `Nuestros ${adLib.productosServicios}`,
    adLib.segmento && `ayudan a ${adLib.segmento}`,
    adLib.tarea && `que quieren ${adLib.tarea}`,
    adLib.frustracion && `al reducir/evitar ${adLib.frustracion}`,
    adLib.alegria && `y al mejorar/lograr ${adLib.alegria}`,
    adLib.competidor && `a diferencia de ${adLib.competidor}`,
  ]
    .filter(Boolean)
    .join(' ')

  // Stage 6: Group roadmap by timeline
  const roadmapByTimeline = {
    corto: stage6.roadmap.filter((r) => r.timeline === 'corto'),
    mediano: stage6.roadmap.filter((r) => r.timeline === 'mediano'),
    largo: stage6.roadmap.filter((r) => r.timeline === 'largo'),
  }

  // Questionnaire category averages
  const categoryAverages = computeCategoryAverages(questionnaire.answers)

  // Strategic clock segment label
  const clockLabel =
    CLOCK_SEGMENTS[stage3.strategicClock.segment] || `Segmento ${stage3.strategicClock.segment}`

  return (
    <div ref={ref} style={PAGE_STYLE}>
      {/* ============================================================ */}
      {/*  TITLE PAGE                                                   */}
      {/* ============================================================ */}
      <div
        style={{
          textAlign: 'center' as const,
          paddingTop: 80,
          paddingBottom: 80,
          marginBottom: 40,
          borderBottom: '3px solid #E8682A',
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#1A1A1A',
            marginBottom: 12,
          }}
        >
          {currentCompany.name}
        </h1>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#E8682A',
            marginBottom: 24,
          }}
        >
          Reporte Estrategico - Estramipyme Digital
        </h2>
        <p style={MUTED_STYLE}>
          {formatDate(currentCompany.updatedAt)} &middot; {currentCompany.sector} &middot;{' '}
          {currentCompany.city}
        </p>
      </div>

      {/* ============================================================ */}
      {/*  STAGE 1 - Explorar                                          */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 1: {STAGES[0].name}</h3>

        <h4 style={SUB_HEADING_STYLE}>Perfil del Negocio</h4>
        {([
          ['¿Por qué se fundó?', stage1.businessProfile.porQueSeFundo],
          ['¿Cuándo y dónde?', stage1.businessProfile.cuandoYDonde],
          ['Empleados', stage1.businessProfile.empleados],
          ['Productos / Servicios', stage1.businessProfile.productosServicios],
          ['Rango de ingresos', stage1.businessProfile.rangoIngresos],
          ['Contabilidad formal', stage1.businessProfile.contabilidadFormal === true ? 'Sí' : stage1.businessProfile.contabilidadFormal === false ? 'No' : '(sin responder)'],
        ] as const).map(([label, value]) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <span style={{ ...TEXT_STYLE, fontWeight: 600 }}>{label}: </span>
            <span style={TEXT_STYLE}>{value || '(sin completar)'}</span>
          </div>
        ))}

        {stage1.trends.length > 0 && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 16 }}>Tendencias Identificadas</h4>
            <div>
              {stage1.trends.map((t) => (
                <span key={t.id} style={BADGE_STYLE}>
                  {t.name} — {t.source} ({t.type === 'riesgo' ? 'Riesgo' : 'Oportunidad'})
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/*  STAGE 2 - Conocer                                           */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 2: {STAGES[1].name}</h3>

        <p style={TEXT_STYLE}>
          <strong>Conversaciones registradas:</strong> {stage2.conversations.length}
        </p>

        {stage2.testimonials.length > 0 && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Testimonios Clave</h4>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {stage2.testimonials.slice(0, 6).map((t) => (
                <li key={t.id} style={{ ...TEXT_STYLE, marginBottom: 4 }}>
                  {t.content}
                </li>
              ))}
              {stage2.testimonials.length > 6 && (
                <li style={MUTED_STYLE}>
                  ...y {stage2.testimonials.length - 6} testimonios mas
                </li>
              )}
            </ul>
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/*  STAGE 3 - Analizar                                          */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 3: {STAGES[2].name}</h3>

        <p style={TEXT_STYLE}>
          <strong>Megatendencias analizadas:</strong> {stage3.megatrends.length}
        </p>

        <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Analisis de la Industria (5 Fuerzas)</h4>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Fuerza</th>
              <th style={TH_STYLE}>Nivel (1-5)</th>
            </tr>
          </thead>
          <tbody>
            {([
              ['Rivalidad competitiva', stage3.industry.rivalry],
              ['Nuevos competidores', stage3.industry.newEntrants],
              ['Productos sustitutos', stage3.industry.substitutes],
              ['Poder del comprador', stage3.industry.buyerPower],
              ['Poder del proveedor', stage3.industry.supplierPower],
            ] as const).map(([label, value]) => (
              <tr key={label}>
                <td style={TD_STYLE}>{label}</td>
                <td style={TD_STYLE}>{value || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {stage3.industry.notes && (
          <p style={{ ...TEXT_STYLE, marginTop: 8 }}>
            <strong>Notas:</strong> {stage3.industry.notes}
          </p>
        )}

        <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Reloj Estrategico</h4>
        <p style={TEXT_STYLE}>
          Posicion: <strong>Segmento {stage3.strategicClock.segment}</strong> &mdash; {clockLabel}
        </p>
      </div>

      {/* ============================================================ */}
      {/*  STAGE 4 - Integrar                                         */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 4: {STAGES[3].name}</h3>

        <h4 style={SUB_HEADING_STYLE}>Circulo Dorado</h4>
        {([
          ['Por que (Why)', stage4.goldenCircle.why],
          ['Como (How)', stage4.goldenCircle.how],
          ['Que (What)', stage4.goldenCircle.what],
        ] as const).map(([label, value]) => (
          <div key={label} style={{ marginBottom: 6 }}>
            <span style={{ ...TEXT_STYLE, fontWeight: 600 }}>{label}: </span>
            <span style={TEXT_STYLE}>{value || '(sin completar)'}</span>
          </div>
        ))}

        <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Recursos y Capacidades</h4>
        {stage4.vrinResources.length > 0 && (
          <table style={TABLE_STYLE}>
            <thead>
              <tr>
                <th style={TH_STYLE}>Recurso</th>
                <th style={TH_STYLE}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {stage4.vrinResources.map((r) => (
                <tr key={r.id}>
                  <td style={TD_STYLE}>{r.resource}</td>
                  <td style={{ ...TD_STYLE, textTransform: 'capitalize' as const }}>{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {stage4.vrinPrincipalResource && (
          <p style={{ ...TEXT_STYLE, marginTop: 8 }}>
            <strong>Recurso diferenciador principal:</strong> {stage4.vrinPrincipalResource}
          </p>
        )}

        {vrinAnalysis && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Analisis VRIN</h4>
            <table style={TABLE_STYLE}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>Criterio</th>
                  <th style={TH_STYLE}>Resultado</th>
                  <th style={TH_STYLE}>Justificacion</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD_STYLE}>Valioso</td>
                  <td style={TD_STYLE}>{vrinAnalysis.valuable === true ? 'Si' : vrinAnalysis.valuable === false ? 'No' : '-'}</td>
                  <td style={TD_STYLE}>{vrinAnalysis.valuableJustification || '-'}</td>
                </tr>
                <tr>
                  <td style={TD_STYLE}>Raro</td>
                  <td style={TD_STYLE}>{vrinAnalysis.rare === true ? 'Si' : vrinAnalysis.rare === false ? 'No' : '-'}</td>
                  <td style={TD_STYLE}>{vrinAnalysis.rareJustification || '-'}</td>
                </tr>
                <tr>
                  <td style={TD_STYLE}>Inimitable</td>
                  <td style={TD_STYLE}>{vrinAnalysis.inimitable === true ? 'Si' : vrinAnalysis.inimitable === false ? 'No' : '-'}</td>
                  <td style={TD_STYLE}>{vrinAnalysis.inimitableJustification || '-'}</td>
                </tr>
                <tr>
                  <td style={TD_STYLE}>No sustituible</td>
                  <td style={TD_STYLE}>{vrinAnalysis.nonSubstitutable === true ? 'Si' : vrinAnalysis.nonSubstitutable === false ? 'No' : '-'}</td>
                  <td style={TD_STYLE}>{vrinAnalysis.nonSubstitutableJustification || '-'}</td>
                </tr>
              </tbody>
            </table>
            <p style={TEXT_STYLE}>
              <strong>Resultado:</strong>{' '}
              {hasStrongVRIN ? 'Ventaja competitiva sostenible' : 'Ver detalles en la aplicacion'}
            </p>
          </>
        )}

        {stage4.radar.length > 0 && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Radar Estrategico</h4>
            <table style={TABLE_STYLE}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>Categoria</th>
                  <th style={TH_STYLE}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {stage4.radar.map((r, i) => (
                  <tr key={i}>
                    <td style={TD_STYLE}>{r.category}</td>
                    <td style={TD_STYLE}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {stage4.conclusions.length > 0 && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Conclusiones</h4>
            <table style={TABLE_STYLE}>
              <thead>
                <tr>
                  <th style={TH_STYLE}>Fuente</th>
                  <th style={TH_STYLE}>Riesgo</th>
                  <th style={TH_STYLE}>Oportunidad</th>
                </tr>
              </thead>
              <tbody>
                {stage4.conclusions.map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...TD_STYLE, textTransform: 'capitalize' as const }}>{c.source}</td>
                    <td style={TD_STYLE}>{c.riesgo || '-'}</td>
                    <td style={TD_STYLE}>{c.oportunidad || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {stage4.strategicChallenge && (
          <div style={{ marginTop: 12 }}>
            <h4 style={SUB_HEADING_STYLE}>Desafio Estrategico</h4>
            <p style={TEXT_STYLE}>{stage4.strategicChallenge}</p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  STAGE 5 - Facilitar                                         */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 5: {STAGES[4].name}</h3>

        <p style={TEXT_STYLE}>
          <strong>Notas en Canvas de Propuesta de Valor:</strong> {vpNotesCount}
        </p>
        <p style={TEXT_STYLE}>
          <strong>Notas en Business Model Canvas:</strong> {bmcNotesCount}
        </p>

        {adLibText && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Declaracion Ad-Lib</h4>
            <p
              style={{
                ...TEXT_STYLE,
                fontStyle: 'italic',
                background: '#EDEDEA',
                padding: 12,
                borderRadius: 6,
              }}
            >
              {adLibText || '(sin completar)'}
            </p>
          </>
        )}

        {stage5.coherenceNotes && (
          <>
            <h4 style={{ ...SUB_HEADING_STYLE, marginTop: 12 }}>Notas de Coherencia</h4>
            <p style={TEXT_STYLE}>{stage5.coherenceNotes}</p>
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/*  STAGE 6 - Consolidar                                        */}
      {/* ============================================================ */}
      <div style={SECTION_STYLE}>
        <h3 style={HEADING_STYLE}>Etapa 6: {STAGES[5].name}</h3>

        {stage6.roadmap.length === 0 ? (
          <p style={MUTED_STYLE}>No hay acciones en la hoja de ruta.</p>
        ) : (
          <>
            {(['corto', 'mediano', 'largo'] as const).map((timeline) => {
              const items = roadmapByTimeline[timeline]
              if (items.length === 0) return null
              return (
                <div key={timeline} style={{ marginBottom: 16 }}>
                  <h4 style={SUB_HEADING_STYLE}>{timelineLabels[timeline]}</h4>
                  <table style={TABLE_STYLE}>
                    <thead>
                      <tr>
                        <th style={TH_STYLE}>Accion</th>
                        <th style={TH_STYLE}>Responsable</th>
                        <th style={TH_STYLE}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td style={TD_STYLE}>{item.action}</td>
                          <td style={TD_STYLE}>{item.responsible}</td>
                          <td style={TD_STYLE}>{statusLabels[item.status] || item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}
          </>
        )}

        {stage6.finalNotes && (
          <>
            <h4 style={SUB_HEADING_STYLE}>Notas Finales</h4>
            <p style={TEXT_STYLE}>{stage6.finalNotes}</p>
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/*  QUESTIONNAIRE RESULTS                                       */}
      {/* ============================================================ */}
      {categoryAverages.length > 0 && (
        <div style={SECTION_STYLE}>
          <h3 style={HEADING_STYLE}>Resultados del Cuestionario</h3>

          <table style={TABLE_STYLE}>
            <thead>
              <tr>
                <th style={TH_STYLE}>Categoria</th>
                <th style={TH_STYLE}>Promedio</th>
                <th style={TH_STYLE}>Preguntas</th>
              </tr>
            </thead>
            <tbody>
              {categoryAverages.map((cat) => (
                <tr key={cat.category}>
                  <td style={{ ...TD_STYLE, textTransform: 'capitalize' as const }}>
                    {cat.category.replace(/_/g, ' ')}
                  </td>
                  <td style={TD_STYLE}>{cat.average}</td>
                  <td style={TD_STYLE}>{cat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {questionnaire.completedAt && (
            <p style={MUTED_STYLE}>
              Completado el {formatDate(questionnaire.completedAt)}
            </p>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <div
        style={{
          marginTop: 40,
          paddingTop: 16,
          borderTop: '1px solid #EDEDEA',
          textAlign: 'center' as const,
        }}
      >
        <p style={{ ...MUTED_STYLE, fontSize: 11 }}>
          Generado con Estramipyme Digital &middot; {formatDate()}
        </p>
      </div>
    </div>
  )
})

export default ReportTemplate
