export default function ContentTableModule() {
  const roots = [...document.querySelectorAll(".content-detail")];
  if (!roots.length) return;

  const wraps = [];

  const columnCount = (table) =>
    [...table.rows].reduce(
      (max, row) =>
        Math.max(max, [...row.cells].reduce((sum, cell) => sum + (cell.colSpan || 1), 0)),
      0,
    );

  roots.forEach((root) => {
    [...root.querySelectorAll("table")].forEach((table) => {
      let wrap = table.closest(".content-detail__table");
      if (wrap && wrap.firstElementChild !== table) return;

      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "content-detail__table";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      }

      wrap.style.setProperty("--content-table-cols", String(columnCount(table) || 1));
      wraps.push(wrap);
    });
  });

  if (!wraps.length) return;

  const sync = () => {
    wraps.forEach((wrap) => {
      const scrollable = wrap.scrollWidth - wrap.clientWidth > 1;
      wrap.classList.toggle("is-scrollable", scrollable);

      if (scrollable) {
        wrap.setAttribute("tabindex", "0");
        wrap.setAttribute("role", "region");
        wrap.setAttribute("aria-label", "جدول قابل للتمرير أفقيًا");
      } else {
        wrap.removeAttribute("tabindex");
        wrap.removeAttribute("role");
        wrap.removeAttribute("aria-label");
      }
    });
  };

  let syncFrame;
  const requestSync = () => {
    window.cancelAnimationFrame(syncFrame);
    syncFrame = window.requestAnimationFrame(sync);
  };

  sync();
  window.addEventListener("resize", requestSync, { passive: true });
  document.fonts?.ready.then(sync);
}
