import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-nu-gray-100 font-body">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
