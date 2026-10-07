export default function AwardsModule() {
  const slider = document.querySelector(".awardsSliderJS");

  if (!slider || typeof window.Swiper !== "function") return;

  new window.Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    speed: 700,
    loop: true,
    loopedSlides: slider.querySelectorAll(".swiper-slide").length,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous award",
      nextSlideMessage: "Next award",
    },
    breakpoints: {
      681: { spaceBetween: 24, centeredSlides: false },
      1601: { spaceBetween: 33 },
    },
  });
}
