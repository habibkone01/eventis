import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calendar, MapPin, Clock, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getEvenements } from '../../api/evenements'
import { getCategories } from '../../api/categories'
import { getLocalisations } from '../../api/localisations'
import EvenementCard from '../../components/EvenementCard'

export default function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [evenements, setEvenements] = useState([])
    const [categories, setCategories] = useState([])
    const [localisations, setLocalisations] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [showFiltersMobile, setShowFiltersMobile] = useState(false)

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categorie_id: searchParams.get('categorie_id') || '',
        localisation_id: searchParams.get('localisation_id') || '',
        date_debut: searchParams.get('date_debut') || '',
    })

    useEffect(() => {
        fetchCategories()
        fetchLocalisations()
    }, [])

    useEffect(() => {
        fetchEvenements(filters, 1)
    }, [searchParams])

    const fetchCategories = async () => {
        try {
            const data = await getCategories({ per_page: 100 })
            setCategories(data.data || [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchLocalisations = async () => {
        try {
            const data = await getLocalisations({ per_page: 100 })
            setLocalisations(data.data || [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchEvenements = async (params = {}, page = 1) => {
        setLoading(true)
        try {
            const data = await getEvenements({ ...params, statut: 'publie', page, per_page: 9 })
            setEvenements(data.data || [])
            setCurrentPage(data.meta?.current_page || 1)
            setLastPage(data.meta?.last_page || 1)
            setTotal(data.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (e) => {
        e.preventDefault()
        setSearchParams(filters)
        fetchEvenements(filters, 1)
        setShowFiltersMobile(false)
    }

    const handleReset = () => {
        const empty = { search: '', categorie_id: '', localisation_id: '', date_debut: '' }
        setFilters(empty)
        setSearchParams({})
        fetchEvenements({}, 1)
        setShowFiltersMobile(false)
    }

    const handlePage = (page) => {
        fetchEvenements(filters, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10 lg:py-16 overflow-x-hidden">

                {/* Titre page */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Tous les événements</p>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Catalogue</h1>
                </div>

                {/* Bouton filtres mobile */}
                <button
                    onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                    className="lg:hidden flex items-center gap-2 mb-6 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700"
                >
                    <SlidersHorizontal size={15} className="text-red-500" />
                    Filtres
                </button>

                <div className="flex gap-8 items-start">

                    {/* Panneau filtres */}
                    <aside className={`${showFiltersMobile ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
                        <form onSubmit={handleFilter} className="bg-white border border-gray-200 rounded-2xl p-6">

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 font-black text-gray-900">
                                    <SlidersHorizontal size={16} className="text-red-500" />
                                    Filtres
                                </div>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Tout effacer
                                </button>
                            </div>

                            {/* Recherche */}
                            <div className="mb-6">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Recherche</div>
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        placeholder="Nom de l'événement..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>

                            {/* Catégorie */}
                            <div className="mb-6">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Catégorie</div>
                                <div className="space-y-2.5">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                                            <div
                                                onClick={() => setFilters({
                                                    ...filters,
                                                    categorie_id: filters.categorie_id === String(cat.id) ? '' : String(cat.id)
                                                })}
                                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                                                    filters.categorie_id === String(cat.id)
                                                        ? 'bg-red-500 border-red-500'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                {filters.categorie_id === String(cat.id) && (
                                                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-600">{cat.libelle}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Localisation */}
                            <div className="mb-6">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Lieu / Commune</div>
                                <select
                                    value={filters.localisation_id}
                                    onChange={(e) => setFilters({ ...filters, localisation_id: e.target.value })}
                                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-red-400"
                                >
                                    <option value="">Toutes les communes</option>
                                    {localisations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>{loc.libelle}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Date de début</div>
                                <input
                                    type="date"
                                    value={filters.date_debut}
                                    onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:border-red-400"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
                            >
                                <Search size={14} />
                                Rechercher
                            </button>
                        </form>
                    </aside>

                    {/* Résultats */}
                    <div className="flex-1 min-w-0">

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-gray-400 text-sm">Chargement...</div>
                            </div>
                        ) : evenements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Calendar size={48} className="text-gray-200 mb-4" />
                                <p className="text-gray-400 text-sm mb-4">Aucun événement trouvé</p>
                                <button onClick={handleReset} className="text-sm font-semibold text-red-500 hover:text-red-600">
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                                    {evenements.map((ev) => (
                                        <EvenementCard key={ev.id} evenement={ev} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {lastPage > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-500">{total} événement(s) au total</p>
                                        <div className="flex items-center gap-2 flex-wrap justify-center">
                                            <button
                                                onClick={() => handlePage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePage(page)}
                                                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-red-500 text-white'
                                                            : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePage(currentPage + 1)}
                                                disabled={currentPage === lastPage}
                                                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}