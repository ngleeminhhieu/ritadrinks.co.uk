export default function ScrollHideModule() {
  const bars = [...document.querySelectorAll(".scrollHideJS")];
  if (!bars.length) return;

  const THRESHOLD = 6;
  let lastY = window.scrollY;
  let frame = 0;

  const isStuck = (bar) => {
    const next = bar.nextElementSibling;
    if (!next) return false;
    const style = getComputedStyle(bar);
    const naturalTop = next.getBoundingClientRect().top - bar.offsetHeight - parseFloat(style.marginBottom || 0);
    return naturalTop < (parseFloat(style.top) || 0) - 1;
  };

  const update = () => {
    frame = 0;
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < THRESHOLD) return;
    lastY = y;

    const sliding = Boolean(document.querySelector(".page-banner.is-pinned:not(.is-covered)"));

    bars.forEach((bar) => {
      const hide = delta > 0 && isStuck(bar) && !bar.querySelector(":focus-visible") && !sliding;
      bar.classList.toggle("is-tucked", hide);
    });
  };

  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  }, { passive: true });

  bars.forEach((bar) => {
    bar.addEventListener("focusin", (event) => {
      if (event.target.matches(":focus-visible")) bar.classList.remove("is-tucked");
    });
  });
}
