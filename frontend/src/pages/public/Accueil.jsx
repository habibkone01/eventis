import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getEvenements } from '../../api/evenements'
import { getCategories } from '../../api/categories'
import EvenementCard from '../../components/EvenementCard'

export default function Accueil() {
    const [evenementsRecents, setEvenementsRecents] = useState([])
    const [evenementsAvenir, setEvenementsAvenir] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [recents, avenir, cats] = await Promise.all([
                getEvenements({ statut: 'publie', per_page: 3, sort: 'recent' }),
                getEvenements({ statut: 'publie', per_page: 3 }),
                getCategories({ per_page: 100 })
            ])
            setEvenementsRecents(recents.data || [])
            setEvenementsAvenir(avenir.data || [])
            setCategories(cats.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* HERO */}
            <section className="bg-white py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
                        Vivez des <span className="text-red-500">moments</span><br />inoubliables
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg lg:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
                        Éventis rassemble tous les événements locaux d'Abidjan en un seul endroit. Trouvez, inscrivez-vous et profitez — sans créer de compte.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/evenements"
                            className="flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors no-underline"
                        >
                            Découvrir les événements
                        </Link>
                        <Link
                            to="/contact"
                            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50 transition-colors no-underline"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            {/* QUI SOMMES NOUS */}
            <section className="bg-gray-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Qui sommes-nous</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
                                La plateforme qui connecte les gens aux événements
                            </h2>
                            <p className="text-gray-500 text-base leading-relaxed mb-6">
                                Éventis est née d'une conviction simple : tout le monde devrait pouvoir découvrir et participer aux événements qui se déroulent près de chez lui, sans friction ni inscription fastidieuse.
                            </p>
                            <p className="text-gray-500 text-base leading-relaxed">
                                Notre mission est de mettre en lumière les événements locaux d'Abidjan et de toute la Côte d'Ivoire, qu'ils soient culturels, sportifs, professionnels ou festifs.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-500 text-white rounded-2xl p-8 col-span-2 text-center lg:text-left">
                                <div className="text-4xl font-black mb-2">
                                    {loading ? '...' : `${evenementsAvenir.length > 0 ? '18 000+' : '0'}`}
                                </div>
                                <div className="text-red-100 text-sm">Participants inscrits</div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center lg:text-left">
                                <div className="text-3xl font-black text-gray-900 mb-2">
                                    {loading ? '...' : evenementsAvenir.length}
                                </div>
                                <div className="text-gray-400 text-sm">Événements à venir</div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center lg:text-left">
                                <div className="text-3xl font-black text-gray-900 mb-2">
                                    {loading ? '...' : categories.length}
                                </div>
                                <div className="text-gray-400 text-sm">Catégories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="bg-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Parcourir par</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Catégories</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/evenements?categorie_id=${cat.id}`}
                                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-red-300 hover:bg-red-50 transition-all no-underline group"
                                >
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-red-500 transition-colors">{cat.libelle}</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* EVENEMENTS A VENIR */}
            <section className="bg-gray-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">À ne pas manquer</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Événements à venir</h2>
                        </div>
                        <Link to="/evenements" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 no-underline">
                            Voir tout <ChevronRight size={16} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>
                    ) : evenementsAvenir.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Aucun événement à venir</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {evenementsAvenir.map((ev) => (
                                <EvenementCard key={ev.id} evenement={ev} />
                            ))}
                        </div>
                    )}
                    <div className="sm:hidden mt-8 text-center">
                        <Link to="/evenements" className="text-sm font-semibold text-red-500 no-underline">Voir tous les événements →</Link>
                    </div>
                </div>
            </section>

            {/* DERNIERS AJOUTES */}
            <section className="bg-white py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Nouveautés</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Derniers ajoutés</h2>
                        </div>
                        <Link to="/evenements" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 no-underline">
                            Voir tout <ChevronRight size={16} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>
                    ) : evenementsRecents.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Aucun événement récent</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {evenementsRecents.map((ev) => (
                                <EvenementCard key={ev.id} evenement={ev} />
                            ))}
                        </div>
                    )}
                    <div className="sm:hidden mt-8 text-center">
                        <Link to="/evenements" className="text-sm font-semibold text-red-500 no-underline">Voir tous les événements →</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}