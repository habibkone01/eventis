import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { to: '/', label: 'Accueil' },
        { to: '/evenements', label: 'Événements' },
        { to: '/contact', label: 'Contact' },
    ]

    return (
        <>
            {/* MOBILE */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">
                <div className="flex items-center justify-between px-5 py-3 rounded-full bg-gray-900 shadow-lg">
                    <Link to="/" className="text-xl font-black text-white no-underline">
                        Évent<span className="text-red-500">is</span>
                    </Link>
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-white p-1"
                        aria-label="Ouvrir le menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {open && (
                    <>
                        <div className="mt-3 rounded-2xl bg-gray-900 shadow-xl overflow-hidden border border-white/10">
                            <div className="px-3 py-3 space-y-1">
                                {navLinks.map(({ to, label }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center px-4 py-3 rounded-xl text-sm no-underline transition-all ${
                                            isActive(to)
                                                ? 'bg-red-500/20 text-white font-semibold'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="fixed inset-0 -z-10 bg-black/40" onClick={() => setOpen(false)} />
                    </>
                )}
            </div>

            {/* DESKTOP */}
            <header className="hidden lg:block bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-black text-gray-900 no-underline">
                            Évent<span className="text-red-500">is</span>
                        </Link>
                        <nav className="flex items-center gap-8">
                            {navLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`text-sm font-medium no-underline transition-colors ${
                                        isActive(to)
                                            ? 'text-red-500'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Spacer mobile */}
            <div className="lg:hidden h-16" />
        </>
    )
}