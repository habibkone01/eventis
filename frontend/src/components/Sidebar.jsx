import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Tag, Users, FileText, LogOut, MapPin, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { logout as logoutApi } from '../api/auth'
import logoFondBlanc from '../assets/logofondblanc.png'
import logoFondNoir from '../assets/logofondnoir.png'

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { token, logout } = useAuth()
    const [open, setOpen] = useState(false)

    const isActive = (path) => location.pathname.startsWith(path)

    const handleLogout = async () => {
        try {
            await logoutApi(token)
        } catch (err) {
            console.error(err)
        } finally {
            logout()
            navigate('/admin/login')
        }
    }

    const navItems = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/evenements', label: 'Événements', icon: Calendar },
        { to: '/admin/categories', label: 'Catégories', icon: Tag },
        { to: '/admin/localisations', label: 'Localisations', icon: MapPin },
        { to: '/admin/organisateurs', label: 'Organisateurs', icon: Users },
        { to: '/admin/inscriptions', label: 'Inscriptions', icon: FileText },
    ]

    return (
        <>
            {/* MOBILE */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">
                <div className="flex items-center justify-between px-5 py-3 rounded-full bg-gray-900 shadow-lg">
                    <img src={logoFondNoir} alt="Éventis" className="h-6 w-auto" />
                    <button onClick={() => setOpen(!open)} className="text-white p-1" aria-label="Ouvrir le menu">
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {open && (
                    <>
                        <div className="mt-3 rounded-2xl bg-gray-900 shadow-xl overflow-hidden border border-white/10">
                            <div className="px-3 py-3 space-y-1">
                                <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Principal
                                </div>
                                {navItems.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline transition-all ${isActive(to)
                                                ? 'bg-red-500/20 text-white font-semibold'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-white/10 px-3 py-2">
                                <button
                                    onClick={() => { handleLogout(); setOpen(false) }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 bg-transparent border-none cursor-pointer hover:bg-red-500/10"
                                >
                                    <LogOut size={16} />
                                    Déconnexion
                                </button>
                            </div>
                        </div>

                        <div className="fixed inset-0 -z-10 bg-black/40" onClick={() => setOpen(false)} />
                    </>
                )}
            </div>

            {/* Spacer mobile */}
            <div className="lg:hidden h-16" />

            {/* DESKTOP */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">

                {/* Logo */}
                <div className="px-6 py-5 border-b border-gray-200">
                    <img src={logoFondBlanc} alt="Éventis" className="h-6 w-auto" />
                </div>

                {/* Navigation principale */}
                <div className="flex-1 py-3">
                    <div className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                        Principal
                    </div>
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium no-underline transition-all border-l-[3px] ${isActive(to)
                                    ? 'text-red-500 bg-red-50 border-red-500'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                                }`}
                        >
                            <Icon size={16} className="shrink-0" />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Déconnexion */}
                <div className="py-3 border-t border-gray-200">
                    <div className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                        Compte
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all border-l-[3px] border-transparent bg-transparent cursor-pointer"
                    >
                        <LogOut size={16} className="shrink-0" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    )
}