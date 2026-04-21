import { Outlet } from "react-router";
import NavBar from "../NavBar";

export default function DashboardLayout() {
  return (
    <section className="flex flex-col p-0 m-0 overflow-hidden">
      <NavBar />
      <article className="flex-1 p-4 overflow-x-hidden overflow-y-auto h-screen">
        <Outlet />
      </article>
    </section>
  )
}

