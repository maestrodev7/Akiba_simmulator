import { Link, useLocation } from "react-router";
import logo from "../assets/logo.svg";

export default function NavBar() {
  const location = useLocation();
  const linkClass = (path: string) =>
    `text-sm font-medium px-3 py-2 rounded-md ${
      location.pathname.startsWith(path)
        ? "bg-[#BB7A44]/10 text-[#BB7A44]"
        : "text-[#344648] hover:bg-gray-100"
    }`;

  return (
    <nav className="w-full px-4 py-2 flex items-center justify-between gap-4 border-b border-gray-100">
      <Link to="/demand">
        <img src={logo} width={50} height={50} alt="logo AKIBA" />
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/demand" className={linkClass("/demand")}>
          Demandes
        </Link>
        <Link to="/settings/payment" className={linkClass("/settings/payment")}>
          Montant simulation
        </Link>
      </div>
    </nav>
  );
}

