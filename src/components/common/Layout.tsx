import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navigation } from './Navigation'
import { UpgradeModal } from './UpgradeModal'
import { AutosaveProvider } from '@/hooks/useAutosave'

export function Layout() {
  return (
    <AutosaveProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navigation />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        <UpgradeModal />
      </div>
    </AutosaveProvider>
  )
}
