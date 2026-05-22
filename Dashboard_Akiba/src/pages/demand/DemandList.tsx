import inbox from "../../assets/incoming_demand.svg"
import check from "../../assets/black_accept_demand.svg"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router";
import { getClients } from "../../services/clientService.ts";
import { getPaymentAmount, updatePaymentAmount } from "../../services/paymentService.ts";
import type { Client } from "../../types/client.ts";
import { formatDate } from "../../utils/dateUtils.ts";
import { useCurrency } from "../../context/CurrencyContext.tsx";


type Filter = "all" | "paid " | "unpaid"

interface Column {
  header: string;
  render: (item: Client) => React.ReactNode;
  minWidth?: string;
}

export default function DemandList() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("all")
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fromXaf, toXaf, currency } = useCurrency();
  const [amountXaf, setAmountXaf] = useState<number>(0);
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingAmount, setIsUpdatingAmount] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClients(filter);
        console.log("response", response);
        if (response.success) {
          setClients(response.data);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [filter]);

  useEffect(() => {
    const fetchPaymentAmount = async () => {
      try {
        const response = await getPaymentAmount();
        if (response.success) {
          const xaf = response.data.amount;
          setAmountXaf(xaf);
          setDisplayAmount(fromXaf(xaf));
        }
      } catch (err) {
        console.error("Error fetching payment amount:", err);
      }
    };
    fetchPaymentAmount();
  }, []);

  useEffect(() => {
    setDisplayAmount(fromXaf(amountXaf));
  }, [currency, amountXaf, fromXaf]);

  const handleFilter = (filter: Filter) => {
    setFilter(filter)
  }

  const handleUpdateAmount = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsUpdatingAmount(true);
    try {
      const xafToSave = toXaf(displayAmount);
      const response = await updatePaymentAmount(xafToSave);
      if (response.success) {
        const saved = response.data.amount;
        setAmountXaf(saved);
        setDisplayAmount(fromXaf(saved));
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating payment amount:", err);
    } finally {
      setIsUpdatingAmount(false);
    }
  };

  const columns: Column[] = [
    {
      header: "Id",
      render: (client) => <span className="text-base text-[#344054] font-medium">{client.id}</span>,
      minWidth: "120px"
    },
    {
      header: "Nom du client",
      render: (client) => <span className="text-base text-[#344054]">{client.nom} {client.prenom}</span>,
      minWidth: "250px"
    },
    {
      header: "Email",
      render: (client) => <span className="text-base text-[#344054]">{client.email}</span>,
      minWidth: "250px"
    },
    {
      header: "Téléphone",
      render: (client) => <span className="text-base text-[#344054]">{client.telephone}</span>,
      minWidth: "150px"
    },
    {
      header: "Statut du payement",
      render: (client) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${client.simulation_payment_status === "paid"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
          {/* <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${client.simulation_payment_status === "paid" ? "bg-emerald-500" : "bg-rose-500"
            }`} /> */}
          {client.simulation_payment_status === "paid" ? "Payé" : "Non payé"}
        </span>
      ),
      minWidth: "175px"
    },
    {
      header: "Date de payement",
      render: (client) => (
        <span className="text-base text-[#344054]">
          {formatDate(client.simulation_paid_at)}
        </span>
      ),
      minWidth: "170px"
    },
    {
      header: "",
      render: (client) => (
        <button
          className="bg-[#F2F2F7] text-[#344054] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#BB7A44] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          onClick={() => navigate(`/demand/${client.id}`)}
        >
          Consulter
        </button>
      ),
      minWidth: "120px"
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4">
        <h1 className="text-3xl font-semibold text-[#000000]">Liste des Clients</h1>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap w-full sm:w-max p-1 bg-[#F5F5FA] rounded-[1.5rem] min-[390px]:rounded-full gap-1 min-[390px]:gap-0">
            <button
              className={`w-full min-[390px]:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer py-3 px-4 sm:px-6 rounded-[1.2rem] min-[390px]:rounded-full ${filter === "all" ? "bg-[#BB7A44] text-white shadow-sm" : "text-[#8181A5] hover:text-[#BB7A44]"}`}
              onClick={() => handleFilter("all")}
            >
              <img
                src={inbox}
                width={20}
                height={20}
                alt="inbox"
                className={`transition-all duration-300 ${filter === "all" ? "" : "brightness-0 opacity-40 hover:opacity-100"}`}
              />
              <span className="font-medium whitespace-nowrap">Tout</span>
            </button>

            <button
              className={`w-full min-[390px]:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer py-3 px-4 sm:px-6 rounded-[1.2rem] min-[390px]:rounded-full ${filter === "paid " ? "bg-[#BB7A44] text-white shadow-sm" : "text-[#8181A5] hover:text-[#BB7A44]"}`}
              onClick={() => handleFilter("paid ")}
            >
              <img
                src={check}
                width={20}
                height={20}
                alt="check"
                className={`transition-all duration-300 ${filter === "paid " ? "brightness-0 invert" : "opacity-40 hover:opacity-100"}`}
              />
              <span className="font-medium whitespace-nowrap">Demande Payé</span>
            </button>

            <button
              className={`w-full min-[390px]:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer py-3 px-4 sm:px-6 rounded-[1.2rem] min-[390px]:rounded-full ${filter === "unpaid" ? "bg-[#BB7A44] text-white shadow-sm" : "text-[#8181A5] hover:text-[#BB7A44]"}`}
              onClick={() => handleFilter("unpaid")}
            >
              <span className="font-medium whitespace-nowrap">Demande non Payé</span>
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white p-1.5 px-4 rounded-full border border-[#F5F5FA] shadow-sm">
            <span className="text-sm font-medium text-[#667085]">Cout de la simulation:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={displayAmount}
                onChange={(e) => setDisplayAmount(Number(e.target.value))}
                disabled={!isEditing}
                className={`w-28 px-3 py-1.5 rounded-full border transition-all duration-300 text-sm font-bold outline-none text-center ${isEditing
                    ? "border-[#BB7A44] bg-white ring-4 ring-[#BB7A44]/10 text-[#BB7A44]"
                    : "border-transparent bg-transparent text-[#344054] cursor-not-allowed"
                  }`}
              />
            </div>
            <button
              onClick={handleUpdateAmount}
              disabled={isUpdatingAmount}
              className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 ${isEditing
                  ? "bg-[#BB7A44] text-white hover:bg-[#A3693A] hover:shadow-md"
                  : "bg-[#F2F2F7] text-[#344054] hover:bg-[#BB7A44] hover:text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUpdatingAmount ? (
                <>
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ...
                </>
              ) : isEditing ? (
                "Enregistrer"
              ) : (
                "Modifier"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#F5F5FA] shadow-lg bg-white">
        <div className="overflow-x-auto h-[75vh] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="bg-[#BB7A44] text-white sticky top-0 z-10 shadow-sm">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="py-4 px-6 text-left font-semibold text-sm first:rounded-tl-2xl last:rounded-tr-2xl"
                    style={column.minWidth ? { minWidth: column.minWidth } : {}}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5FA]">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center text-[#8181A5]">
                    Chargement en cours...
                  </td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                    {columns.map((column, index) => (
                      <td key={index} className="py-3 px-6 text-sm text-[#344054]">
                        {column.render(client)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-20 text-center text-[#8181A5] italic">
                    Aucune donnée enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
