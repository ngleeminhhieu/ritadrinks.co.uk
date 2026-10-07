export default function BannerPinModule() {
  const banner = document.querySelector(".page-banner");
  const cover = banner?.nextElementSibling;
  if (!banner || !cover?.classList.contains("sec-overlap")) return;

  let frame = 0;

  const update = () => {
    frame = 0;
    const covered = cover.getBoundingClientRect().top <= banner.getBoundingClientRect().top + 1;
    banner.classList.toggle("is-covered", covered);
  };

  const measure = () => {
    banner.classList.remove("is-pinned");
    const top = banner.getBoundingClientRect().top + window.scrollY;
    banner.style.setProperty("--banner-top", `${Math.round(top)}px`);
    banner.classList.add("is-pinned");
    update();
  };

  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  measure();
}
