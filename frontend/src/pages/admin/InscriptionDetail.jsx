import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, User } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getInscription } from '../../api/inscriptions'

export default function InscriptionDetail() {
    const { id } = useParams()
    const { token } = useAuth()
    const [inscription, setInscription] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInscription = async () => {
            setLoading(true)
            try {
                const data = await getInscription(token, id)
                setInscription(data.inscription)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchInscription()
    }, [])

    if (loading) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Chargement...</div>
            </div>
        </div>
    )

    if (!inscription) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Inscription introuvable</div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-20 lg:pt-8 lg:p-8">

                    {/* Topbar */}
                    <div className="my-6 lg:mb-8">
                        <Link
                            to="/admin/inscriptions"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 no-underline mb-4 transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Retour aux inscriptions
                        </Link>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Détail inscription</h1>
                        <p className="text-gray-500 text-sm mt-1">Informations complètes de l'inscription</p>
                    </div>

                    <div className="max-w-lg">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">

                            {/* Participant */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Participant</div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <User size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Nom complet</div>
                                            <div className="text-sm font-semibold text-gray-900">{inscription.nom_participant}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Mail size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Email</div>
                                            <div className="text-sm font-semibold text-gray-900">{inscription.email_participant}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Événement */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Événement</div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Calendar size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Titre</div>
                                            <div className="text-sm font-semibold text-gray-900">{inscription.evenement?.titre}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Calendar size={15} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Date de l'événement</div>
                                            <div className="text-sm font-semibold text-gray-900">{inscription.evenement?.date_debut?.split(' ')[0]}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Dates inscription */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Inscription</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Calendar size={15} className="text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Inscrit le</div>
                                        <div className="text-sm font-semibold text-gray-900">{inscription.created_at?.split(' ')[0]}</div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Lien vers l'événement admin */}
                            <Link
                                to={`/admin/evenements/${inscription.evenement?.id}`}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors no-underline"
                            >
                                Voir l'événement
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}