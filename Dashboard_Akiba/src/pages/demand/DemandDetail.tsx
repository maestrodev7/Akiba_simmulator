import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProduits, getRecap, getTerrain } from "../../services/recapService.ts";
import type { RecapData } from "../../types/recap.ts";
import { useCurrency } from "../../context/CurrencyContext.tsx";
import { formatSuperficie, fromSquareMeters, type SuperficieUnite } from "../../lib/area.ts";

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

    const [data, setData] = useState<RecapData[] | null>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { formatBudget } = useCurrency();

    const formatTerrainSuperficie = (m2: number | undefined | null, unite?: string) => {
        if (m2 == null) return "";
        const unit: SuperficieUnite = unite === "ha" ? "ha" : "m2";
        return formatSuperficie(fromSquareMeters(m2, unit), unit);
    };

    async function getTerrainByIdClient(id: string) {
        try {
            const res = await getTerrain(id);
            console.log("Terrain", res.data.data);
            return res.data.data;
        } catch {
            setError("Impossible de récupérer les données du terrain.");
        }
    }

    async function getProduitByIdTerrain(idClient: string, idTerrain: string) {
        try {
            const res = await getProduits(idClient, idTerrain);
            console.log("Produit", res.data.data);
            return res.data.data;
        } catch {
            setError("Impossible de récupérer les données du produit.");
        }
    }


    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const Terrain = await getTerrainByIdClient(id)
                console.log("Terrain voici", Terrain);

                const dataProduit: RecapData[] = []

                if (Array.isArray(Terrain)) {
                    await Promise.all(Terrain.map(async (terrainItem: any) => {
                        const Produit = await getProduitByIdTerrain(id, terrainItem.id)
                        console.log("Produit", Produit);

                        if (Array.isArray(Produit)) {
                            await Promise.all(Produit.map(async (produitItem: any) => {
                                try {
                                    const response = await getRecap(produitItem.id);
                                    if (response && response.data) {
                                        dataProduit.push(response.data);
                                        console.log("Response", response.data);
                                    }
                                } catch (err) {
                                    console.error("Error fetching recap for produit", produitItem.id, err);
                                }
                            }));
                        }
                    }));
                }
                setData(dataProduit);

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

    if (error || !data || data.length === 0) {
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
        <section className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/demand")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-[#344648]" />
                </button>
                <h1 className="text-2xl font-bold text-[#000000]">
                    Détails du Client
                </h1>
            </div>

            <div className="space-y-16">
                {data.map((item, index) => (
                    <div key={item.produit?.id || index} className="space-y-10 pb-10 border-b border-gray-200 last:border-0">
                        {/* <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-[#BB7A44]">
                                Draft: {item.produit?.id || "N/A"}
                            </h2>
                        </div> */}

                        {/* Section: Informations du Client */}
                        <div className="space-y-6">
                            <SectionTitle>Informations personnelles</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <DetailField label="Nom(s)" value={item.client?.nom} />
                                <DetailField label="Prénom(s)" value={item.client?.prenom} />
                                <DetailField label="E-mail" value={item.client?.email} />
                                <DetailField label="Numéro de téléphone" value={item.client?.telephone} />
                                <DetailField label="Adresse" value={item.client?.adresse} />
                                <DetailField label="N° Registre" value={item.client?.numero_registre} />
                            </div>
                        </div>

                        {/* Section: Identification du Terrain */}
                        <div className="space-y-6 pt-4">
                            <SectionTitle>Identification du Terrain</SectionTitle>
                            <div className="space-y-6">
                                <DetailField
                                    label="Localisation"
                                    value={item.terrain?.adresse}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <DetailField
                                        label="Superficie"
                                        value={formatTerrainSuperficie(
                                            item.terrain?.superficie,
                                            item.terrain?.superficie_unite
                                        )}
                                    />
                                    <DetailField label="Titre foncier" value={item.terrain?.titre_foncier} />
                                    <DetailField label="Site" value={item.terrain?.site} />
                                    <DetailField label="Situation" value={item.terrain?.situation} />
                                    <DetailField label="Topographie" value={item.terrain?.topographie} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Détails du Produit */}
                        <div className="space-y-6 pt-4">
                            <SectionTitle>Détails du Produit et Projet</SectionTitle>
                            <div className="space-y-6">
                                <DetailField
                                    label="Budget prévisionnel"
                                    value={formatBudget(item.produit?.budget_previsionnel)}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <DetailField label="Type de produit" value={item.produit?.type_produit} />
                                    <DetailField label="Matériaux" value={item.produit?.materiaux} />
                                    <DetailField label="Date début travaux" value={item.produit?.date_debut_travaux} />
                                    <DetailField label="Date fin travaux" value={item.produit?.date_fin_travaux} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Caractéristiques Techniques */}
                        <div className="space-y-6 pt-4">
                            <SectionTitle>Caractéristiques Techniques</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {Object.entries(item.produit?.caracteristiques || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-[#8181A5] uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(value) ? value.map((v, i) => (
                                                <span key={i} className="bg-[#F5F5FA] px-3 py-1 rounded text-sm text-[#344648]">{String(v)}</span>
                                            )) : <span className="bg-[#F5F5FA] px-3 py-1 rounded text-sm text-[#344648]">{String(value)}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        {/* <div className="pt-10 flex justify-end gap-4 border-t border-gray-100">
                            <button className="px-6 py-2.5 rounded-md border border-[#BB7A44] text-[#BB7A44] font-medium hover:bg-[#BB7A44]/5 transition-colors">
                                Refuser
                            </button>
                            <button className="px-6 py-2.5 rounded-md bg-[#BB7A44] text-white font-medium hover:bg-[#a16b43] transition-colors shadow-sm">
                                Accepter la demande
                            </button>
                        </div> */}
                    </div>
                ))}
            </div>
        </section>
    );
}
