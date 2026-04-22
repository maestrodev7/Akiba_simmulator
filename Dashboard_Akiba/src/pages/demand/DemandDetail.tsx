import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getRecap } from "../../services/recapService.ts";
import type { RecapData } from "../../types/recap.ts";

const DetailField = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
    <div className="space-y-1.5 w-full">
        <p className="text-sm font-bold text-[#001D21]">{label}</p>
        <div className="bg-[#F5F5FA] px-4 py-3.5 rounded-md min-h-[50px] flex items-center">
            <span className="text-sm text-[#344648]">{value || "Non renseigné"}</span>
        </div>
    </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-lg font-bold text-[#344648] mb-6">{children}</h2>
);

export default function DemandDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [data, setData] = useState<RecapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await getRecap(id);
                if (response.success) {
                    setData(response.data);
                } else {
                    setError("Impossible de charger les détails.");
                }
            } catch (err) {
                console.error("Error fetching detail:", err);
                setError("Une erreur est survenue lors du chargement des détails.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-[#BB7A44]" size={48} />
                <p className="text-[#8181A5] font-medium">Chargement des détails...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex flex-col items-center justify-center gap-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl w-full">
                    <p className="text-red-700">{error || "Détails non trouvés."}</p>
                </div>
                <button 
                    onClick={() => navigate("/demand")}
                    className="flex items-center gap-2 text-[#BB7A44] hover:underline"
                >
                    <ArrowLeft size={18} /> Retour à la liste
                </button>
            </div>
        );
    }

    return (
        <section className="p-6 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/demand")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-[#344648]" />
                </button>
                <h1 className="text-2xl font-bold text-[#000000]">
                    Détails du Draft: {data.produit.id}
                </h1>
            </div>

            {/* Section: Informations du Client */}
            <div className="space-y-6">
                <SectionTitle>Informations personnelles</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailField label="Nom(s)" value={data.client.nom} />
                    <DetailField label="Prénom(s)" value={data.client.prenom} />
                    <DetailField label="E-mail" value={data.client.email} />
                    <DetailField label="Numéro de téléphone" value={data.client.telephone} />
                    <DetailField label="Adresse" value={data.client.adresse} />
                    <DetailField label="N° Registre" value={data.client.numero_registre} />
                </div>
            </div>

            {/* Section: Identification du Terrain */}
            <div className="space-y-6 pt-4">
                <SectionTitle>Identification du Terrain</SectionTitle>
                <div className="space-y-6">
                    <DetailField
                        label="Localisation"
                        value={data.terrain.adresse}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailField
                            label="Superficie"
                            value={data.terrain.superficie ? `${data.terrain.superficie} m²` : ""}
                        />
                        <DetailField label="Titre foncier" value={data.terrain.titre_foncier} />
                        <DetailField label="Site" value={data.terrain.site} />
                        <DetailField label="Situation" value={data.terrain.situation} />
                        <DetailField label="Topographie" value={data.terrain.topographie} />
                    </div>
                </div>
            </div>

            {/* Section: Détails du Produit */}
            <div className="space-y-6 pt-4">
                <SectionTitle>Détails du Produit et Projet</SectionTitle>
                <div className="space-y-6">
                    <DetailField
                        label="Budget prévisionnel"
                        value={data.produit.budget_previsionnel ? `${data.produit.budget_previsionnel.toLocaleString()} FCFA` : ""}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailField label="Type de produit" value={data.produit.type_produit} />
                        <DetailField label="Matériaux" value={data.produit.materiaux} />
                        <DetailField label="Date début travaux" value={data.produit.date_debut_travaux} />
                        <DetailField label="Date fin travaux" value={data.produit.date_fin_travaux} />
                    </div>
                </div>
            </div>

            {/* Section: Caractéristiques Techniques */}
            <div className="space-y-6 pt-4">
                <SectionTitle>Caractéristiques Techniques</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(data.produit.caracteristiques).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-[#8181A5] uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(value) ? value.map((v, i) => (
                                    <span key={i} className="bg-[#F5F5FA] px-3 py-1 rounded text-sm text-[#344648]">{v}</span>
                                )) : <span className="bg-[#F5F5FA] px-3 py-1 rounded text-sm text-[#344648]">{value}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-10 flex justify-end gap-4 border-t border-gray-100">
                <button className="px-6 py-2.5 rounded-md border border-[#BB7A44] text-[#BB7A44] font-medium hover:bg-[#BB7A44]/5 transition-colors">
                    Refuser
                </button>
                <button className="px-6 py-2.5 rounded-md bg-[#BB7A44] text-white font-medium hover:bg-[#a16b43] transition-colors shadow-sm">
                    Accepter la demande
                </button>
            </div>
        </section>
    );
}
