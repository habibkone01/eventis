import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Tag, FileText, Plus } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getEvenements } from '../../api/evenements'
import { getInscriptions } from '../../api/inscriptions'
import { getOrganisateurs } from '../../api/organisateurs'
import { getCategories } from '../../api/categories'

export default function Dashboard() {
    const { user, token } = useAuth()
    const [stats, setStats] = useState({ evenements: 0, inscriptions: 0, organisateurs: 0, categories: 0 })
    const [evenements, setEvenements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [evs, ins, orgs, cats] = await Promise.all([
                    getEvenements({ per_page: 5 }),
                    getInscriptions(token, { per_page: 1 }),
                    getOrganisateurs(token, { per_page: 1 }),
                    getCategories({ per_page: 1 })
                ])
                setStats({
                    evenements: evs.meta?.total || 0,
                    inscriptions: ins.meta?.total || 0,
                    organisateurs: orgs.meta?.total || 0,
                    categories: cats.meta?.total || 0,
                })
                setEvenements(evs.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statutPill = (statut) => {
        const styles = {
            publie: 'bg-green-100 text-green-700',
            annule: 'bg-red-100 text-red-500',
            termine: 'bg-gray-100 text-gray-500',
        }
        const labels = { publie: 'Publié', annule: 'Annulé', termine: 'Terminé' }
        return (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || 'bg-gray-100 text-gray-500'}`}>
                {labels[statut] || statut}
            </span>
        )
    }

    const initiales = (email) => email ? email.substring(0, 2).toUpperCase() : 'AD'

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-24 lg:p-10">

                    {/* Topbar */}
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-black">{initiales(user?.email)}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.email}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
                                <Calendar size={13} className="text-red-500" />
                                Événements
                            </div>
                            <div className="text-4xl font-black text-gray-900">
                                {loading ? '...' : stats.evenements}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
                                <FileText size={13} className="text-red-500" />
                                Inscriptions
                            </div>
                            <div className="text-4xl font-black text-gray-900">
                                {loading ? '...' : stats.inscriptions}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
                                <Users size={13} className="text-red-500" />
                                Organisateurs
                            </div>
                            <div className="text-4xl font-black text-gray-900">
                                {loading ? '...' : stats.organisateurs}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
                                <Tag size={13} className="text-red-500" />
                                Catégories
                            </div>
                            <div className="text-4xl font-black text-gray-900">
                                {loading ? '...' : stats.categories}
                            </div>
                        </div>
                    </div>

                    {/* Tableau derniers événements */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-sm font-black text-gray-900">Derniers événements</h2>
                            <Link
                                to="/admin/evenements"
                                className="text-sm font-medium text-red-500 hover:text-red-600 no-underline"
                            >
                                Voir tout
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Titre</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Catégorie</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">Chargement...</td>
                                        </tr>
                                    ) : evenements.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">Aucun événement</td>
                                        </tr>
                                    ) : (
                                        evenements.map((ev) => (
                                            <tr key={ev.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{ev.titre}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{ev.categorie?.libelle}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{ev.date_debut?.split(' ')[0]}</td>
                                                <td className="px-6 py-4">{statutPill(ev.statut)}</td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/admin/evenements/${ev.id}/modifier`}
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors no-underline"
                                                    >
                                                        Modifier
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}