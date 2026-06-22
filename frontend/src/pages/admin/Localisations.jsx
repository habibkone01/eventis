import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getLocalisations, deleteLocalisation } from '../../api/localisations'

export default function Localisations() {
    const { token } = useAuth()
    const [localisations, setLocalisations] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchLocalisations()
    }, [])

    const fetchLocalisations = async (page = 1) => {
        setLoading(true)
        try {
            const data = await getLocalisations({ page, per_page: 10 })
            setLocalisations(data.data || [])
            setCurrentPage(data.meta?.current_page || 1)
            setLastPage(data.meta?.last_page || 1)
            setTotal(data.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette localisation ?')) return
        try {
            const data = await deleteLocalisation(token, id)
            if (data.success) fetchLocalisations(currentPage)
            else alert(data.message)
        } catch (err) {
            console.error(err)
        }
    }

    const handlePage = (page) => {
        fetchLocalisations(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-20 lg:pt-8 lg:p-8">

                    {/* Topbar */}
                    <div className="my-6 lg:mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Localisations</h1>
                            <p className="text-gray-500 text-sm">Gérez les communes et lieux</p>
                        </div>
                        <Link
                            to="/admin/localisations/creer"
                            className="flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-600 transition-colors no-underline shrink-0"
                        >
                            <Plus size={15} />
                            <span className="hidden sm:inline">Ajouter une localisation</span>
                            <span className="sm:hidden">Ajouter</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : localisations.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucune localisation</div>
                    ) : (
                        <>
                            {/* Vue desktop */}
                            <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Libellé</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Créé le</th>
                                            <th className="px-5 py-3.5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {localisations.map((loc) => (
                                            <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 text-sm text-gray-500">{loc.libelle}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{loc.created_at?.split(' ')[0]}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link
                                                            to={`/admin/localisations/${loc.id}/modifier`}
                                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline"
                                                        >
                                                            <Pencil size={14} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(loc.id)}
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
                                        <p className="text-sm text-gray-600">{total} localisation(s) au total</p>
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
                            <div className="sm:hidden flex flex-col gap-3">
                                {localisations.map((loc) => (
                                    <div key={loc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900">{loc.libelle}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{loc.created_at?.split(' ')[0]}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/localisations/${loc.id}/modifier`}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(loc.id)}
                                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {lastPage > 1 && (
                                    <div className="flex flex-col items-center gap-3 pt-2">
                                        <p className="text-sm text-gray-600">{total} localisation(s) au total</p>
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