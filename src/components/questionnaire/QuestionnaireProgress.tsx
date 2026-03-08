interface QuestionnaireProgressProps {
  answered: number
  total: number
}

export function QuestionnaireProgress({ answered, total }: QuestionnaireProgressProps) {
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0

  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-body text-foreground">
          <span className="font-semibold">{answered}</span> de{' '}
          <span className="font-semibold">{total}</span> preguntas respondidas
        </p>
        <span className="text-sm font-semibold text-accent">{percentage}%</span>
      </div>

      <div className="w-full h-3 bg-neutral-lighter rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
