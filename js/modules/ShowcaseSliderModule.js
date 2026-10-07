const initCards = (slider, root, total) => {
  const isInside = (slide) => {
    const box = slider.getBoundingClientRect();
    const rect = slide.getBoundingClientRect();
    return rect.left >= box.left - 2 && rect.right <= box.right + 2;
  };

  slider.addEventListener("click", (event) => {
    const slide = event.target.closest("a.swiper-slide");
    if (!slide || isInside(slide)) return;
    event.preventDefault();
    const box = slider.getBoundingClientRect();
    if (slide.getBoundingClientRect().left < box.left) swiper.slidePrev();
    else swiper.slideNext();
  });

  const swiper = new window.Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 12,
    loop: total > 2,
    loopedSlides: total,
    speed: 700,
    grabCursor: true,
    watchSlidesProgress: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      prevEl: root.querySelector(".showcasePrevJS"),
      nextEl: root.querySelector(".showcaseNextJS"),
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous article",
      nextSlideMessage: "Next article",
    },
    breakpoints: {
      681: { slidesPerView: 2, spaceBetween: 24 },
    },
    on: {
      afterInit: (instance) => {
        instance.el.querySelectorAll(".swiper-slide-duplicate").forEach((slide) => {
          slide.setAttribute("aria-hidden", "true");
          slide.tabIndex = -1;
        });
      },
    },
  });
};

export default function ShowcaseSliderModule() {
  if (typeof window.Swiper !== "function") return;

  document.querySelectorAll(".showcaseSliderJS").forEach((slider) => {
    const root = slider.closest("section") || document;
    const total = slider.querySelectorAll(".swiper-slide").length;

    if (slider.dataset.layout === "cards") {
      initCards(slider, root, total);
      return;
    }

    const items = [...root.querySelectorAll(".showcase-copy__item")];
    const counter = root.querySelector(".showcaseCountJS");

    const show = (swiper) => {
      const index = swiper.realIndex;
      items.forEach((item, i) => {
        item.hidden = i !== index;
      });
      if (counter) counter.textContent = `${index + 1}/${total}`;
    };

    let pressedActive = false;
    slider.addEventListener("pointerdown", (event) => {
      pressedActive = Boolean(event.target.closest(".swiper-slide-active"));
    }, true);

    slider.addEventListener("click", (event) => {
      const slide = event.target.closest("a.swiper-slide");
      if (!slide) return;
      const fromKeyboard = event.detail === 0;
      if (fromKeyboard ? !slide.classList.contains("swiper-slide-active") : !pressedActive) event.preventDefault();
    });

    new window.Swiper(slider, {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: total > 1,
      loopedSlides: total,
      spaceBetween: 12,
      speed: 700,
      grabCursor: true,
      slideToClickedSlide: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        prevEl: root.querySelector(".showcasePrevJS"),
        nextEl: root.querySelector(".showcaseNextJS"),
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
      },
      breakpoints: {
        681: { spaceBetween: 24 },
      },
      on: {
        afterInit: show,
        slideChange: show,
      },
    });
  });
}
