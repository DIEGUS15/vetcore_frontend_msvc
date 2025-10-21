import { NavLink, Link } from 'react-router-dom';
import Logo from "../assets/Logo.png";

function Nav() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4">
      <NavLink to="/" className="flex items-center font-bold">
        <img src={Logo} alt="Hospital veterinario" className="h-20 w-auto -ml-2" />
      </NavLink>

      <nav className="flex gap-6">
        <NavLink to="/" className="text-sm hover:text-stone-400">Inicio</NavLink>
        <NavLink to="/nosotros" className="text-sm hover:text-stone-400">Nosotros</NavLink>
        <NavLink to="/servicios" className="text-sm hover:text-stone-400">Servicios</NavLink>
        <NavLink to="/productos" className="text-sm hover:text-stone-400">Productos</NavLink>
        <NavLink to="/contacto" className="text-sm hover:text-stone-400">Contacto</NavLink>
      </nav>

      <Link to="/login" className="border rounded-4xl px-5 py-4 text-white text-sm bg-[var(--color-principal-500)] hover:bg-[var(--color-principal-100)] transition whitespace-nowrap">
        Iniciar sesión
      </Link>
    </header>
  );
}

export default Nav;
