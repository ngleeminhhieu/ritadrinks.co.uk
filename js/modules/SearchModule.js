export default function SearchModule() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q")?.trim();
  const category = params.get("category")?.trim();

  document.querySelectorAll('form[role="search"]').forEach((form) => {
    if (query && form.elements.q) form.elements.q.value = query;
    if (category && form.elements.category) form.elements.category.value = category;
  });

  document.querySelectorAll(".searchQueryJS").forEach((el) => {
    el.textContent = query || category || el.textContent;
  });

  const header = document.querySelector(".site-header");
  const panel = document.querySelector(".searchPanelJS");
  const openers = [...document.querySelectorAll(".searchOpenJS")];
  if (!header || !panel || !openers.length) return;

  const sheet = panel.querySelector(".search-panel__sheet");
  const input = panel.querySelector('input[type="search"]');
  const page = [...document.body.children].filter((el) => el !== header && el !== panel && el.tagName !== "SCRIPT");
  let lastOpener = null;

  const setOpen = (open, opener = null) => {
    if (open === !panel.hidden) return;
    if (open) document.querySelector('.menu-toggle[aria-expanded="true"]')?.click();
    panel.hidden = !open;
    openers.forEach((item) => {
      item.setAttribute("aria-expanded", String(open));
      item.setAttribute("aria-label", open ? "Close search" : "Open search");
    });
    page.forEach((el) => {
      el.inert = open;
    });
    if (open) {
      lastOpener = opener;
      input?.focus({ preventScroll: true });
    } else {
      lastOpener?.focus({ preventScroll: true });
    }
  };

  openers.forEach((opener) => {
    opener.addEventListener("click", () => setOpen(panel.hidden, opener));
  });

  panel.addEventListener("click", (event) => {
    if (!sheet?.contains(event.target)) setOpen(false);
  });

  document.querySelector(".menu-toggle")?.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
}
