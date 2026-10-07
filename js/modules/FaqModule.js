export default function FaqModule() {
  const roots = [...document.querySelectorAll(".faqRootJS")];
  if (!roots.length) return;

  roots.forEach((root) => {
    const items = [...root.querySelectorAll(".faq-item")];
    if (!items.length) return;

    const bodyOf = (item) => item.querySelector(".faq-item__body");

    const setOpen = (item, open) => {
      const body = bodyOf(item);
      const toggle = item.querySelector(".faq-item__toggle");
      if (!body || !toggle) return;

      item.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      body.style.maxHeight = open ? `${body.scrollHeight}px` : "";
    };

    items.forEach((item) => {
      const toggle = item.querySelector(".faq-item__toggle");
      if (!toggle) return;

      toggle.addEventListener("click", () => {
        const open = !item.classList.contains("is-open");
        items.forEach((other) => setOpen(other, other === item && open));
      });

      setOpen(item, item.classList.contains("is-open"));
    });

    window.addEventListener("resize", () => {
      const open = items.find((item) => item.classList.contains("is-open"));
      if (!open) return;

      const body = bodyOf(open);
      body.style.maxHeight = "";
      body.style.maxHeight = `${body.scrollHeight}px`;
    });
  });
}
