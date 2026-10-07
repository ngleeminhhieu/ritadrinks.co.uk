export default function ProductRelatedModule() {
  const sliders = [...document.querySelectorAll(".productRelatedSliderJS")];
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
          slidesPerView: 6,
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "المنتج السابق",
        nextSlideMessage: "المنتج التالي",
        firstSlideMessage: "هذا هو المنتج الأول",
        lastSlideMessage: "هذا هو المنتج الأخير",
        slideLabelMessage: "{{index}} من {{slidesLength}}",
      },
    });
  });
}
