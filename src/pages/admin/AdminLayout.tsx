import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Building2, ClipboardList, LogOut, Menu, X, Users, BookOpen, Megaphone } from 'lucide-react'



const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/propiedades', label: 'Propiedades', icon: Building2 },
  { path: '/admin/formularios', label: 'Formularios', icon: ClipboardList },
  { path: '/admin/asesores', label: 'Asesores', icon: Users },
  { path: '/admin/catalogo-asesores', label: 'Catálogo Asesores', icon: BookOpen },
  { path: '/admin/pautas', label: 'Pautas', icon: Megaphone },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const currentPath = location.pathname

  const handleLogout = () => {
    localStorage.removeItem('sb-jsadaigsymrbovdhiybq-auth-token')
    localStorage.removeItem('lual-auth')
    window.location.href = '/#/admin'
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <motion.aside
        initial={{ width: sidebarOpen ? 240 : 64 }}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2 }}
        className="bg-card border-r border-border flex flex-col fixed h-full z-10 overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between min-h-[65px]">
          {sidebarOpen && (
            <img src="/images/LOGO LUAL-01.png" alt="LUAL" className="h-8 w-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-auto flex-shrink-0"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
            )}
          </button>
        </div>
      </motion.aside>

      <main
        className="flex-1 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? 240 : 64 }}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}