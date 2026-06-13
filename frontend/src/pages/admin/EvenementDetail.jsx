import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Pencil, Ban, Trash2 } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getEvenement, annulerEvenement, deleteEvenement } from '../../api/evenements'
import { getInscriptions } from '../../api/inscriptions'
import { useNavigate } from 'react-router-dom'

export default function EvenementDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    const [evenement, setEvenement] = useState(null)
    const [inscriptions, setInscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [evData, insData] = await Promise.all([
                getEvenement(id),
                getInscriptions(token, { evenement_id: id, per_page: 100 })
            ])
            setEvenement(evData.evenement)
            setInscriptions(insData.data || [])
            setTotal(insData.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAnnuler = async () => {
        if (!confirm('Voulez-vous vraiment annuler cet événement ?')) return
        const data = await annulerEvenement(token, id)
        if (data.success) fetchData()
        else alert(data.message)
    }

    const handleDelete = async () => {
        if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return
        const data = await deleteEvenement(token, id)
        if (data.success) navigate('/admin/evenements')
        else alert(data.message)
    }

    const statutBadge = (statut) => {
        if (statut === 'publie') return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70]">Publié</span>
        if (statut === 'annule') return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500">Annulé</span>
        return <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-500">Terminé</span>
    }

    if (loading) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Chargement...</div>
            </div>
        </div>
    )

    if (!evenement) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Événement introuvable</div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-24 lg:p-8">

                    {/* Topbar */}
                    <div className="my-6 lg:mb-8">
                        <Link
                            to="/admin/evenements"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 no-underline mb-4 transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Retour aux événements
                        </Link>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{evenement.titre}</h1>
                                <p className="text-gray-500 text-sm">{evenement.categorie?.libelle}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {statutBadge(evenement.statut)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* Image */}
                            {evenement.image && (
                                <div className="w-full h-56 rounded-2xl overflow-hidden">
                                    <img src={evenement.image} alt={evenement.titre} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Infos */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide">Informations</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Calendar size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Date de début</div>
                                            <div className="text-sm font-semibold text-gray-900">{evenement.date_debut?.split(' ')[0]}</div>
                                        </div>
                                    </div>
                                    {evenement.date_fin && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Calendar size={15} className="text-red-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 mb-0.5">Date de fin</div>
                                                <div className="text-sm font-semibold text-gray-900">{evenement.date_fin?.split(' ')[0]}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Lieu</div>
                                            <div className="text-sm font-semibold text-gray-900">{evenement.lieu || evenement.localisation?.libelle}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Users size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Capacité</div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {total} / {evenement.capacite_max || '∞'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {evenement.description && (
                                    <div className="mt-5 pt-5 border-t border-gray-100">
                                        <div className="text-xs text-gray-400 mb-2">Description</div>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{evenement.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Inscriptions */}
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-sm font-bold text-gray-900">Inscriptions <span className="text-gray-400 font-normal">({total})</span></h2>
                                </div>
                                {inscriptions.length === 0 ? (
                                    <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
                                        Aucune inscription
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Nom</th>
                                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {inscriptions.map((ins) => (
                                                <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{ins.nom_participant}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-500">{ins.email_participant}</td>
                                                    <td className="px-6 py-3 text-sm text-gray-500">{ins.created_at?.split(' ')[0]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Colonne droite */}
                        <div className="space-y-5">

                            {/* Organisateur */}
                            {evenement.organisateur && (
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Organisateur</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="text-white font-black">{evenement.organisateur.nom[0]}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{evenement.organisateur.nom}</div>
                                            {evenement.organisateur.email && (
                                                <div className="text-xs text-gray-400">{evenement.organisateur.email}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
                                <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Actions</h2>
                                <Link
                                    to={`/admin/evenements/${id}/modifier`}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors no-underline"
                                >
                                    <Pencil size={14} />
                                    Modifier
                                </Link>
                                {evenement.statut === 'publie' && (
                                    <button
                                        onClick={handleAnnuler}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                    >
                                        <Ban size={14} />
                                        Annuler l'événement
                                    </button>
                                )}
                                {evenement.statut !== 'publie' && (
                                    <button
                                        onClick={handleDelete}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}