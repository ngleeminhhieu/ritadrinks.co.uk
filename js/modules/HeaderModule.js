export default function HeaderModule() {
  const header = document.querySelector(".hd");
  if (!header) return;

  const main = document.querySelector(".main");
  const actions = document.querySelector(".page-actions");
  const megaItems = [...header.querySelectorAll(".menu-item.mega[data-mega]")];
  const megaContainer = header.querySelector(".hd-mega");
  const overlay = header.querySelector(".hd-overlay");
  const desktop = window.matchMedia("(min-width: 1201px)");

  const HIDE_AFTER = 120;
  const FLIP_DELTA = 8;

  let megaOpen = false;
  let megaCloseTimer;
  let lastY = Math.max(window.scrollY, 0);
  let frame = 0;

  const updateTransparent = () => {
    const transparent = desktop.matches
      && window.scrollY <= 0
      && !megaOpen
      && !header.hasAttribute("data-header-action")
      && !header.classList.contains("default");
    header.classList.toggle("hd-transparent", transparent);
  };

  const closeMega = () => {
    window.clearTimeout(megaCloseTimer);
    megaOpen = false;
    header.removeAttribute("data-active-mega");
    updateTransparent();
  };

  const openMega = (key) => {
    if (!desktop.matches) return;
    document.dispatchEvent(new CustomEvent("panel:open", { detail: "header-mega" }));
    window.clearTimeout(megaCloseTimer);
    megaOpen = true;
    header.dataset.activeMega = key;
    setHidden(false);
    updateTransparent();
  };

  const scheduleCloseMega = () => {
    window.clearTimeout(megaCloseTimer);
    megaCloseTimer = window.setTimeout(() => {
      if (megaContainer?.matches(":hover") || megaContainer?.contains(document.activeElement)) return;
      closeMega();
    }, 120);
  };

  const setHidden = (hidden) => {
    actions?.classList.toggle("is-hidden", hidden);
  };

  const applyHeader = () => {
    frame = 0;
    if (document.body.style.position === "fixed") return;

    const y = Math.max(window.scrollY, 0);
    const delta = y - lastY;

    document.body.classList.toggle("sticky", y > 0);
    main?.classList.toggle("hd-sticky", y > 0);
    updateTransparent();

    const pinned = megaOpen
      || header.hasAttribute("data-header-action")
      || document.body.classList.contains("no-scroll");

    if (pinned || y <= HIDE_AFTER) {
      setHidden(false);
      lastY = y;
      return;
    }

    if (Math.abs(delta) < FLIP_DELTA) return;

    setHidden(delta > 0);
    lastY = y;
  };

  const updateHeader = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(applyHeader);
  };

  megaItems.forEach((item) => {
    item.addEventListener("mouseenter", () => openMega(item.dataset.mega));
    item.addEventListener("mouseleave", scheduleCloseMega);
    item.addEventListener("focusin", () => openMega(item.dataset.mega));
    item.addEventListener("focusout", scheduleCloseMega);
  });

  megaContainer?.addEventListener("mouseenter", () => window.clearTimeout(megaCloseTimer));
  megaContainer?.addEventListener("mouseleave", scheduleCloseMega);
  megaContainer?.addEventListener("focusin", () => window.clearTimeout(megaCloseTimer));
  megaContainer?.addEventListener("focusout", scheduleCloseMega);
  overlay?.addEventListener("click", closeMega);

  document.addEventListener("panel:open", (event) => {
    if (event.detail !== "header-mega") closeMega();
  });

  document.addEventListener("header-action:change", () => {
    setHidden(false);
    updateTransparent();
    updateHeader();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMega();
  });

  desktop.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMega();
      return;
    }

    updateTransparent();
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("pageshow", updateHeader);
  window.addEventListener("resize", updateHeader);
  applyHeader();
}
