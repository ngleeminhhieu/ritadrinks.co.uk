export default function ActivitiesModule() {
  const sliders = [...document.querySelectorAll(".activitiesSliderJS")];
  if (!sliders.length || typeof window.Swiper !== "function") return;

  sliders.forEach((slider) => {
    const slideCount = slider.querySelectorAll(".swiper-slide").length;

    new window.Swiper(slider, {
      slidesPerView: 2,
      spaceBetween: 0,
      loop: slideCount >= 12,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 4,
        },
        1201: {
          slidesPerView: 6,
        },
      },
    });
  });
}
