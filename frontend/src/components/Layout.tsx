import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-gray-700 p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">VTU</h1>
          <p className="text-sm text-gray-400">Visual Testing</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/validate"
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            Validate
          </Link>
          <Link
            to="/reports"
            className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            Reports
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-secondary border-b border-gray-700 px-6 py-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-white">Visual Testing</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="bg-secondary border-b border-gray-700 md:hidden">
            <Link
              to="/"
              className="block px-6 py-2 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/validate"
              className="block px-6 py-2 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              Validate
            </Link>
            <Link
              to="/reports"
              className="block px-6 py-2 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              Reports
            </Link>
          </nav>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
