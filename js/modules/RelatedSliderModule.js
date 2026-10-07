export default function RelatedSliderModule() {
  if (typeof window.Swiper !== "function") return;

  document.querySelectorAll(".relatedSliderJS").forEach((slider) => {
    const section = slider.closest("section") || document;
    const style = getComputedStyle(slider);
    const read = (name, fallback) => Number(style.getPropertyValue(name)) || fallback;

    new window.Swiper(slider, {
      slidesPerView: read("--pv-mobile", 2),
      spaceBetween: 10,
      speed: 600,
      grabCursor: true,
      watchOverflow: true,
      navigation: {
        prevEl: section.querySelector(".relatedPrevJS"),
        nextEl: section.querySelector(".relatedNextJS"),
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous items",
        nextSlideMessage: "Next items",
      },
      breakpoints: {
        681: { slidesPerView: read("--pv-tablet", 3), spaceBetween: 14 },
        1121: { slidesPerView: read("--pv-desktop", 4), spaceBetween: 20 },
        1421: { slidesPerView: read("--pv-wide", 5), spaceBetween: 24 },
      },
    });
  });
}
