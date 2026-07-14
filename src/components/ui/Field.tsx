import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const fieldClass =
  'w-full h-11 px-base rounded-md border border-hairline-strong bg-surface-card text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-ink dark:bg-surface-dark-elevated dark:text-on-dark dark:border-hairline-dark-strong dark:focus:border-white'

function Label({ children }: { children: ReactNode }) {
  return <label className="block text-body-sm text-muted mb-xxs dark:text-on-dark-soft">{children}</label>
}

export function TextField({
  label,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input className={fieldClass} {...rest} />
    </div>
  )
}

export function TextAreaField({
  label,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea className={`${fieldClass} h-auto min-h-[88px] py-sm resize-none`} {...rest} />
    </div>
  )
}

export function SelectField({
  label,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; children: ReactNode }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <select className={fieldClass} {...rest}>
        {children}
      </select>
    </div>
  )
}
