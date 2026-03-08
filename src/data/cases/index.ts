import type { Company } from '@/types/company'
import { mabekaCompany } from '@/data/mabeka'
import { donJuanCompany } from './donJuan'
import { ninosFelicesCompany } from './ninosFelices'

export interface CaseStudyMeta {
  id: string
  slug: string
  name: string
  sector: string
  retoEstrategico: string
  company: Company
}

export const caseStudies: CaseStudyMeta[] = [
  {
    id: 'mabeka',
    slug: 'mabeka',
    name: 'Mabeka Carpinteria',
    sector: 'Muebles y Carpinteria',
    retoEstrategico:
      'Escalar la produccion artesanal sin sacrificar la calidad y el toque personalizado que diferencia a Mabeka.',
    company: mabekaCompany,
  },
  {
    id: 'don-juan',
    slug: 'don-juan',
    name: 'Tienda de Don Juan',
    sector: 'Comercio minorista / Tienda de barrio',
    retoEstrategico:
      'Modernizar la gestion de la tienda sin perder la cercanía y confianza que la diferencian de las cadenas de descuento.',
    company: donJuanCompany,
  },
  {
    id: 'ninos-felices',
    slug: 'ninos-felices',
    name: 'Fundacion Ninos Felices',
    sector: 'Organizacion sin animo de lucro / Educacion infantil',
    retoEstrategico:
      'Diversificar fuentes de financiacion y profesionalizar la medicion de impacto para escalar el programa.',
    company: ninosFelicesCompany,
  },
]

export function getCaseBySlug(slug: string): CaseStudyMeta | undefined {
  return caseStudies.find((c) => c.slug === slug)
}
