import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import logoFondNoir from '../assets/logofondnoir.png'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <img src={logoFondNoir} alt="Éventis" className="h-6 w-auto mb-4" />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            La plateforme de référence pour découvrir et s'inscrire aux événements locaux d'Abidjan et de Côte d'Ivoire.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                            Navigation
                        </div>
                        <div className="space-y-3">
                            <Link to="/" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Accueil</Link>
                            <Link to="/evenements" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Événements</Link>
                            <Link to="/contact" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Contact</Link>
                        </div>
                    </div>

                    {/* Catégories */}
                    <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                            Catégories
                        </div>
                        <div className="space-y-3">
                            <Link to="/evenements?categorie=musique" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Musique</Link>
                            <Link to="/evenements?categorie=culture" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Culture</Link>
                            <Link to="/evenements?categorie=sport" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Sport</Link>
                            <Link to="/evenements?categorie=business" className="block text-sm text-gray-400 hover:text-white no-underline transition-colors">Business</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
                            Contact
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail size={14} className="text-red-500 shrink-0" />
                                contact@eventis.ci
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone size={14} className="text-red-500 shrink-0" />
                                +225 07 00 00 00
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin size={14} className="text-red-500 shrink-0" />
                                Abidjan, Côte d'Ivoire
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © 2026 <span className="text-red-500">Éventis</span> — Tous droits réservés
                    </p>
                </div>
            </div>
        </footer>
    )
}