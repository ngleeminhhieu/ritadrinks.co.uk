export default function NewsSliderModule() {
  const slider = document.querySelector(".newsSliderJS");

  if (!slider || typeof window.Swiper !== "function") {
    return;
  }

  new window.Swiper(slider, {
    slidesPerView: 1.15,
    spaceBetween: 16,
    speed: 600,
    rewind: true,
    grabCursor: true,
    watchOverflow: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous articles",
      nextSlideMessage: "Next articles",
    },
    breakpoints: {
      681: { slidesPerView: 2, spaceBetween: 24 },
      1121: { slidesPerView: 3, spaceBetween: 28 },
      1601: { slidesPerView: 3, spaceBetween: 37 },
    },
  });
}
