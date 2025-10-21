import { NavLink, Link } from 'react-router-dom';
import Logo from "../assets/Logo.png";

function Navbar() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4">
      <NavLink to="/" className="flex items-center font-bold">
        <img src={Logo} alt="Hospital veterinario" className="h-20 w-auto -ml-2" />
      </NavLink>

      <nav className="flex gap-6">
        <NavLink to="/" className="text-sm hover:text-stone-400">Inicio</NavLink>
        <a href="#about" className="text-sm hover:text-stone-400">Nosotros</a>
        <a href="#services" className="text-sm hover:text-stone-400">Servicios</a>
        <NavLink to="/products" className="text-sm hover:text-stone-400">Productos</NavLink>
        <a href="#contact" className="text-sm hover:text-stone-400">Contacto</a>
      </nav>

      <Link to="/login" className="border rounded-4xl px-5 py-4 text-white text-sm bg-[var(--color-principal-500)] hover:bg-[var(--color-principal-100)] transition whitespace-nowrap">
        Iniciar sesión
      </Link>
    </header>
  );
}

export default Navbar;
