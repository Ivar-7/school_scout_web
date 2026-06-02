import { lazy, Suspense } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AppProviders } from './shared/providers/AppProviders'
import RootLayout from './app/layouts/RootLayout'

const HomePage = lazy(() => import('./app/pages/HomePage'))
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'))
const SchoolsPage = lazy(() => import('./features/schools/pages/SchoolsPage'))
const SchoolDetailsPage = lazy(() => import('./features/schools/pages/SchoolDetailsPage'))
const FeesPage = lazy(() => import('./features/finance/pages/FeesPage'))
const TransportRoutesPage = lazy(() => import('./features/finance/pages/TransportRoutesPage'))
const MessagesPage = lazy(() => import('./features/communication/pages/MessagesPage'))
const VisitsPage = lazy(() => import('./features/communication/pages/VisitsPage'))
const ApplicationsPage = lazy(() => import('./features/applications/pages/ApplicationsPage'))
const AdmissionFormsPage = lazy(() => import('./features/applications/pages/AdmissionFormsPage'))
const ReviewsPage = lazy(() => import('./features/social/pages/ReviewsPage'))
const QAPage = lazy(() => import('./features/social/pages/QAPage'))
const AnnouncementsPage = lazy(() => import('./features/social/pages/AnnouncementsPage'))
const SubscriptionsPage = lazy(() => import('./features/monetization/pages/SubscriptionsPage'))
const PaymentsPage = lazy(() => import('./features/monetization/pages/PaymentsPage'))
const ShortlistsPage = lazy(() => import('./features/utilities/pages/ShortlistsPage'))
const NotificationsPage = lazy(() => import('./features/utilities/pages/NotificationsPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'auth',
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      {
        path: 'schools',
        children: [
          { index: true, element: <SchoolsPage /> },
          { path: ':schoolId', element: <SchoolDetailsPage /> },
        ],
      },
      {
        path: 'finance',
        children: [
          { path: 'fees', element: <FeesPage /> },
          { path: 'transport', element: <TransportRoutesPage /> },
        ],
      },
      {
        path: 'communication',
        children: [
          { path: 'messages', element: <MessagesPage /> },
          { path: 'visits', element: <VisitsPage /> },
        ],
      },
      {
        path: 'applications',
        children: [
          { index: true, element: <ApplicationsPage /> },
          { path: 'admission-forms', element: <AdmissionFormsPage /> },
        ],
      },
      {
        path: 'social',
        children: [
          { path: 'reviews', element: <ReviewsPage /> },
          { path: 'qa', element: <QAPage /> },
          { path: 'announcements', element: <AnnouncementsPage /> },
        ],
      },
      {
        path: 'monetization',
        children: [
          { path: 'subscriptions', element: <SubscriptionsPage /> },
          { path: 'payments', element: <PaymentsPage /> },
        ],
      },
      {
        path: 'utilities',
        children: [
          { path: 'shortlists', element: <ShortlistsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-sm text-slate-600">
      Loading route shell...
    </div>
  )
}

export function AppRouter() {
  return (
    <AppProviders>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  )
}