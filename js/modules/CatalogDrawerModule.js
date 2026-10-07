export default function CatalogDrawerModule() {
  document.querySelectorAll(".catalogToolsJS").forEach((form) => {
    const drawers = [...form.querySelectorAll(".catalog-drawer")];
    const openers = [...document.querySelectorAll(".catalogDrawerOpenJS")].filter((button) =>
      drawers.some((drawer) => drawer.id === button.getAttribute("aria-controls")),
    );
    const badges = openers.flatMap((button) => [...button.querySelectorAll(".catalogFilterBadgeJS")]);
    let current = null;
    let opener = null;

    const syncBadge = () => {
      badges.forEach((badge) => {
        const drawer = document.getElementById(badge.closest(".catalogDrawerOpenJS").getAttribute("aria-controls"));
        const count = drawer ? drawer.querySelectorAll("input[type='radio']:checked").length + [...drawer.querySelectorAll("input[type='date']")].filter((input) => input.value).length : 0;
        badge.textContent = String(count);
        badge.hidden = count === 0;
      });
    };

    const close = ({ restoreFocus = true } = {}) => {
      if (!current) return;

      current.classList.remove("is-open");
      current.setAttribute("aria-hidden", "true");
      current.inert = true;
      form.classList.remove("is-drawer-open");
      document.body.classList.remove("no-scroll");
      openers.forEach((button) => button.setAttribute("aria-expanded", "false"));

      if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
      current = null;
      opener = null;
    };

    const open = (drawer, trigger) => {
      if (current === drawer) return;
      close({ restoreFocus: false });
      document.dispatchEvent(new CustomEvent("panel:open", { detail: "catalog-drawer" }));

      current = drawer;
      opener = trigger;
      drawer.inert = false;
      drawer.setAttribute("aria-hidden", "false");
      drawer.classList.add("is-open");
      form.classList.add("is-drawer-open");
      document.body.classList.add("no-scroll");
      trigger.setAttribute("aria-expanded", "true");
      window.setTimeout(() => drawer.querySelector(".catalog-drawer__close")?.focus({ preventScroll: true }), 120);
    };

    openers.forEach((button) => {
      const drawer = document.getElementById(button.getAttribute("aria-controls"));
      if (drawer) button.addEventListener("click", () => open(drawer, button));
    });

    form.querySelectorAll(".catalogDrawerCloseJS").forEach((button) => {
      button.addEventListener("click", () => close());
    });

    form.addEventListener("pointerdown", (event) => {
      const input = event.target.closest(".catalog-chip")?.querySelector("input[type='radio']");
      if (input) input.dataset.wasChecked = String(input.checked);
    });

    form.addEventListener("click", (event) => {
      const chip = event.target.closest(".catalog-chip");
      const input = chip?.querySelector("input[type='radio']");
      if (!input || event.target !== input) return;

      if (input.dataset.wasChecked === "true") input.checked = false;
      delete input.dataset.wasChecked;
      syncBadge();
    });

    form.addEventListener("change", syncBadge);

    const params = new URLSearchParams(window.location.search);
    form.querySelectorAll(".catalog-chip input[type='radio']").forEach((input) => {
      if (params.getAll(input.name).includes(input.value)) input.checked = true;
    });
    form.querySelectorAll("input[type='date']").forEach((input) => {
      if (params.get(input.name)) input.value = params.get(input.name);
    });

    drawers.forEach((drawer) => {
      drawer.querySelector(".catalogDrawerClearJS")?.addEventListener("click", () => {
        drawer.querySelectorAll("input[type='radio']").forEach((input) => {
          input.checked = false;
        });
        drawer.querySelectorAll("input[type='search'], input[type='date']").forEach((input) => {
          input.value = "";
        });
        syncBadge();
      });

      drawer.querySelectorAll(".catalogDrawerMoreJS").forEach((button) => {
        button.addEventListener("click", () => {
          const group = button.closest(".catalog-drawer__group");
          const expanded = group.classList.toggle("is-expanded");
          button.setAttribute("aria-expanded", String(expanded));
          button.textContent = expanded ? "مشاهده کمتر" : "مشاهده بیشتر";
        });
      });

      drawer.querySelectorAll(".catalog-drawer__group").forEach((group) => {
        if (group.querySelector(".catalog-chip.is-extra input:checked")) {
          group.querySelector(".catalogDrawerMoreJS")?.click();
        }
      });
    });

    form.addEventListener("submit", () => {
      form.querySelectorAll("input[type='search'], input[type='date']").forEach((input) => {
        input.disabled = input.value.trim() === "";
      });
    });

    window.addEventListener("pageshow", () => {
      form.querySelectorAll("input[type='search'], input[type='date']").forEach((input) => {
        input.disabled = false;
      });
    });

    document.addEventListener("panel:open", (event) => {
      if (event.detail !== "catalog-drawer") close({ restoreFocus: false });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && current) {
        event.preventDefault();
        close();
      }
    });

    syncBadge();
  });
}
