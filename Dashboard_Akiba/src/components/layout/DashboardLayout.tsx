import { Outlet } from "react-router";
import NavBar from "../NavBar";
import CurrencyFab from "../CurrencyFab";
import { CurrencyProvider } from "../../context/CurrencyContext";

export default function DashboardLayout() {
  return (
    <CurrencyProvider>
      <section className="flex flex-col p-0 m-0 overflow-hidden">
        <NavBar />
        <article className="flex-1 p-4 overflow-x-hidden overflow-y-auto h-screen">
          <Outlet />
        </article>
        <CurrencyFab />
      </section>
    </CurrencyProvider>
  );
}

