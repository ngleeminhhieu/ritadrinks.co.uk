export default function TabsModule() {
  document.querySelectorAll(".tabsJS").forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const scope = tablist.closest("section") || document;
    const panels = [...new Set(tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls"))))].filter(Boolean);
    const stickyBar = tablist.closest(".release-tabs-bar");

    const bringIntoView = (panel) => {
      if (!stickyBar) return;
      const header = document.querySelector(".site-header");
      const offset = (header?.offsetHeight || 0) + stickyBar.offsetHeight;
      const top = panel.getBoundingClientRect().top;
      if (top < offset) window.scrollTo({ top: window.scrollY + top - offset - 16, behavior: "smooth" });
    };

    const select = (tab, { focus = false } = {}) => {
      if (tab.getAttribute("aria-selected") === "true") return;

      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });

      scope.querySelectorAll("[data-tab-for]").forEach((media) => {
        media.classList.toggle("is-active", media.dataset.tabFor === tab.id);
      });

      if (tab.dataset.href) {
        scope.querySelectorAll(".tabLinkJS").forEach((link) => {
          link.href = tab.dataset.href;
          link.setAttribute("aria-label", `See more ${tab.textContent.trim()}`);
        });
      }

      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (!panel) return;

      if (panels.length > 1) {
        panels.forEach((item) => {
          item.hidden = item !== panel;
        });
      } else {
        panel.setAttribute("aria-labelledby", tab.id);
      }

      const list = panel.querySelector(".loadMoreListJS");
      const order = tab.dataset.order?.split(",");
      if (list && order) {
        const items = new Map([...list.children].map((item) => [item.dataset.id, item]));
        list.append(...order.map((id) => items.get(id)).filter(Boolean));
        list.dispatchEvent(new CustomEvent("loadmore:reset"));
      }

      bringIntoView(panel);
      panel.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)" },
      );
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        const targets = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
        if (!(event.key in targets)) return;
        event.preventDefault();
        select(tabs[(targets[event.key] + tabs.length) % tabs.length], { focus: true });
      });
    });
  });
}
