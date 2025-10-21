import { useEffect } from 'react'
import img1 from "../assets/Card-inicio-1.png"
import img2 from "../assets/Card-inicio-2.png"
import img3 from "../assets/Card-inicio-3.png"
import img4 from "../assets/Card-inicio-4.png"
import img5 from "../assets/Card-inicio-5.png"
import img6 from "../assets/Card-inicio-6.png"
import img7 from "../assets/Card-inicio-7.png"
import img8 from "../assets/Card-inicio-8.png"
import img9 from "../assets/Card-inicio-9.png"


function CardHome() {
  useEffect(() => {

    const carrusel = document.getElementById('carrusel');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    let index = 0;
    const slides = carrusel.children;
    const total = slides.length;

    function showSlide() {
      carrusel.style.transform = `translateX(-${index * 100}%)`;
    }

    next.addEventListener('click', () => {
      index = (index + 1) % total;
      showSlide();
    });

    prev.addEventListener('click', () => {
      index = (index - 1 + total) % total;
      showSlide();
    });

    const interval = setInterval(() => {
      index = (index + 1) % total;
      showSlide();
    }, 5000);

    return () => {
      clearInterval(interval);
      next.removeEventListener('click', showSlide);
      prev.removeEventListener('click', showSlide);
    };
  }, []);

  return (
    <div className="relative mx-auto overflow-hidden shadow-lg max-w-[900px] h-[313px] rounded-2xl">
      <div id="carrusel" className="flex gap-3 transition-transform duration-700 ease-in-out rounded-2xl">
        <img src={img1} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 1" />
        <img src={img2} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 2" />
        <img src={img3} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 3" />
        <img src={img4} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 4" />
        <img src={img5} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 5" />
        <img src={img6} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 6" />
        <img src={img7} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 7" />
        <img src={img8} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 8" />
        <img src={img9} className="w-1/3 h-full object-cover flex-shrink-0 rounded-2xl" alt="Carrusel img 9" />
      </div>

      <button id="prev" className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-r-md z-10">
        &lt;
      </button>
      <button id="next" className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-l-md z-10">
        &gt;
      </button>
    </div>

  );
}

export default CardHome;
