import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-8">
        <h1 className="text-5xl font-semibold mt-10 sm:text-8xl">Amor, cuidado y confianza</h1>
        <h3 className="text-md sm:text-2xl mr-5 ml-5">Combinamos experiencia, tecnología y un trato humano para cuidar a tus mascotas como si fueran nuestras porque ellos lo merecen</h3>
        
        <Link to="/login" className="flex justify-center items-center border rounded-4xl border-0 px-6 py-4 text-white text-2xl bg-[var(--color-secundario-100)] hover:bg-[var(--color-principal-100)] whitespace-nowrap shadow-[0_0_10px_black]">
          Agenda con nosotros
        </Link>
    </div>
  )
}

export default HomePage;
