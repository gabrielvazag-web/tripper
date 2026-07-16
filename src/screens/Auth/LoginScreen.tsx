import { useEffect, useState } from 'react'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { useAuth } from '../../store/AuthContext'

type InvitePreview = { destino: string; titulo: string } | null

export function LoginScreen({ invitePreview }: { invitePreview?: InvitePreview }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'cadastro'>(invitePreview ? 'cadastro' : 'login')

  // invitePreview chega assíncrono (fetch feito no App); quando aparece depois do
  // mount, o modo inicial (calculado antes dela existir) precisa se atualizar.
  useEffect(() => {
    if (invitePreview) setMode('cadastro')
  }, [invitePreview])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = mode === 'login' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)
    if (result.error) {
      setError(traduzErro(result.error))
      return
    }
    if (mode === 'cadastro') setConfirmEmailSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col safe-top safe-bottom px-lg bg-canvas dark:bg-surface-dark">
      <div className="pt-lg">
        <Logo size="lg" />
      </div>

      <div className="flex-1 flex flex-col justify-center gap-lg py-xl">
        {invitePreview && (
          <div className="rounded-xl border border-hairline dark:border-hairline-dark bg-surface-card dark:bg-surface-dark-elevated p-base">
            <p className="text-caption-upper text-muted dark:text-on-dark-soft">Você foi convidado(a)</p>
            <p className="text-title-sm font-sans text-ink dark:text-on-dark mt-xxs">{invitePreview.titulo}</p>
            <p className="text-body-sm text-muted dark:text-on-dark-soft">{invitePreview.destino}</p>
          </div>
        )}

        <div>
          <h1 className="text-display-sm font-display font-bold text-ink dark:text-on-dark">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h1>
          <p className="mt-xs text-body-md text-muted dark:text-on-dark-soft">
            {mode === 'login'
              ? 'Entre com seu email e senha pra acessar suas viagens.'
              : 'Cadastre um email e senha pra começar a planejar.'}
          </p>
        </div>

        {confirmEmailSent ? (
          <div className="rounded-xl border border-hairline dark:border-hairline-dark bg-surface-card dark:bg-surface-dark-elevated p-base">
            <p className="text-body-md text-ink dark:text-on-dark">
              Confirma seu email — mandamos um link de confirmação para <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-base">
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-body-sm text-error">{error}</p>}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
        )}

        {!confirmEmailSent && (
          <button
            onClick={() => {
              setMode((m) => (m === 'login' ? 'cadastro' : 'login'))
              setError(null)
            }}
            className="text-body-sm text-ink dark:text-on-dark underline underline-offset-2 self-center"
          >
            {mode === 'login' ? 'Ainda não tem conta? Criar uma' : 'Já tem conta? Entrar'}
          </button>
        )}
      </div>
    </div>
  )
}

function traduzErro(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.'
  if (msg.includes('User already registered')) return 'Esse email já tem cadastro — tenta entrar em vez de cadastrar.'
  if (msg.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  return msg
}
