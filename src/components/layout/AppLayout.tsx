import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function AppLayout() {
  return (
    <div className="flex h-screen bg-milk">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout