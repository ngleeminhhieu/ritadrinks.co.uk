export default function StackScrollModule() {
  const panels = [...document.querySelectorAll(".stackPinJS")];
  if (!panels.length) return;

  const header = document.querySelector(".site-header");

  const update = () => {
    const headerHeight = header?.offsetHeight || 0;
    panels.forEach((panel) => {
      const top = Math.min(headerHeight, window.innerHeight - panel.offsetHeight);
      panel.style.setProperty("--stack-top", `${Math.round(top)}px`);
    });
  };

  update();
  window.addEventListener("resize", update, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(update);
    panels.forEach((panel) => observer.observe(panel));
  }
}
