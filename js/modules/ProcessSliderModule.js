export default function ProcessSliderModule() {
  const sliders = [...document.querySelectorAll(".processSliderJS")];
  if (!sliders.length || typeof window.Swiper !== "function") return;

  sliders.forEach((slider) => {
    new window.Swiper(slider, {
      slidesPerView: 2,
      spaceBetween: 0,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 4,
        },
        1201: {
          slidesPerView: 5,
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "گام قبلی",
        nextSlideMessage: "گام بعدی",
        firstSlideMessage: "این نخستین گام است",
        lastSlideMessage: "این آخرین گام است",
        slideLabelMessage: "{{index}} از {{slidesLength}}",
      },
    });
  });
}
