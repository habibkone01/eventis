import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Calendar, MapPin, ShieldCheck, CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getEvenement } from '../../api/evenements'
import { createInscription } from '../../api/inscriptions'

export default function DetailEvenement() {
    const { id } = useParams()
    const [evenement, setEvenement] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [inscription, setInscription] = useState(null)
    const [form, setForm] = useState({ nom_participant: '', email_participant: '' })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchEvenement()
    }, [id])

    const fetchEvenement = async () => {
        setLoading(true)
        try {
            const data = await getEvenement(id)
            setEvenement(data.evenement)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setError(null)
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('evenement_id', id)
            formData.append('nom_participant', form.nom_participant)
            formData.append('email_participant', form.email_participant)

            const data = await createInscription(formData)

            if (!data.success) {
                if (data.errors) setErrors(data.errors)
                else setError(data.message)
                return
            }

            setInscription(data.inscription)
            setShowModal(true)
            setForm({ nom_participant: '', email_participant: '' })
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Navbar />
            <div className="flex items-center justify-center py-32">
                <div className="text-gray-400 text-sm">Chargement...</div>
            </div>
            <Footer />
        </div>
    )

    if (!evenement) return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
                <p className="text-gray-400 text-sm mb-4">Événement introuvable</p>
                <Link to="/evenements" className="text-sm font-bold text-red-500 no-underline">← Retour aux événements</Link>
            </div>
            <Footer />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 ">
            <Navbar />

            {/* Modal confirmation */}
            {showModal && inscription && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                        <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={36} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Inscription confirmée !</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Votre inscription au <strong>{evenement.titre}</strong> a bien été enregistrée. Un email de confirmation vous a été envoyé avec un lien de désinscription.
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-3">
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-400">Événement</span>
                                <span className="font-semibold text-gray-900 text-right max-w-[60%] line-clamp-1">{evenement.titre}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-400">Date</span>
                                <span className="font-semibold text-gray-900">{evenement.date_debut?.split(' ')[0]}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                <span className="text-gray-400">Lieu</span>
                                <span className="font-semibold text-gray-900">{evenement.lieu || evenement.localisation?.libelle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Email confirmé</span>
                                <span className="font-semibold text-gray-900">{inscription.email_participant}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            Retour à l'événement
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10 lg:py-16">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-hidden">
                    <Link to="/evenements" className="hover:text-gray-700 flex items-center gap-1 no-underline transition-colors shrink-0">
                        <ArrowLeft size={15} />
                        Les événements
                    </Link>
                    <ChevronRight size={14} className="shrink-0 text-gray-300" />
                    <span className="text-gray-700 font-medium truncate">{evenement.titre}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">

                    {/* Colonne gauche — infos */}
                    <div className="lg:col-span-2">

                        {/* Image */}
                        <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8 relative">
                            {evenement.image_url ? (
                                <img src={evenement.image_url} alt={evenement.titre} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
                                    <Calendar size={72} className="text-white opacity-40" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                {evenement.categorie?.libelle}
                            </div>
                        </div>

                        {/* Titre */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-5 leading-tight">
                            {evenement.titre}
                        </h1>

                        {/* Description */}
                        {evenement.description && (
                            <p className="text-gray-500 text-base leading-relaxed mb-8 whitespace-pre-line">
                                {evenement.description}
                            </p>
                        )}

                        {/* Organisateur */}
                        {evenement.organisateur && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-white font-black text-lg">{evenement.organisateur.nom[0]}</span>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Organisé par</div>
                                    <div className="font-bold text-gray-900 text-sm">{evenement.organisateur.nom}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colonne droite — carte inscription */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:sticky lg:top-24">

                            {/* Titre carte */}
                            <div className="font-black text-gray-900 text-lg mb-5">Informations pratiques</div>

                            {/* Infos */}
                            <div className="space-y-4 mb-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Calendar size={16} className="text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Date de début</div>
                                        <div className="text-sm font-semibold text-gray-900">{evenement.date_debut?.split(' ')[0]}</div>
                                    </div>
                                </div>
                                {evenement.date_fin && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Calendar size={16} className="text-red-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Date de fin</div>
                                            <div className="text-sm font-semibold text-gray-900">{evenement.date_fin?.split(' ')[0]}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={16} className="text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Lieu</div>
                                        <div className="text-sm font-semibold text-gray-900">{evenement.lieu || evenement.localisation?.libelle}</div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-5" />

                            {/* Formulaire */}
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                <Calendar size={16} className="text-red-500" />
                                S'inscrire à cet événement
                            </div>

                            {evenement.statut !== 'publie' ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        {evenement.statut === 'annule'
                                            ? 'Cet événement a été annulé.'
                                            : 'Les inscriptions sont fermées.'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                                    )}
                                    <form onSubmit={handleSubmit} noValidate className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                value={form.nom_participant}
                                                onChange={(e) => { setForm({ ...form, nom_participant: e.target.value }); setErrors({}) }}
                                                placeholder="Votre nom et prénom"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.nom_participant && (
                                                <p className="text-xs text-red-500 mt-1">{errors.nom_participant[0]}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                                Adresse email
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email_participant}
                                                onChange={(e) => { setForm({ ...form, email_participant: e.target.value }); setErrors({}) }}
                                                placeholder="Votre adresse email"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.email_participant && (
                                                <p className="text-xs text-red-500 mt-1">{errors.email_participant[0]}</p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting ? 'Inscription en cours...' : 'Confirmer mon inscription →'}
                                        </button>
                                    </form>
                                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-3">
                                        <ShieldCheck size={12} />
                                        <span>Un lien de désinscription vous sera envoyé par email</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}