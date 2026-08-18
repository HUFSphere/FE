import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function AppLayout() {
  return (
    <div className="flex h-screen bg-milk">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mt-22 h-[calc(100vh-5.5rem)] overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout