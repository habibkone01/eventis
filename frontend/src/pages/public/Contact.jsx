import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { sendContact } from '../../api/contact'

export default function Contact() {
    const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setError(null)
        setSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('nom', form.nom)
            formData.append('email', form.email)
            formData.append('sujet', form.sujet)
            formData.append('message', form.message)

            const data = await sendContact(formData)

            if (!data.success) {
                if (data.errors) setErrors(data.errors)
                else setError(data.message)
                return
            }

            setSuccess(true)
            setForm({ nom: '', email: '', sujet: '', message: '' })
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-16 lg:py-24">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Colonne gauche — infos */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Nous contacter</p>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
                            Parlons de votre <span className="text-red-500">événement</span>
                        </h1>
                        <p className="text-gray-500 text-base leading-relaxed mb-10">
                            Vous souhaitez publier votre événement sur Éventis, ou vous avez une question sur la plateforme ? Notre équipe est disponible et répondra dans les 24h.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">Email</div>
                                    <div className="text-sm font-semibold text-gray-900">contact@eventis.ci</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">Téléphone</div>
                                    <div className="text-sm font-semibold text-gray-900">+225 07 00 00 00</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">Adresse</div>
                                    <div className="text-sm font-semibold text-gray-900">Cocody, Abidjan, Côte d'Ivoire</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite — formulaire */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8">
                        <h2 className="text-lg font-black text-gray-900 mb-6">Envoyez-nous un message</h2>

                        {success && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                                Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={form.nom}
                                    onChange={(e) => { setForm({ ...form, nom: e.target.value }); setErrors({}) }}
                                    placeholder="Votre nom et prénom"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                />
                                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}) }}
                                    placeholder="Votre adresse email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    value={form.sujet}
                                    onChange={(e) => { setForm({ ...form, sujet: e.target.value }); setErrors({}) }}
                                    placeholder="Objet de votre message"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                />
                                {errors.sujet && <p className="text-xs text-red-500 mt-1">{errors.sujet[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({}) }}
                                    placeholder="Décrivez votre demande..."
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
                                />
                                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message[0]}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Envoi en cours...' : 'Envoyer le message →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}