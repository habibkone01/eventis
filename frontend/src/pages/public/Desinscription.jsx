import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, Calendar, MapPin, CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getDesinscription, desinscription } from '../../api/inscriptions'

export default function Desinscription() {
    const { token } = useParams()
    const [inscription, setInscription] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchInscription()
    }, [token])

    const fetchInscription = async () => {
        setLoading(true)
        try {
            const data = await getDesinscription(token)
            if (!data.success) {
                setError(data.message)
                return
            }
            setInscription(data.inscription)
        } catch (err) {
            setError('Lien de désinscription invalide ou expiré.')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async () => {
        setSubmitting(true)
        try {
            const data = await desinscription(token)
            if (!data.success) {
                setError(data.message)
                return
            }
            setDone(true)
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center py-32">
                <div className="text-gray-400 text-sm">Chargement...</div>
            </div>
            <Footer />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-lg mx-auto px-6 py-16 lg:py-24">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">

                    {done ? (
                        <>
                            <div className="w-16 h-16 bg-green-50 border-2 border-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 mb-3">Désinscription confirmée</h1>
                            <p className="text-sm text-gray-500 mb-8">
                                Vous avez bien été désinscrit. Votre place est maintenant disponible pour d'autres participants.
                            </p>
                            <Link
                                to="/evenements"
                                className="inline-flex items-center justify-center bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-red-600 transition-colors no-underline"
                            >
                                Voir les événements
                            </Link>
                        </>
                    ) : error ? (
                        <>
                            <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 mb-3">Lien invalide</h1>
                            <p className="text-sm text-gray-500 mb-8">{error}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-red-600 transition-colors no-underline"
                            >
                                Retour à l'accueil
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>

                            <h1 className="text-xl font-black text-gray-900 mb-3">Se désinscrire</h1>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                Vous êtes sur le point de vous désinscrire de l'événement ci-dessous. Cette action est irréversible. Votre place sera libérée et disponible pour d'autres participants.
                            </p>

                            {inscription?.evenement && (
                                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-8">
                                    <div className="w-14 h-14 bg-linear-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Calendar size={24} className="text-white opacity-80" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm mb-1">
                                            {inscription.evenement.titre}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar size={11} className="text-red-500" />
                                            {inscription.evenement.date_debut?.split(' ')[0]}
                                            {inscription.evenement.localisation && (
                                                <>
                                                    <span className="text-gray-300">·</span>
                                                    <MapPin size={11} className="text-red-500" />
                                                    {inscription.evenement.localisation.libelle}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirm}
                                    disabled={submitting}
                                    className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Désinscription en cours...' : 'Confirmer la désinscription'}
                                </button>
                                <Link
                                    to="/evenements"
                                    className="w-full py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline flex items-center justify-center"
                                >
                                    Annuler — Rester inscrit
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}