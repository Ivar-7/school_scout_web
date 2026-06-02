import { Outlet } from 'react-router-dom'
import { AppShell } from '../../shared/components/AppShell'

export default function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}