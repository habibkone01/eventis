import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { getEvenement, createEvenement, updateEvenement } from '../../api/evenements'
import { getCategories } from '../../api/categories'
import { getLocalisations } from '../../api/localisations'
import { getOrganisateurs } from '../../api/organisateurs'

export default function EvenementForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    const isEdit = Boolean(id)

    const [form, setForm] = useState({
        titre: '',
        description: '',
        date_debut: '',
        date_fin: '',
        lieu: '',
        capacite_max: '',
        categorie_id: '',
        organisateur_id: '',
        localisation_id: '',
    })
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageActuelle, setImageActuelle] = useState(null)
    const [categories, setCategories] = useState([])
    const [localisations, setLocalisations] = useState([])
    const [organisateurs, setOrganisateurs] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [errors, setErrors] = useState({})
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const [cats, locs, orgs] = await Promise.all([
                getCategories({ per_page: 100 }),
                getLocalisations({ per_page: 100 }),
                getOrganisateurs(token, { per_page: 100 })
            ])
            setCategories(cats.data || [])
            setLocalisations(locs.data || [])
            setOrganisateurs(orgs.data || [])

            if (isEdit) {
                const data = await getEvenement(id)
                const ev = data.evenement
                setForm({
                    titre: ev.titre || '',
                    description: ev.description || '',
                    date_debut: ev.date_debut?.replace(' ', 'T').substring(0, 16) || '',
                    date_fin: ev.date_fin?.replace(' ', 'T').substring(0, 16) || '',
                    lieu: ev.lieu || '',
                    capacite_max: ev.capacite_max || '',
                    categorie_id: ev.categorie?.id || '',
                    organisateur_id: ev.organisateur?.id || '',
                    localisation_id: ev.localisation?.id || '',
                })
                if (ev.image) setImageActuelle(ev.image)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingData(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

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
            if (image) formData.append('image', image)

            const data = isEdit
                ? await updateEvenement(token, id, formData)
                : await createEvenement(token, formData)

            if (!data.success) {
                if (data.errors) setErrors(data.errors)
                else setError(data.message)
                return
            }

            navigate('/admin/evenements')
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
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                            {isEdit ? 'Modifier un événement' : 'Nouvel événement'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {isEdit ? "Modifiez les informations de l'événement" : 'Créez un nouvel événement'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Colonne principale */}
                            <div className="lg:col-span-2 space-y-5">

                                {/* Informations générales */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide">Informations générales</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Titre *</label>
                                            <input
                                                type="text"
                                                value={form.titre}
                                                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                                                placeholder="Titre de l'événement"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.titre && <p className="text-xs text-red-500 mt-1">{errors.titre[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                placeholder="Description de l'événement"
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
                                            />
                                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Lieu</label>
                                            <input
                                                type="text"
                                                value={form.lieu}
                                                onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                                                placeholder="Adresse ou nom du lieu"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.lieu && <p className="text-xs text-red-500 mt-1">{errors.lieu[0]}</p>}
                                        </div>

                                        {/* Image */}
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Image</label>
                                            {imagePreview ? (
                                                <div className="mb-3">
                                                    <img src={imagePreview} alt="Aperçu" className="w-full h-40 object-cover rounded-xl" />
                                                </div>
                                            ) : imageActuelle ? (
                                                <div className="mb-3">
                                                    <img src={imageActuelle} alt="Image actuelle" className="w-full h-40 object-cover rounded-xl" />
                                                    <p className="text-xs text-gray-400 mt-1">Image actuelle — sélectionnez une nouvelle image pour la remplacer</p>
                                                </div>
                                            ) : null}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-500 hover:file:bg-red-100"
                                            />
                                            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image[0]}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide">Dates</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Date de début *</label>
                                            <input
                                                type="datetime-local"
                                                value={form.date_debut}
                                                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.date_debut && <p className="text-xs text-red-500 mt-1">{errors.date_debut[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Date de fin</label>
                                            <input
                                                type="datetime-local"
                                                value={form.date_fin}
                                                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.date_fin && <p className="text-xs text-red-500 mt-1">{errors.date_fin[0]}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne droite */}
                            <div className="space-y-5">

                                {/* Paramètres */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide">Paramètres</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Catégorie *</label>
                                            <select
                                                value={form.categorie_id}
                                                onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400"
                                            >
                                                <option value="">Sélectionner une catégorie</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                                                ))}
                                            </select>
                                            {errors.categorie_id && <p className="text-xs text-red-500 mt-1">{errors.categorie_id[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Localisation *</label>
                                            <select
                                                value={form.localisation_id}
                                                onChange={(e) => setForm({ ...form, localisation_id: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400"
                                            >
                                                <option value="">Sélectionner une localisation</option>
                                                {localisations.map((loc) => (
                                                    <option key={loc.id} value={loc.id}>{loc.libelle}</option>
                                                ))}
                                            </select>
                                            {errors.localisation_id && <p className="text-xs text-red-500 mt-1">{errors.localisation_id[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Organisateur *</label>
                                            <select
                                                value={form.organisateur_id}
                                                onChange={(e) => setForm({ ...form, organisateur_id: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400"
                                            >
                                                <option value="">Sélectionner un organisateur</option>
                                                {organisateurs.map((org) => (
                                                    <option key={org.id} value={org.id}>{org.nom}</option>
                                                ))}
                                            </select>
                                            {errors.organisateur_id && <p className="text-xs text-red-500 mt-1">{errors.organisateur_id[0]}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Capacité max</label>
                                            <input
                                                type="number"
                                                value={form.capacite_max}
                                                onChange={(e) => setForm({ ...form, capacite_max: e.target.value })}
                                                placeholder="Ex: 200"
                                                min={1}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            />
                                            {errors.capacite_max && <p className="text-xs text-red-500 mt-1">{errors.capacite_max[0]}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Enregistrement...' : isEdit ? "Modifier l'événement" : "Créer l'événement"}
                                    </button>
                                    <Link
                                        to="/admin/evenements"
                                        className="w-full py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-underline text-center"
                                    >
                                        Annuler
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}