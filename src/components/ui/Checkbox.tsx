import { Check } from 'lucide-react'

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center gap-sm py-sm text-left active:opacity-70"
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
          checked
            ? 'bg-success border-success'
            : 'bg-transparent border-hairline-strong dark:border-hairline-dark-strong'
        }`}
      >
        {checked && <Check size={16} className="text-white" strokeWidth={3} />}
      </span>
      <span
        className={`text-body-md ${
          checked ? 'line-through text-muted-soft' : 'text-ink dark:text-on-dark'
        }`}
      >
        {label}
      </span>
    </button>
  )
}
