export default function StoryGalleryModule() {
  const slider = document.querySelector(".storySliderJS");
  if (!slider || typeof window.Swiper !== "function") return;

  new window.Swiper(slider, {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 0,
    loop: true,
    speed: 700,
    grabCursor: true,
    watchOverflow: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 1.8,
      },
      1201: {
        slidesPerView: 3,
      },
    },
  });
}
