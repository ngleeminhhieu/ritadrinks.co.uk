export default function AnnouncementModule() {
  const slider = document.querySelector(".announcementSliderJS");

  if (!slider || typeof window.Swiper !== "function") {
    return;
  }

  const announcement = slider.closest(".announcement");
  const slideCount = slider.querySelectorAll(".swiper-slide").length;

  const syncLinks = (swiper) => {
    swiper.slides.forEach((slide, index) => {
      const active = index === swiper.activeIndex;
      slide.setAttribute("aria-hidden", String(!active));
      slide.querySelectorAll("a").forEach((link) => {
        link.tabIndex = active ? 0 : -1;
      });
    });
  };

  const swiper = new window.Swiper(slider, {
    slidesPerView: 1,
    speed: 500,
    rewind: slideCount > 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: slideCount > 1
      ? {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      : false,
    navigation: {
      prevEl: announcement?.querySelector(".announcementPrevJS"),
      nextEl: announcement?.querySelector(".announcementNextJS"),
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous announcement",
      nextSlideMessage: "Next announcement",
    },
    on: {
      afterInit: syncLinks,
      slideChange: syncLinks,
    },
  });

  slider.addEventListener("focusin", () => swiper.autoplay?.stop());
  slider.addEventListener("focusout", (event) => {
    if (slideCount > 1 && !slider.contains(event.relatedTarget)) swiper.autoplay?.start();
  });
}
