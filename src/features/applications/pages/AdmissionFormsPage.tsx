import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { useSchool } from '../../schools/hooks/useSchools'
import { useAuth } from '../../auth/hooks/useAuth'
import { useParentApplications } from '../hooks/useApplications'
import { ApplicationForm } from '../components/ApplicationForm'

export default function AdmissionFormsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const schoolId = searchParams.get('schoolId') ?? ''

  const { user } = useAuth()
  const { school, loading, error } = useSchool(schoolId)
  const { submit, submitting } = useParentApplications()

  const handleClose = () => navigate('/applications')

  if (!schoolId) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <FileQuestion className="h-12 w-12 text-muted" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Pick a school first</h1>
        <p className="mt-3 text-sm text-muted">
          To start an admission form, choose a school from the directory and use its "Apply Now"
          button.
        </p>
        <Link
          to="/schools"
          className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Browse schools
        </Link>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </section>
    )
  }

  if (error || !school) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">School not found</h1>
        <p className="mt-3 text-sm text-muted">{error ?? 'This school no longer exists.'}</p>
        <Link
          to="/schools"
          className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Browse schools
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center px-4 py-10">
      <ApplicationForm
        schoolId={school.id}
        schoolName={school.name}
        schoolLogo={school.logoImage}
        uid={user?.uid ?? ''}
        onClose={handleClose}
        onSubmit={submit}
        submitting={submitting}
      />
    </section>
  )
}
