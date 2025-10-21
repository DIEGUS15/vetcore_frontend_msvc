import Logo from "../assets/Logo.png";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="gradiente text-gray-200 px-10 md:px-20 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-500">

        <div className="flex flex-col items-start">
          <img src={Logo} alt="Logo Hospital Veterinario" className="w-30 mb-3" />
          <p className="mb-3">Cuidamos con amor a tus mejores amigos</p>
          <p className="mb-3">Síguenos en redes sociales</p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition-colors"><FaWhatsapp /></a>
            <a href="#" className="hover:text-white transition-colors"><FaTiktok /></a>
          </div>
        </div>

        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Contáctanos</h2>
          <p>Calle 11 Av 3 Nuevo Horizonte,</p>
          <p className="mb-2">Cúcuta, Colombia</p>
          <p className="mb-1">hospitalveterinario@gmail.com</p>
          <p className="mb-4">+57 305 9360814</p>
          <div className="flex border border-gray-400 rounded-md overflow-hidden max-w-xs">
            <input
              type="email"
              placeholder="Recibe novedades y tips"
              className="bg-transparent px-3 py-2 text-sm text-gray-200 focus:outline-none w-full placeholder-gray-400"
            />
            <button className="px-3 hover:bg-[var(--color-secundario-100)] transition-colors">
              ➤
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Nuestros servicios</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Consulta general</a></li>
            <li><a href="#" className="hover:text-white">Vacunación</a></li>
            <li><a href="#" className="hover:text-white">Cirugías</a></li>
            <li><a href="#" className="hover:text-white">Estética y baño</a></li>
            <li><a href="#" className="hover:text-white">Control de parásitos</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Enlaces útiles</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Política de privacidad</a></li>
            <li><a href="#" className="hover:text-white">Términos y condiciones</a></li>
            <li><a href="#" className="hover:text-white">Preguntas frecuentes</a></li>
            <li><a href="#" className="hover:text-white">Agenda tu cita</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm pt-6">
        © 2025 Hospital Veterinario. Todos los derechos reservados
      </div>
    </footer>
  );
}
