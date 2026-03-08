import { useState } from 'react'
import {
  Plus,
  Trash2,
  GripVertical,
  ClipboardCheck,
  Users,
  Handshake,
  CalendarDays,
  ListOrdered,
  CheckSquare,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import type { WorkshopData } from '@/types/stages'

interface WorkshopManagerProps {
  data: WorkshopData
  onChange: (data: WorkshopData) => void
}

const DEFAULT_AGENDA: string[] = [
  'Apertura y contexto (10 min)',
  'Revisión de hallazgos (20 min)',
  'Construcción de propuesta de valor (30 min)',
  'Validación y coherencia (20 min)',
  'Acuerdos y compromisos (10 min)',
]

const DEFAULT_CHECKLIST: Record<string, boolean> = {
  'Resultados del cuestionario impresos': false,
  'Canvas de propuesta de valor en blanco': false,
  'Post-its y marcadores': false,
  'Refrigerios para participantes': false,
  'Proyector o pantalla': false,
}

const AVAILABLE_ROLES = ['Facilitador', 'Relator', 'Cronometrista'] as const

export function WorkshopManager({ data, onChange }: WorkshopManagerProps) {
  const [newAgendaItem, setNewAgendaItem] = useState('')
  const [newParticipant, setNewParticipant] = useState('')

  // Date
  const handleDateChange = (value: string) => {
    onChange({ ...data, date: value })
  }

  // Agenda
  const handleAddAgendaItem = () => {
    if (!newAgendaItem.trim()) return
    const updatedAgenda = data.agenda.length === 0
      ? [...DEFAULT_AGENDA, newAgendaItem.trim()]
      : [...data.agenda, newAgendaItem.trim()]
    onChange({ ...data, agenda: updatedAgenda })
    setNewAgendaItem('')
  }

  const handleRemoveAgendaItem = (index: number) => {
    const currentAgenda = data.agenda.length > 0 ? data.agenda : DEFAULT_AGENDA
    onChange({ ...data, agenda: currentAgenda.filter((_, i) => i !== index) })
  }

  const handleEditAgendaItem = (index: number, value: string) => {
    const currentAgenda = data.agenda.length > 0 ? data.agenda : [...DEFAULT_AGENDA]
    const updated = currentAgenda.map((item, i) => (i === index ? value : item))
    onChange({ ...data, agenda: updated })
  }

  const handleMoveAgendaItem = (fromIndex: number, toIndex: number) => {
    const currentAgenda = data.agenda.length > 0 ? data.agenda : [...DEFAULT_AGENDA]
    if (toIndex < 0 || toIndex >= currentAgenda.length) return
    const updated = [...currentAgenda]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onChange({ ...data, agenda: updated })
  }

  // Participants
  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return
    onChange({ ...data, participants: [...data.participants, newParticipant.trim()] })
    setNewParticipant('')
  }

  const handleRemoveParticipant = (index: number) => {
    const participant = data.participants[index]
    // Also remove role assignment for this participant
    const updatedRoles = { ...data.roles }
    delete updatedRoles[participant]
    onChange({
      ...data,
      participants: data.participants.filter((_, i) => i !== index),
      roles: updatedRoles,
    })
  }

  // Roles
  const handleRoleChange = (participant: string, role: string) => {
    const updatedRoles = { ...data.roles }
    if (role) {
      updatedRoles[participant] = role
    } else {
      delete updatedRoles[participant]
    }
    onChange({ ...data, roles: updatedRoles })
  }

  // Checklist
  const handleChecklistToggle = (item: string) => {
    const currentChecklist =
      Object.keys(data.checklist).length > 0 ? data.checklist : { ...DEFAULT_CHECKLIST }
    onChange({
      ...data,
      checklist: { ...currentChecklist, [item]: !currentChecklist[item] },
    })
  }

  // Agreements
  const handleAgreementsChange = (value: string) => {
    onChange({ ...data, agreements: value })
  }

  // Strategic agreement
  const handleStrategicAgreementChange = (value: string) => {
    onChange({ ...data, strategicAgreement: value })
  }

  const currentAgenda = data.agenda.length > 0 ? data.agenda : DEFAULT_AGENDA
  const currentChecklist =
    Object.keys(data.checklist).length > 0 ? data.checklist : DEFAULT_CHECKLIST
  const checklistEntries = Object.entries(currentChecklist)
  const checkedCount = checklistEntries.filter(([, v]) => v).length

  return (
    <div className="space-y-6">
      {/* Date */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground">
            Fecha del Taller
          </h4>
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Fecha del taller
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none max-w-xs"
          />
        </div>
      </Card>

      {/* Agenda */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <ListOrdered size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground">
            Agenda
          </h4>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Agenda predefinida en 5 pasos. Puedes editarla o agregar nuevos temas.
        </p>

        {currentAgenda.length > 0 && (
          <ol className="space-y-2 mb-4">
            {currentAgenda.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 bg-neutral-lighter/50 rounded-lg px-3 py-2"
              >
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveAgendaItem(index, index - 1)}
                    disabled={index === 0}
                    className="text-neutral hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Mover arriba"
                  >
                    <GripVertical size={14} />
                  </button>
                </div>
                <span className="text-sm font-body text-neutral font-medium w-6 shrink-0">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleEditAgendaItem(index, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-body text-foreground focus:outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded-lg focus:ring-1 focus:ring-accent/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAgendaItem(index)}
                  className="p-1 text-neutral hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                  aria-label="Eliminar tema"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Nuevo tema de agenda
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddAgendaItem() }}
              placeholder="Nuevo tema de agenda..."
              className="flex-1 px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
            />
            <Button variant="outline" size="sm" onClick={handleAddAgendaItem}>
              <Plus size={16} />
              Agregar
            </Button>
          </div>
        </div>
      </Card>

      {/* Preparation Checklist */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-accent" />
            <h4 className="font-heading font-semibold text-foreground">
              Lista de Preparación
            </h4>
          </div>
          <span className="text-xs font-body text-neutral bg-neutral-lighter px-2 py-1 rounded-full">
            {checkedCount}/{checklistEntries.length}
          </span>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Verifica que tienes todo listo antes del taller.
        </p>

        <div className="space-y-2">
          {checklistEntries.map(([item, checked]) => (
            <label
              key={item}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-lighter/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleChecklistToggle(item)}
                className="w-4 h-4 rounded border-neutral-light text-accent focus:ring-accent/30 cursor-pointer"
              />
              <span
                className={`text-sm font-body ${
                  checked ? 'text-neutral line-through' : 'text-foreground'
                }`}
              >
                {item}
              </span>
              {checked && (
                <CheckSquare size={14} className="text-green-500 ml-auto shrink-0" />
              )}
            </label>
          ))}
        </div>
      </Card>

      {/* Participants & Roles */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground">
            Participantes y Roles
          </h4>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Agrega participantes y asigna roles: Facilitador, Relator o Cronometrista.
        </p>

        {data.participants.length > 0 && (
          <div className="space-y-2 mb-4">
            {data.participants.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-neutral-lighter/50 rounded-lg px-3 py-2.5"
              >
                <span className="flex-1 text-sm font-body text-foreground font-medium">
                  {name}
                </span>
                <div className="flex flex-col gap-[4px]">
                  <label className="text-xs font-semibold text-[#4A4A4A] font-body">
                    Rol
                  </label>
                  <select
                    value={data.roles[name] || ''}
                    onChange={(e) => handleRoleChange(name, e.target.value)}
                    className="px-[14px] py-[10px] text-sm border-[1.5px] border-neutral-lighter rounded-lg bg-white text-foreground font-body focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
                  >
                    <option value="">Sin rol</option>
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(index)}
                  className="p-1 text-neutral hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                  aria-label={`Eliminar ${name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Nombre del participante
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddParticipant() }}
              placeholder="Nombre del participante..."
              className="flex-1 px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
            />
            <Button variant="outline" size="sm" onClick={handleAddParticipant}>
              <Plus size={16} />
              Agregar
            </Button>
          </div>
        </div>
      </Card>

      {/* Agreements */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Handshake size={18} className="text-accent" />
          <h4 className="font-heading font-semibold text-foreground">
            Acuerdos del Taller
          </h4>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Registra los acuerdos y compromisos alcanzados durante el taller.
        </p>
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Acuerdos alcanzados
          </label>
          <textarea
            value={data.agreements}
            onChange={(e) => handleAgreementsChange(e.target.value)}
            placeholder="Registra aquí los acuerdos alcanzados..."
            className="w-full min-h-[120px] px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white resize-y focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
          />
          <span className="text-xs text-[#6B6B6B] font-body">
            Incluye compromisos, responsables y plazos acordados.
          </span>
        </div>
      </Card>

      {/* Strategic Agreement */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Handshake size={18} className="text-secondary" />
          <h4 className="font-heading font-semibold text-foreground">
            Acuerdo Estratégico
          </h4>
        </div>
        <p className="text-sm text-neutral font-body mb-4">
          Acuerdo estratégico: ¿A qué se compromete el equipo?
        </p>
        <div className="flex flex-col gap-[6px]">
          <label className="text-sm font-semibold text-[#4A4A4A] font-body">
            Compromiso estratégico del equipo
          </label>
          <textarea
            value={data.strategicAgreement}
            onChange={(e) => handleStrategicAgreementChange(e.target.value)}
            placeholder="Describe el compromiso estratégico del equipo..."
            className="w-full min-h-[120px] px-[14px] py-[10px] border-[1.5px] border-neutral-lighter rounded-lg text-sm font-body text-foreground bg-white resize-y focus:border-accent focus:ring-[3px] focus:ring-accent/12 focus:outline-none"
          />
          <span className="text-xs text-[#6B6B6B] font-body">
            Define claramente a qué se compromete el equipo como resultado del taller.
          </span>
        </div>
      </Card>
    </div>
  )
}
