import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getEvenements, annulerEvenement, deleteEvenement } from '../../api/evenements'

export default function Evenements() {
    const { token } = useAuth()
    const [evenements, setEvenements] = useState([])
    const [baseEvenements, setBaseEvenements] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statut, setStatut] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchEvenements(1, search, statut)
    }, [])

    const fetchEvenements = async (page = 1, searchVal = search, statutVal = statut) => {
        setLoading(true)
        try {
            const params = { page, per_page: 10 }
            if (searchVal) params.search = searchVal
            if (statutVal) params.statut = statutVal
            const data = await getEvenements(params)
            setEvenements(data.data || [])
            setBaseEvenements(data.data || [])
            setCurrentPage(data.meta?.current_page || 1)
            setLastPage(data.meta?.last_page || 1)
            setTotal(data.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchEvenements(1, search, statut)
    }

    // Recherche hybride : d'abord dans les données chargées, sinon dans la base
    const handleSearchChange = (value) => {
        setSearch(value)

        if (!value.trim()) {
            setEvenements(baseEvenements)
            return
        }

        const local = baseEvenements.filter(ev =>
            ev.titre?.toLowerCase().includes(value.toLowerCase())
        )

        if (local.length > 0) {
            setEvenements(local)
        } else {
            fetchEvenements(1, value, statut)
        }
    }

    const handleStatutChange = (e) => {
        const val = e.target.value
        setStatut(val)
        fetchEvenements(1, search, val)
    }

    const handleAnnuler = async (id) => {
        if (!confirm('Voulez-vous vraiment annuler cet événement ?')) return
        try {
            const data = await annulerEvenement(token, id)
            if (data.success) fetchEvenements(currentPage)
            else alert(data.message)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return
        try {
            const data = await deleteEvenement(token, id)
            if (data.success) fetchEvenements(currentPage)
            else alert(data.message)
        } catch (err) {
            console.error(err)
        }
    }

    const handlePage = (page) => {
        fetchEvenements(page, search, statut)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const statutBadge = (statut) => {
        if (statut === 'publie') return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70]">Publié</span>
        if (statut === 'annule') return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500">Annulé</span>
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-500">Terminé</span>
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-24 lg:p-8">

                    {/* Topbar */}
                    <div className="mb-6 lg:mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Événements</h1>
                            <p className="text-gray-500 text-sm">Gérez tous les événements</p>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="flex justify-center mb-6">
                        <form onSubmit={handleSearch} className="w-full bg-white overflow-hidden flex flex-col sm:flex-row border border-gray-200 rounded-2xl">
                            <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100 flex-1">
                                <Search size={14} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Rechercher un événement..."
                                    className="border-none bg-transparent text-sm text-gray-700 outline-none w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100">
                                <select
                                    value={statut}
                                    onChange={handleStatutChange}
                                    className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="publie">Publié</option>
                                    <option value="annule">Annulé</option>
                                    <option value="termine">Terminé</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-6 py-3 sm:py-0 sm:h-12 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shrink-0"
                            >
                                <Search size={13} />
                                Rechercher
                            </button>
                        </form>
                    </div>

                    {/* Bouton ajouter */}
                    <div className="flex justify-end mb-4">
                        <Link
                            to="/admin/evenements/creer"
                            className="flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-600 transition-colors no-underline"
                        >
                            <Plus size={15} />
                            Nouvel événement
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : evenements.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun événement trouvé</div>
                    ) : (
                        <>
                            {/* Vue desktop */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Titre</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Catégorie</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Organisateur</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                                            <th className="px-5 py-3.5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {evenements.map((ev) => (
                                            <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-gray-600 max-w-50 truncate">{ev.titre}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{ev.categorie?.libelle}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{ev.organisateur?.nom}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{ev.date_debut?.split(' ')[0]}</td>
                                                <td className="px-5 py-4">{statutBadge(ev.statut)}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link
                                                            to={`/admin/evenements/${ev.id}`}
                                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline"
                                                        >
                                                            <Eye size={14} />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/evenements/${ev.id}/modifier`}
                                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline"
                                                        >
                                                            <Pencil size={14} />
                                                        </Link>
                                                        {ev.statut === 'publie' && (
                                                            <button
                                                                onClick={() => handleAnnuler(ev.id)}
                                                                className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                            >
                                                                Annuler
                                                            </button>
                                                        )}
                                                        {ev.statut !== 'publie' && (
                                                            <button
                                                                onClick={() => handleDelete(ev.id)}
                                                                className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {lastPage > 1 && (
                                    <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">{total} événement(s) au total</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronLeft size={16} />
                                            </button>
                                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                                <button key={page} onClick={() => handlePage(page)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-red-500 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                    {page}
                                                </button>
                                            ))}
                                            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vue mobile */}
                            <div className="lg:hidden flex flex-col gap-3">
                                {evenements.map((ev) => (
                                    <div key={ev.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between gap-3 p-4 pb-3">
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 truncate">{ev.titre}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{ev.categorie?.libelle} · {ev.date_debut?.split(' ')[0]}</div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {statutBadge(ev.statut)}
                                                <Link to={`/admin/evenements/${ev.id}`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                    <Eye size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 mx-4">
                                            <div className="flex-1 py-2.5 pr-3">
                                                <div className="text-xs text-gray-400 mb-0.5">Organisateur</div>
                                                <div className="text-xs font-semibold text-gray-900 truncate">{ev.organisateur?.nom}</div>
                                            </div>
                                            <div className="flex-1 py-2.5 px-3">
                                                <div className="text-xs text-gray-400 mb-0.5">Lieu</div>
                                                <div className="text-xs font-semibold text-gray-900 truncate">{ev.localisation?.libelle}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-4 pt-3">
                                            <Link
                                                to={`/admin/evenements/${ev.id}/modifier`}
                                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            {ev.statut === 'publie' && (
                                                <button
                                                    onClick={() => handleAnnuler(ev.id)}
                                                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            {ev.statut !== 'publie' && (
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {lastPage > 1 && (
                                    <div className="flex flex-col items-center gap-3 pt-2">
                                        <p className="text-sm text-gray-600">{total} événement(s) au total</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronLeft size={16} />
                                            </button>
                                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                                <button key={page} onClick={() => handlePage(page)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-red-500 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                    {page}
                                                </button>
                                            ))}
                                            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}