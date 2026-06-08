import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getOrganisateur, createOrganisateur, updateOrganisateur } from '../../api/organisateurs'

export default function OrganisateurForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    const isEdit = Boolean(id)

    const [form, setForm] = useState({
        nom: '',
        email: '',
        telephone: '',
        description: '',
    })
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(isEdit)
    const [errors, setErrors] = useState({})
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isEdit) return
        const fetchOrganisateur = async () => {
            setLoadingData(true)
            try {
                const data = await getOrganisateur(token, id)
                const org = data.organisateur
                setForm({
                    nom: org.nom || '',
                    email: org.email || '',
                    telephone: org.telephone || '',
                    description: org.description || '',
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingData(false)
            }
        }
        fetchOrganisateur()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setError(null)
        setLoading(true)

        try {
            const formData = new FormData()
            Object.entries(form).forEach(([key, value]) => {
                if (value !== '') formData.append(key, value)
            })

            const data = isEdit
                ? await updateOrganisateur(token, id, formData)
                : await createOrganisateur(token, formData)

            if (!data.success) {
                if (data.errors) setErrors(data.errors)
                else setError(data.message)
                return
            }

            navigate('/admin/organisateurs')
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Chargement...</div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-x-hidden">
                <div className="p-4 pt-20 lg:pt-8 lg:p-8">

                    <div className="my-6 lg:mb-8">
                        <Link
                            to="/admin/organisateurs"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 no-underline mb-4 transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Retour aux organisateurs
                        </Link>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                            {isEdit ? 'Modifier un organisateur' : 'Nouvel organisateur'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {isEdit ? "Modifiez les informations de l'organisateur" : 'Créez un nouvel organisateur'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="max-w-lg">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Nom *</label>
                                    <input
                                        type="text"
                                        value={form.nom}
                                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                                        placeholder="Nom de l'organisateur"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                    {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="email@exemple.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Téléphone</label>
                                    <input
                                        type="text"
                                        value={form.telephone}
                                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                                        placeholder="+225 07 00 00 00"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                    {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Description de l'organisateur"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
                                    />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Enregistrement...' : isEdit ? "Modifier l'organisateur" : "Créer l'organisateur"}
                                    </button>
                                    <Link
                                        to="/admin/organisateurs"
                                        className="w-full py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline text-center"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}