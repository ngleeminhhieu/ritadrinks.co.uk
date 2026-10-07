export default function ProductDetailModule() {
  document.querySelectorAll(".storyCollapseJS").forEach((body) => {
    const toggle = document.querySelector(`.storyToggleJS[aria-controls="${body.id}"]`);
    const label = toggle?.querySelector(".button-label");
    const collapsed = parseFloat(getComputedStyle(body).maxHeight);

    if (body.scrollHeight <= collapsed + 40) {
      body.classList.add("is-short");
      return;
    }

    body.addEventListener("transitionend", (event) => {
      if (event.propertyName === "max-height" && body.classList.contains("is-expanded")) body.style.maxHeight = "none";
    });

    toggle?.addEventListener("click", () => {
      const open = !body.classList.contains("is-expanded");
      if (open) {
        body.style.maxHeight = `${body.scrollHeight}px`;
      } else {
        body.style.maxHeight = `${body.scrollHeight}px`;
        body.getBoundingClientRect();
        body.style.maxHeight = "";
      }
      body.classList.toggle("is-expanded", open);
      toggle.setAttribute("aria-expanded", String(open));
      label?.dispatchEvent(new CustomEvent("letterswap:set", { detail: open ? toggle.dataset.labelLess : toggle.dataset.labelMore }));
      if (!open) body.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });

  const sticky = document.querySelector(".stickyCtaJS");
  const actions = document.querySelector(".productActionsJS");
  if (!sticky || !actions || !("IntersectionObserver" in window)) return;

  sticky.hidden = false;
  let passedActions = false;
  const blockers = new Set();

  const update = () => {
    sticky.classList.toggle("is-visible", passedActions && blockers.size === 0);
  };

  const compact = window.matchMedia("(max-width: 1120px)");
  let frame = 0;
  const check = () => {
    frame = 0;
    passedActions = compact.matches || actions.getBoundingClientRect().bottom < 0;
    update();
  };

  compact.addEventListener("change", check);

  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(check);
  }, { passive: true });
  window.addEventListener("resize", check, { passive: true });
  check();

  const blockerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) blockers.add(entry.target);
      else blockers.delete(entry.target);
    });
    update();
  });

  document.querySelectorAll("#enquiry, .site-footer").forEach((el) => blockerObserver.observe(el));
}
