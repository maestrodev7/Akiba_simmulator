import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { ProjectData } from "../../types/demandType";

const DetailField = ({ label, value }: { label: string; value: string | number | undefined }) => (
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

    // Mock data based on the screenshot and interfaces
    const mockData: ProjectData = {
        stepOne: {
            step: 1,
            data: {
                nom: "Mvondo",
                prenom: "Arthur",
                email: "mvondondongoarthur@gmail.com",
                telephone: "695 84 73 62",
                adresse: "Yaoundé, Eleveur",
                numero_registre: "REG-12345"
            }
        },
        stepTwo: {
            step: 2,
            client_id: "CLI-001",
            data: {
                budget_previsionnel: 50000000,
                adresse: "Yaoundé, Eleveur, entrée pont",
                superficie: 10500,
                statut_juridique: ["Propriété"],
                etat_du_site: ["Viabilisé"],
                topographie: ["Plat"],
                situation: ["Urbain"],
                voie_existante: ["Goudronnée"],
                documents_fournis: ["Titre foncier"],
                type_produit: "Villa",
                nature_travaux: ["Construction neuve"],
                type_construction: ["Béton"],
                type_architecture: ["Moderne"],
                materiaux: ["Briques", "Verre"],
                style_construction: ["Épuré"],
                espace_annexe: ["Piscine", "Garage"],
                nombre_etages: 1,
                nombre_sous_sol: 0,
                type_toiture: ["Dalle"],
                habillage_facade: ["Peinture"],
                menuiserie: ["Aluminium"],
                securisation_ouvertures: ["Barreaudage"]
            }
        }
    };

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
                    Demande N°: {id || "DE-CA-AU-20250630162023450002"}
                </h1>
            </div>

            {/* Section: Informations personnelles */}
            <div className="space-y-6">
                <SectionTitle>Informations personnelles</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailField label="Nom(s)" value={mockData.stepOne?.data.nom} />
                    <DetailField label="Prénom(s)" value={mockData.stepOne?.data.prenom} />
                    <DetailField label="E-mail" value={mockData.stepOne?.data.email} />
                    <DetailField label="Numéro de téléphone" value={mockData.stepOne?.data.telephone} />
                </div>
            </div>

            {/* Section: Identification du Terrain */}
            <div className="space-y-6 pt-4">
                <SectionTitle>Identification du Terrain</SectionTitle>
                <div className="space-y-6">
                    <DetailField
                        label="Budget"
                        value={mockData.stepTwo?.data.budget_previsionnel ? `${mockData.stepTwo.data.budget_previsionnel.toLocaleString()} Fcfa` : ""}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailField label="Localisation" value={mockData.stepTwo?.data.adresse} />
                        <DetailField
                            label="Superficie"
                            value={mockData.stepTwo?.data.superficie ? `${mockData.stepTwo.data.superficie} m²` : ""}
                        />
                    </div>
                </div>
            </div>

            {/* Actions (Optional but good for UX) */}
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
