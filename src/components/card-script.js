useEffect(() => {
  const carrusel = document.getElementById('carrusel');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');

  let index = 0;
  const slides = carrusel.children;
  const total = slides.length;
  const visibleSlides = 3; // cuántas imágenes se ven a la vez
  const movePercent = 100 / visibleSlides; // cuánto se mueve por click

  function showSlide() {
    // si el carrusel llega al final, se detiene justo donde termina la última imagen visible
    const maxIndex = total - visibleSlides;
    const clampedIndex = Math.min(index, maxIndex);
    carrusel.style.transform = `translateX(-${clampedIndex * movePercent}%)`;
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
