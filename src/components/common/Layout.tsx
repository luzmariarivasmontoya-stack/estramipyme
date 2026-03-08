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
        <div className="flex-1 flex flex-col min-w-0">
          <Navigation />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
            <Outlet />
          </main>
        </div>
        <UpgradeModal />
      </div>
    </AutosaveProvider>
  )
}
