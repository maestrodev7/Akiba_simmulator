import inbox from "../../assets/incoming_demand.svg"
import check from "../../assets/black_accept_demand.svg"
import { useState } from "react"
import { useNavigate } from "react-router";

type Filter = "received" | "accepted"

interface Demand {
  id: string;
  num_demande: string;
  date_creation: string;
}

interface Column {
  header: string;
  render: (item: Demand) => React.ReactNode;
  minWidth?: string;
}

export default function DemandList() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("received")

  const handleFilter = (filter: Filter) => {
    setFilter(filter)
  }

  // Données de test correspondant à la capture d'écran
  const demands: Demand[] = [
    { id: "001", num_demande: "DE-CA-AU-20250630162023450002", date_creation: "02/01/2025" },
    { id: "002", num_demande: "DE-CA-MO-20250630163455770015", date_creation: "02/01/2025" },
    { id: "003", num_demande: "DE-CA-AU-20250630162023450002", date_creation: "02/01/2025" },
    { id: "004", num_demande: "DE-CA-MO-20250630163455770015", date_creation: "02/01/2025" },
    { id: "005", num_demande: "DE-CA-AU-20250630162023450002", date_creation: "02/01/2025" },
    { id: "006", num_demande: "DE-CA-AU-20250630162023450002", date_creation: "02/01/2025" },
    { id: "007", num_demande: "DE-CA-MO-20250630163455770015", date_creation: "02/01/2025" },
    { id: "008", num_demande: "DE-CA-AU-20250630162023450002", date_creation: "02/01/2025" },
  ];

  const columns: Column[] = [
    {
      header: "Id",
      render: (demand) => <span className="text-base text-[#344054] font-medium">{demand.id}</span>,
      minWidth: "80px"
    },
    {
      header: "Numéro de demande",
      render: (demand) => <span className="text-base text-[#344054]">{demand.num_demande}</span>,
      minWidth: "300px"
    },
    {
      header: "Date de création",
      render: (demand) => <span className="text-base text-[#344054]">{demand.date_creation}</span>,
      minWidth: "200px"
    },
    {
      header: "",
      render: (demand) => (
        <button
          className="bg-[#F2F2F7] text-[#344054] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#BB7A44] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          onClick={() => navigate(`${demand.id}`)}
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
        <h1 className="text-3xl font-semibold text-[#000000]">Liste des demandes</h1>

        <div className="flex flex-wrap w-full sm:w-max p-1 bg-[#F5F5FA] rounded-[1.5rem] min-[390px]:rounded-full gap-1 min-[390px]:gap-0">
          <button
            className={`w-full min-[390px]:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer py-3 px-4 sm:px-6 rounded-[1.2rem] min-[390px]:rounded-full ${filter === "received" ? "bg-[#BB7A44] text-white shadow-sm" : "text-[#8181A5] hover:text-[#BB7A44]"}`}
            onClick={() => handleFilter("received")}
          >
            <img
              src={inbox}
              width={20}
              height={20}
              alt="inbox"
              className={`transition-all duration-300 ${filter === "received" ? "" : "brightness-0 opacity-40 hover:opacity-100"}`}
            />
            <span className="font-medium whitespace-nowrap">Demande reçues</span>
          </button>

          <button
            className={`w-full min-[390px]:w-auto flex-1 sm:flex-none flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer py-3 px-4 sm:px-6 rounded-[1.2rem] min-[390px]:rounded-full ${filter === "accepted" ? "bg-[#BB7A44] text-white shadow-sm" : "text-[#8181A5] hover:text-[#BB7A44]"}`}
            onClick={() => handleFilter("accepted")}
          >
            <img
              src={check}
              width={20}
              height={20}
              alt="check"
              className={`transition-all duration-300 ${filter === "accepted" ? "brightness-0 invert" : "opacity-40 hover:opacity-100"}`}
            />
            <span className="font-medium whitespace-nowrap">Demande acceptées</span>
          </button>
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
              {demands.length > 0 ? (
                demands.map((demand) => (
                  <tr key={demand.id} className="hover:bg-blue-50/30 transition-colors group">
                    {columns.map((column, index) => (
                      <td key={index} className="py-3 px-6 text-sm text-[#344054]">
                        {column.render(demand)}
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
