import logo from "../assets/logo.svg"

export default function NavBar() {
  return (
    <nav className="w-full px-4 py-2">
      <div>
        <img src={logo} width={50} height={50} alt="logo AKIBA" />
      </div>
    </nav>
  )
}

