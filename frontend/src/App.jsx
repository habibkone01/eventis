import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages publiques
import Accueil from './pages/public/Accueil'
import Catalogue from './pages/public/Catalogue'
import DetailEvenement from './pages/public/DetailEvenement'
import Desinscription from './pages/public/Desinscription'
import Contact from './pages/public/Contact'

// Pages admin
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Evenements from './pages/admin/Evenements'
import EvenementForm from './pages/admin/EvenementForm'
import EvenementDetail from './pages/admin/EvenementDetail'
import Categories from './pages/admin/Categories'
import CategorieForm from './pages/admin/CategorieForm'
import Localisations from './pages/admin/Localisations'
import LocalisationForm from './pages/admin/LocalisationForm'
import Organisateurs from './pages/admin/Organisateurs'
import OrganisateurForm from './pages/admin/OrganisateurForm'
import Inscriptions from './pages/admin/Inscriptions'
import InscriptionDetail from './pages/admin/InscriptionDetail'

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Accueil />} />
                    <Route path="/evenements" element={<Catalogue />} />
                    <Route path="/evenements/:id" element={<DetailEvenement />} />
                    <Route path="/desinscription/:token" element={<Desinscription />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Auth */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Routes admin protégées */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin/evenements" element={<ProtectedRoute><Evenements /></ProtectedRoute>} />
                    <Route path="/admin/evenements/creer" element={<ProtectedRoute><EvenementForm /></ProtectedRoute>} />
                    <Route path="/admin/evenements/:id" element={<ProtectedRoute><EvenementDetail /></ProtectedRoute>} />
                    <Route path="/admin/evenements/:id/modifier" element={<ProtectedRoute><EvenementForm /></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                    <Route path="/admin/categories/creer" element={<ProtectedRoute><CategorieForm /></ProtectedRoute>} />
                    <Route path="/admin/categories/:id/modifier" element={<ProtectedRoute><CategorieForm /></ProtectedRoute>} />
                    <Route path="/admin/localisations" element={<ProtectedRoute><Localisations /></ProtectedRoute>} />
                    <Route path="/admin/localisations/creer" element={<ProtectedRoute><LocalisationForm /></ProtectedRoute>} />
                    <Route path="/admin/localisations/:id/modifier" element={<ProtectedRoute><LocalisationForm /></ProtectedRoute>} />
                    <Route path="/admin/organisateurs" element={<ProtectedRoute><Organisateurs /></ProtectedRoute>} />
                    <Route path="/admin/organisateurs/creer" element={<ProtectedRoute><OrganisateurForm /></ProtectedRoute>} />
                    <Route path="/admin/organisateurs/:id/modifier" element={<ProtectedRoute><OrganisateurForm /></ProtectedRoute>} />
                    <Route path="/admin/inscriptions" element={<ProtectedRoute><Inscriptions /></ProtectedRoute>} />
                    <Route path="/admin/inscriptions/:id" element={<ProtectedRoute><InscriptionDetail /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}