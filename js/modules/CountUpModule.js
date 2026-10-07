const DEFAULT_DURATION = 1400;

export default function CountUpModule() {
  const counters = [...document.querySelectorAll("[data-count]")];
  if (!counters.length) return;

  const getParts = (counter) => {
    const stat = counter.closest(".stat");
    return {
      unit: stat?.querySelector(".stat__unit") || counter.parentElement?.querySelector(".stat__unit"),
      label: stat?.querySelector(".stat__label"),
    };
  };

  const hidePart = (element) => {
    if (!element) return;
    element.style.opacity = "0";
    element.style.transform = "translateY(0.35em)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 1.1, 0.4, 1)";
  };

  const showPart = (element) => {
    if (!element) return;
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  };

  const setFinalValue = (counter) => {
    const target = Number(counter.dataset.count) || 0;
    const { unit, label } = getParts(counter);
    counter.textContent = String(target);
    showPart(label);
    showPart(unit);
  };

  const animate = (counter) => {
    const target = Number(counter.dataset.count) || 0;
    const duration = Number(counter.dataset.countDur) || DEFAULT_DURATION;
    const { unit, label } = getParts(counter);
    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const easedProgress = 1 - ((1 - progress) ** 3);
      counter.textContent = String(Math.round(target * easedProgress));

      if (progress < 1) {
        window.requestAnimationFrame(tick);
        return;
      }

      showPart(label);
      window.setTimeout(() => showPart(unit), 150);
    };

    window.requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  counters.forEach((counter) => {
    const { unit, label } = getParts(counter);
    counter.textContent = "0";
    hidePart(unit);
    hidePart(label);
    observer.observe(counter);
  });
}
