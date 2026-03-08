import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { pageTransition } from '@/utils/animations'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    const success = login(email, password)
    if (success) {
      navigate('/app')
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 font-body">
      <motion.div
        {...pageTransition}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="font-heading text-xl text-accent font-bold">
              Estramipyme
            </Link>
            <h1 className="font-heading text-3xl text-foreground mt-4 mb-2">
              Iniciar sesión
            </h1>
            <p className="text-neutral text-sm">
              Ingresa a tu cuenta para continuar con tu estrategia.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-light bg-background text-foreground placeholder:text-neutral text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-light bg-background text-foreground placeholder:text-neutral text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-sm bg-error/5 border border-error/20 rounded-lg px-4 py-2.5"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" className="w-full" size="lg">
              <LogIn size={18} />
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-neutral mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
