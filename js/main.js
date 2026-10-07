import AnnouncementModule from "./modules/AnnouncementModule.js";
import SiteNavModule from "./modules/SiteNavModule.js";
import LetterSwapModule from "./modules/LetterSwapModule.js";
import LoadMoreModule from "./modules/LoadMoreModule.js";
import TabsModule from "./modules/TabsModule.js";
import ExhibitionModule from "./modules/ExhibitionModule.js";
import NewsSliderModule from "./modules/NewsSliderModule.js";
import StackScrollModule from "./modules/StackScrollModule.js";
import CountUpModule from "./modules/CountUpModule.js";
import VideoEmbedModule from "./modules/VideoEmbedModule.js";
import ScrollHideModule from "./modules/ScrollHideModule.js";
import ShowcaseSliderModule from "./modules/ShowcaseSliderModule.js";
import AwardsModule from "./modules/AwardsModule.js";
import DetailDialogModule from "./modules/DetailDialogModule.js";
import SearchModule from "./modules/SearchModule.js";
import ProductDetailModule from "./modules/ProductDetailModule.js";
import RelatedSliderModule from "./modules/RelatedSliderModule.js";
import PostModule from "./modules/PostModule.js";
import FormatsModule from "./modules/FormatsModule.js";
import ProcessPathModule from "./modules/ProcessPathModule.js";
import BannerPinModule from "./modules/BannerPinModule.js";

const initTemplateUtilities = () => {
  document.querySelector(".backToTopJS")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (window.Fancybox?.bind) {
    window.Fancybox.bind("[data-fancybox]", {
      dragToClose: true,
      placeFocusBack: true,
    });
  }
};

const initHeroSlider = () => {
  const slider = document.querySelector(".heroSliderJS");

  if (!slider || typeof window.Swiper !== "function") {
    return;
  }

  const hero = slider.closest(".hero-banner");
  const slideCount = slider.querySelectorAll(".swiper-slide").length;
  const autoplayDelay = 6000;
  const autoplayEnabled = slideCount > 1;
  const desktopHero = window.matchMedia("(min-width: 1201px)");
  let heroSwiper;
  let heroResizeFrame;

  hero?.style.setProperty("--hero-autoplay-delay", `${autoplayDelay}ms`);
  hero?.classList.toggle("has-autoplay-progress", autoplayEnabled);
  hero?.classList.remove("is-autoplay-paused");

  const updateHeroHeight = () => {
    if (desktopHero.matches) {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      hero?.style.setProperty("--hero-desktop-height", `${Math.round(viewportHeight)}px`);
    } else {
      hero?.style.removeProperty("--hero-desktop-height");
    }

    heroSwiper?.update();
  };

  const requestHeroResize = () => {
    window.cancelAnimationFrame(heroResizeFrame);
    heroResizeFrame = window.requestAnimationFrame(updateHeroHeight);
  };

  updateHeroHeight();

  heroSwiper = new window.Swiper(slider, {
    slidesPerView: 1,
    speed: 700,
    loop: slideCount > 1,
    watchOverflow: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: autoplayEnabled
      ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      : false,
    navigation: {
      prevEl: hero?.querySelector(".heroPrevJS"),
      nextEl: hero?.querySelector(".heroNextJS"),
    },
    pagination: {
      el: hero?.querySelector(".heroPaginationJS"),
      clickable: true,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      firstSlideMessage: "This is the first slide",
      lastSlideMessage: "This is the last slide",
      paginationBulletMessage: "Go to slide {{index}}",
    },
    on: {
      autoplayStart() {
        hero?.classList.remove("is-autoplay-paused");
      },
      autoplayPause() {
        hero?.classList.add("is-autoplay-paused");
      },
      autoplayResume() {
        hero?.classList.remove("is-autoplay-paused");
      },
      autoplayStop() {
        hero?.classList.add("is-autoplay-paused");
      },
    },
  });

  window.addEventListener("resize", requestHeroResize, { passive: true });
  window.visualViewport?.addEventListener("resize", requestHeroResize, { passive: true });
  desktopHero.addEventListener("change", requestHeroResize);
};

const init = () => {
  [
    SiteNavModule,
    SearchModule,
    AnnouncementModule,
    LetterSwapModule,
    TabsModule,
    LoadMoreModule,
    ExhibitionModule,
    NewsSliderModule,
    StackScrollModule,
    CountUpModule,
    VideoEmbedModule,
    ScrollHideModule,
    ShowcaseSliderModule,
    AwardsModule,
    DetailDialogModule,
    ProductDetailModule,
    RelatedSliderModule,
    PostModule,
    FormatsModule,
    ProcessPathModule,
    BannerPinModule,
    initHeroSlider,
    initTemplateUtilities,
  ].forEach((module) => {
    try {
      module();
    } catch (error) {
      console.error(`${module.name || "module"} failed to start`, error);
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
