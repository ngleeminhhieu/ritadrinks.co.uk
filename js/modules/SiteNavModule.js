export default function SiteNavModule() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".mobileNavJS");
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")];

  if (toggle && navigation) {
    const header = toggle.closest(".site-header");
    const desktop = window.matchMedia("(min-width: 1121px)");
    const subs = [...navigation.querySelectorAll(".mobileNavSubJS")];
    const openers = [...navigation.querySelectorAll(".mobileNavOpenJS")];
    const page = [...document.body.children].filter((el) => el !== header && el !== navigation && el.tagName !== "SCRIPT");
    let activeSub = null;

    const showLevel = (sub) => {
      activeSub = sub;
      navigation.classList.toggle("is-sub", Boolean(sub));
      subs.forEach((item) => item.classList.toggle("is-active", item === sub));
      openers.forEach((opener) => {
        opener.setAttribute("aria-expanded", String(Boolean(sub) && opener.getAttribute("aria-controls") === sub.id));
      });
    };

    const back = () => {
      const opener = openers.find((item) => item.getAttribute("aria-controls") === activeSub?.id);
      showLevel(null);
      opener?.focus({ preventScroll: true });
    };

    const setOpen = (open) => {
      if (open === !navigation.hidden) return;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (open) showLevel(null);
      navigation.hidden = !open;
      page.forEach((el) => {
        el.inert = open;
      });
    };

    toggle.addEventListener("click", () => setOpen(navigation.hidden));

    navigation.addEventListener("click", (event) => {
      const opener = event.target.closest(".mobileNavOpenJS");
      if (opener) {
        const sub = navigation.querySelector(`#${opener.getAttribute("aria-controls")}`);
        showLevel(sub);
        sub?.querySelector(".mobileNavBackJS")?.focus({ preventScroll: true });
        return;
      }
      if (event.target.closest(".mobileNavBackJS")) {
        back();
        return;
      }
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (navigation.hidden || navigation.contains(event.target) || header?.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || navigation.hidden) return;
      if (activeSub) {
        back();
        return;
      }
      setOpen(false);
      toggle.focus();
    });

    desktop.addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  const buttonOf = (dropdown) => dropdown.querySelector(":scope > button");

  const sync = (dropdown) => {
    const expanded = dropdown.classList.contains("is-open") || dropdown.matches(":hover");
    buttonOf(dropdown)?.setAttribute("aria-expanded", String(expanded));
  };

  const setOpen = (dropdown, open) => {
    dropdown.classList.toggle("is-open", open);
    sync(dropdown);
  };

  const closeOthers = (current) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== current) setOpen(dropdown, false);
    });
  };

  dropdowns.forEach((dropdown) => {
    const button = buttonOf(dropdown);

    dropdown.addEventListener("mouseenter", () => {
      closeOthers(dropdown);
      sync(dropdown);
    });

    dropdown.addEventListener("mouseleave", () => setOpen(dropdown, false));

    button?.addEventListener("click", () => {
      closeOthers(dropdown);
      setOpen(dropdown, !dropdown.classList.contains("is-open"));
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
    });

    dropdown.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !dropdown.classList.contains("is-open")) return;
      setOpen(dropdown, false);
      button?.focus();
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-dropdown")) return;
    dropdowns.forEach((dropdown) => setOpen(dropdown, false));
  });

  document.querySelectorAll(".subNavJS").forEach((bar) => {
    const current = bar.querySelector('[aria-current="page"]');
    if (!current || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollLeft = current.offsetLeft - (bar.clientWidth - current.offsetWidth) / 2;
  });
}
