const FANCYBOX_SELECTOR = '[data-fancybox="certificates"]';
const FANCYBOX_OPTIONS = {
  dragToClose: true,
  placeFocusBack: true,
};
const PAGE_SIZE = 12;

const refreshFancybox = () => {
  if (!window.Fancybox?.bind) return;

  window.Fancybox.unbind?.(FANCYBOX_SELECTOR);
  window.Fancybox.bind(FANCYBOX_SELECTOR, FANCYBOX_OPTIONS);
};

export default function CertificatesModule() {
  const grids = [...document.querySelectorAll(".certificateGridJS")];
  if (!grids.length) return;

  grids.forEach((grid) => {
    const items = [...grid.querySelectorAll(".card-item")];
    const loadMore = grid.closest(".certificate-list")?.querySelector(".certificateLoadMoreJS");
    const groups = new WeakMap(items.map((item) => [item, item.dataset.fancybox || "certificates"]));
    let visibleCount = Math.min(PAGE_SIZE, items.length);

    const render = () => {
      items.forEach((item, index) => {
        const visible = index < visibleCount;
        item.hidden = !visible;

        if (visible) {
          item.dataset.fancybox = groups.get(item);
          item.removeAttribute("aria-hidden");
        } else {
          item.removeAttribute("data-fancybox");
          item.setAttribute("aria-hidden", "true");
        }
      });

      if (loadMore) {
        const complete = visibleCount >= items.length;
        loadMore.hidden = complete;
        loadMore.setAttribute("aria-expanded", String(complete));
      }

      refreshFancybox();
    };

    loadMore?.addEventListener("click", () => {
      const firstNewItem = items[visibleCount];
      visibleCount = Math.min(visibleCount + PAGE_SIZE, items.length);
      render();
      firstNewItem?.focus({ preventScroll: true });
    });

    render();
  });
}
