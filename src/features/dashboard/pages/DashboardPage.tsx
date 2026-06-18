import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useMySchool } from '../../schools/hooks/useSchools'
import { ProfileTab } from '../widgets/ProfileTab'
import { ApplicationsTab } from '../widgets/ApplicationsTab'
import { AnnouncementsTab } from '../widgets/AnnouncementsTab'
import { QuestionsTab } from '../widgets/QuestionsTab'
import { ReviewsTab } from '../widgets/ReviewsTab'
import MessagesPage from '../../communication/pages/MessagesPage'
import VisitsPage from '../../communication/pages/VisitsPage'

const TABS = [
  'Profile',
  'Applications',
  'Announcements',
  'Q&A',
  'Reviews',
  'Visits',
  'Messages',
] as const
type Tab = (typeof TABS)[number]

export default function DashboardPage() {
  const { user } = useAuth()
  const { school, loading, saving, error, save } = useMySchool(user?.uid ?? '')
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-6 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">School dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        {school ? school.name : 'Set up your school listing to get started.'}
      </p>

      {school && (
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-brand text-brand-strong'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {!school && <ProfileTab school={null} saving={saving} error={error} onSave={save} />}
        {school && activeTab === 'Profile' && (
          <ProfileTab school={school} saving={saving} error={error} onSave={save} />
        )}
        {school && activeTab === 'Applications' && <ApplicationsTab schoolId={school.id} />}
        {school && activeTab === 'Announcements' && (
          <AnnouncementsTab
            schoolId={school.id}
            schoolName={school.name}
            schoolLogo={school.logoImage}
          />
        )}
        {school && activeTab === 'Q&A' && <QuestionsTab schoolId={school.id} />}
        {school && activeTab === 'Reviews' && <ReviewsTab schoolId={school.id} />}
        {school && activeTab === 'Visits' && <VisitsPage />}
        {school && activeTab === 'Messages' && <MessagesPage />}
      </div>
    </section>
  )
}
