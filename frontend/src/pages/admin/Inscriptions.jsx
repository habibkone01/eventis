import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getInscriptions, deleteInscription } from '../../api/inscriptions'

export default function Inscriptions() {
    const { token } = useAuth()
    const [inscriptions, setInscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchInscriptions()
    }, [])

    const fetchInscriptions = async (page = 1, searchVal = search) => {
        setLoading(true)
        try {
            const params = { page }
            if (searchVal) params.search = searchVal
            const data = await getInscriptions(token, params)
            setInscriptions(data.data || [])
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
        fetchInscriptions(1, search)
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette inscription ?')) return
        try {
            const data = await deleteInscription(token, id)
            if (data.success) fetchInscriptions(currentPage)
            else alert(data.message)
        } catch (err) {
            console.error(err)
        }
    }

    const handlePage = (page) => {
        fetchInscriptions(page, search)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-20 lg:pt-8 lg:p-8">

                    {/* Topbar */}
                    <div className="my-6 lg:mb-8">
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Inscriptions</h1>
                        <p className="text-gray-500 text-sm">Gérez toutes les inscriptions</p>
                    </div>

                    {/* Barre de recherche */}
                    <div className="flex justify-center mb-6">
                        <form onSubmit={handleSearch} className="w-full bg-white overflow-hidden flex flex-col sm:flex-row border border-gray-200 rounded-2xl">
                            <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100 flex-1">
                                <Search size={14} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher par nom ou email..."
                                    className="border-none bg-transparent text-sm text-gray-700 outline-none w-full"
                                />
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

                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : inscriptions.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucune inscription trouvée</div>
                    ) : (
                        <>
                            {/* Vue desktop */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Participant</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Événement</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-5 py-3.5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {inscriptions.map((ins) => (
                                            <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{ins.nom_participant}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{ins.email_participant}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500 max-w-50 truncate">{ins.evenement?.titre}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{ins.created_at?.split(' ')[0]}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link
                                                            to={`/admin/inscriptions/${ins.id}`}
                                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline"
                                                        >
                                                            <Eye size={14} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(ins.id)}
                                                            className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {lastPage > 1 && (
                                    <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">{total} inscription(s) au total</p>
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
                                {inscriptions.map((ins) => (
                                    <div key={ins.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between gap-3 p-4 pb-3">
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 truncate">{ins.nom_participant}</div>
                                                <div className="text-xs text-gray-400 mt-0.5 truncate">{ins.email_participant}</div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                    to={`/admin/inscriptions/${ins.id}`}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline"
                                                >
                                                    <Eye size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ins.id)}
                                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 mx-4">
                                            <div className="flex-1 py-2.5 pr-3">
                                                <div className="text-xs text-gray-400 mb-0.5">Événement</div>
                                                <div className="text-xs font-semibold text-gray-900 truncate max-w-30">{ins.evenement?.titre}</div>
                                            </div>
                                            <div className="flex-1 py-2.5 pl-3">
                                                <div className="text-xs text-gray-400 mb-0.5">Date</div>
                                                <div className="text-xs font-semibold text-gray-900">{ins.created_at?.split(' ')[0]}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {lastPage > 1 && (
                                    <div className="flex flex-col items-center gap-3 pt-2">
                                        <p className="text-sm text-gray-600">{total} inscription(s) au total</p>
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