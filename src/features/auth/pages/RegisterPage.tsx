import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '../types/auth.schema'

const ROLE_OPTIONS: Array<{ value: 'parent' | 'school'; label: string; description: string }> = [
  {
    value: 'parent',
    label: 'Parent / Guardian',
    description: 'Browse schools, apply, shortlist, and message schools.',
  },
  {
    value: 'school',
    label: 'School',
    description: 'List your school and manage applications, reviews, and enquiries.',
  },
]

export default function RegisterPage() {
  const { signUp, submitting, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'parent' },
  })

  const role = watch('role')

  const onSubmit = async (values: RegisterFormValues) => {
    const ok = await signUp(values)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-strong">
          Get started
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Create your account</h1>
        <p className="mt-2 text-sm text-muted">
          Join Elimu Connect as a parent or list your school.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('role', option.value)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  role === option.value
                    ? 'border-brand bg-brand-soft'
                    : 'border-border hover:bg-background'
                }`}
              >
                <span className="block text-sm font-semibold text-foreground">{option.label}</span>
                <span className="mt-1 block text-xs text-muted">{option.description}</span>
              </button>
            ))}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-foreground mb-1.5"
              htmlFor="displayName"
            >
              {role === 'school' ? 'School contact name' : 'Full name'}
            </label>
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              {...register('displayName')}
              className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                errors.displayName ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-red-500">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                errors.email ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="07XXXXXXXX"
              {...register('phone')}
              className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                errors.phone ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm font-medium text-foreground mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                  errors.password ? 'border-red-400' : 'border-border'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-foreground mb-1.5"
                htmlFor="confirmPassword"
              >
                Confirm
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                  errors.confirmPassword ? 'border-red-400' : 'border-border'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-brand-strong hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
