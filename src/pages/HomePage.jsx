import React from "react";
import { Link } from "react-router-dom";
import imgIndex from "../assets/Img-inicio.png";
import { FaPaw, FaUserMd, FaBath, FaSyringe, FaRegEye } from "react-icons/fa";
import { MdEmergency } from "react-icons/md";
import { IoMedicalOutline, IoBug } from "react-icons/io5";
import CardHome from "../components/Card-home"


function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center gap-10 bg-red-200 ml-10 mr-10 md:ml-15 md:mr-15 lg:ml-15 lg:mr-15 xl:ml-35 xl:mr-35">
        <section className="flex flex-col items-center text-center">
          <h1>Amor, cuidado y confianza</h1>
          <h3>Combinamos experiencia, tecnología y un trato humano para cuidar a tus mascotas como si fueran nuestras porque ellos lo merecen</h3>
          
          <Link to="/login" className="flex justify-center items-center border rounded-4xl border-0 px-6 py-4 w-auto text-white text-2xl bg-[var(--color-secundario-100)] hover:bg-[var(--color-principal-100)] whitespace-nowrap shadow-[0_0_10px_black] mb-10">
            Agenda con nosotros
          </Link>
          <div className="flex justify-center text-center align-center items-center relative border rounded-4xl border-transparent -p-10 bg-[var(--color-principal-100)] overflow-visible">
            <img className="flex justify-center text-center align-center items-center pt-15 -pl-5 -pr-5 -mb-0.5" src={imgIndex} alt="Canes de todas las razas"/>
          </div>
        </section>

        <section className="flex flex-col items-start text-start bg-green-200 w-full">
          <h2>¿Por qué escogernos?</h2>
          <h3>
            Porque entendemos que no es solo una mascota, es parte de tu vida, y su
            bienestar es importante
          </h3>

          <div className="cards-container w-full">
            <div className="simple-card">
              <FaPaw className="icon" />
              <h3>Atención personalizada</h3>
              <h4>
                Nos tomamos el tiempo de conocer a tu mascota, entender sus
                necesidades y acompañarte en cada etapa de su vida.
              </h4>
            </div>

            <div className="simple-card">
              <FaUserMd className="icon" />
              <h3>Equipo médico altamente calificado</h3>
              <h4>
                Contamos con veterinarios y técnicos con amplia experiencia y en
                constante capacitación para ofrecer diagnósticos precisos y
                tratamientos efectivos.
              </h4>
            </div>

            <div className="simple-card">
              <MdEmergency className="icon" />
              <h3>Citas flexibles y atención de urgencias</h3>
              <h4>
                Sabemos que los imprevistos ocurren, por eso ofrecemos atención las
                24 horas para esos casos de emergencia.
              </h4>
            </div>
            <div className="simple-card hidden sm:flex sm:flex-col md:hidden 2xl:flex 2xl:flex-col">
              <FaRegEye className="icon" />
              <h3>Transparencia y confianza</h3>
              <h4>
                Explicamos cada procedimiento y decisión médica para que siempre sepas qué ocurre con tu compañero peludo.
              </h4>
            </div>
          </div>
        </section>

        <section className="gradiente pt-10 pb-20 w-full">
          <h2 className="text-white">"Pasión por la salud, amor por los animales"</h2>
          <CardHome></CardHome>
        </section>

        <section className="flex flex-col items-start text-start bg-blue-200 w-full">
          <h2>Nuestros servicios</h2>

          <div className="cards-container mt-10 w-full">
            <div className="simple-card">
              <MdEmergency className="icon" />
              <h3>Urgencias veterinarias</h3>
              <h4>
                Atención inmediata las 24 horas a mascotas que requieran cuidados
                médicos de emergencia como dificultades respiratorias, partos
                complicados y cualquier otra situación crítica.
              </h4>
            </div>

            <div className="simple-card">
              <FaBath className="icon" />
              <h3>Estética y cuidado</h3>
              <h4>
                Servicios de baño, cepillado, corte de pelo y limpieza general con
                productos seguros y supervisión veterinaria. Cada sesión se adapta a
                las necesidades de la mascota.
              </h4>
            </div>
            <div className="simple-card">
              <IoBug className="icon" />
              <h3>Vacunación y control de parásitos</h3>
              <h4>
                Revisión rutinaria, vacunas obligatorias, tratamiento de pulgas, garrapatas y otros parasitos que puedan estar afectando a tu mascota
              </h4>
            </div>
            <div className="simple-card">
              <IoMedicalOutline className="icon" />
              <h3>Cirugías y ecografías</h3>
              <h4>
                Procedimientos de esterilización, extracción de tumores, cesáreas,
                cirugías digestivas, ortopédicas y más, siempre priorizando el
                bienestar y la recuperación de tu mascota.
              </h4>
            </div>

            <div className="simple-card">
              <FaSyringe className="icon" />
              <h3>Hemoclasificación</h3>
              <h4>
                La determinación del tipo de sangre es un proceso que garantiza que
                los animales se beneficien del apoyo de la transfusión sin
                reacciones adversas.
              </h4>
            </div>
          </div>
        </section>
        
        <section className="flex flex-col w-full bg-yellow-200">
          <h2>Ellos ya confiaron en nosotros</h2>
          <div>
          
          </div>
        </section>
        <section className="flex flex-row justify-center text-center w-full bg-gray-200">
          <div className="flex flex-col w-full text-center justify-center pt-10 pb-10 bg-blue-200">
            <h2>Encuentranos aquí</h2>
            <h4>Quinta Oriental Cúcuta, Norte de Santnder 54001 Calle 2N No 9E-61 Govika</h4>
            <Link to="/login" className="border rounded-4xl px-5 py-4 text-white text-sm bg-[var(--color-principal-500)] hover:bg-[var(--color-principal-100)] transition whitespace-nowrap">
              Iniciar sesión
            </Link>
            <h4>O contactanos por medio de nuestras redes sociales</h4>
          </div>
          <div className="flex items-center justify-center bg-green-300 w-full">
            ubicacion en google maps
          </div>
        </section>
    </div>
  )
}

export default HomePage;
