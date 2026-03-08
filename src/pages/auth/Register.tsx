import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { pageTransition } from '@/utils/animations'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const success = register(name, email, password)
    if (success) {
      navigate('/app')
    } else {
      setError('Ya existe una cuenta con este correo electrónico.')
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
              Crear cuenta
            </h1>
            <p className="text-neutral text-sm">
              Regístrate y comienza a construir tu estrategia.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-light bg-background text-foreground placeholder:text-neutral text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
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
              <UserPlus size={18} />
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-neutral mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
