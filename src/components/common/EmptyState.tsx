import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6 rounded-full bg-neutral-lighter p-6">
        <Icon className="h-12 w-12 text-neutral" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 font-heading text-xl font-semibold text-gray-800">
        {title}
      </h3>
      <p className="mb-6 max-w-md font-body text-neutral leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
