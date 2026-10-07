export default function BlogTocModule() {
  const roots = [...document.querySelectorAll(".blogTocJS")];
  if (!roots.length) return;

  roots.forEach((root) => {
    const groups = [...root.querySelectorAll(".blog-toc__group")];

    groups.forEach((group) => {
      group.addEventListener("toggle", () => {
        if (!group.open) return;
        groups.forEach((other) => {
          if (other !== group && other.open) other.open = false;
        });
      });
    });

    root.addEventListener("click", (event) => {
      const link = event.target.closest(".blog-toc__link");
      if (!link || !root.contains(link)) return;

      const summary = link.closest("summary");
      if (!summary) return;

      event.preventDefault();

      const details = summary.parentElement;
      if (details && !details.open) details.open = true;

      const id = decodeURIComponent((link.getAttribute("href") || "").slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `#${id}`);
      }
    });
  });
}
