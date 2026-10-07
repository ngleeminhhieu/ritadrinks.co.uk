export default function CatalogBarModule() {
  const bar = document.querySelector(".catalog-bar:not(.catalog-bar--end)");
  if (!bar) return;

  const endBar = document.querySelector(".catalog-bar--end");

  const sentinel = document.createElement("span");
  sentinel.className = "catalog-bar-sentinel";
  sentinel.setAttribute("aria-hidden", "true");
  bar.before(sentinel);

  const navbarHeight = () =>
    Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--rtl-navbar-h")) || 0;

  let frame = 0;

  const update = () => {
    frame = 0;
    const sticky = sentinel.getBoundingClientRect().top < navbarHeight();
    const endInView = Boolean(endBar) && endBar.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle("is-sticky", sticky);
    bar.classList.toggle("is-away", sticky && endInView);
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
}
