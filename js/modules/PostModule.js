const slugify = (text) => text
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_]+/g, "-")
  .slice(0, 64);

const initToc = () => {
  const toc = document.querySelector(".tocJS");
  const list = toc?.querySelector(".tocListJS");
  const content = document.querySelector(".postContentJS");
  if (!toc || !list || !content) return;

  const headings = [...content.querySelectorAll("h2, h3")];
  if (!headings.length) {
    toc.closest(".post-toc")?.remove();
    return;
  }

  const used = new Set();
  const links = [];
  const groups = [];
  let group = null;

  const makeLink = (heading) => {
    if (!heading.id) {
      let id = slugify(heading.textContent) || "section";
      while (used.has(id) || document.getElementById(id)) id = `${id}-1`;
      heading.id = id;
    }
    used.add(heading.id);
    const link = document.createElement("a");
    link.className = "toc__link";
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    return link;
  };

  const setGroup = (target, open) => {
    target.item.classList.toggle("is-open", open);
    target.toggle.setAttribute("aria-expanded", String(open));
    target.wrap.inert = !open;
  };

  const openOnly = (target) => {
    groups.forEach((entry) => setGroup(entry, entry === target));
  };

  headings.forEach((heading) => {
    const link = makeLink(heading);

    if (heading.tagName === "H2" || !group) {
      const item = document.createElement("li");
      item.className = "toc__item";
      const row = document.createElement("div");
      row.className = "toc__row";
      row.append(link);
      item.append(row);
      list.append(item);
      group = { item, row, sub: null };
      links.push({ link, heading, group });
      return;
    }

    if (!group.sub) {
      const wrap = document.createElement("div");
      wrap.className = "toc__sub-wrap";
      wrap.id = `toc-sub-${groups.length + 1}`;
      const sub = document.createElement("ol");
      sub.className = "toc__sub";
      wrap.append(sub);
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toc__toggle";
      toggle.setAttribute("aria-controls", wrap.id);
      toggle.setAttribute("aria-label", `Show subsections of ${group.row.firstChild.textContent}`);
      group.row.append(toggle);
      group.item.append(wrap);
      Object.assign(group, { sub, wrap, toggle });
      groups.push(group);
      setGroup(group, false);
      const current = group;
      toggle.addEventListener("click", () => {
        if (current.item.classList.contains("is-open")) setGroup(current, false);
        else openOnly(current);
      });
    }

    const item = document.createElement("li");
    item.append(link);
    group.sub.append(item);
    links.push({ link, heading, group });
  });

  const desktop = window.matchMedia("(min-width: 1121px)");
  const syncOpen = () => {
    toc.open = desktop.matches;
  };
  syncOpen();
  desktop.addEventListener("change", syncOpen);

  toc.addEventListener("click", (event) => {
    if (event.target.closest(".toc__link") && !desktop.matches) toc.open = false;
  });

  let frame = 0;
  let active = null;
  const spy = () => {
    frame = 0;
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    let current = links[0];
    links.forEach((entry) => {
      if (entry.heading.getBoundingClientRect().top - offset - 8 <= 0) current = entry;
    });
    if (current === active) return;
    active?.link.classList.remove("is-active");
    active?.link.removeAttribute("aria-current");
    current.link.classList.add("is-active");
    current.link.setAttribute("aria-current", "location");
    if (!current.group?.toggle) openOnly(null);
    else if (!current.group.item.classList.contains("is-open")) openOnly(current.group);
    active = current;
  };

  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(spy);
  }, { passive: true });
  spy();
};

const initShare = () => {
  document.querySelectorAll(".shareJS").forEach((share) => {
    const url = encodeURIComponent(window.location.href.split("#")[0]);
    const title = encodeURIComponent(document.querySelector("h1")?.textContent.trim() || document.title);
    const status = share.querySelector(".share__status");
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    };

    share.querySelectorAll("a[data-share]").forEach((link) => {
      if (targets[link.dataset.share]) link.href = targets[link.dataset.share];
    });

    const copy = share.querySelector('[data-share="copy"]');
    copy?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href.split("#")[0]);
        copy.classList.add("is-copied");
        if (status) status.textContent = "Link copied";
      } catch {
        if (status) status.textContent = "Copy failed";
      }
      window.setTimeout(() => {
        copy.classList.remove("is-copied");
        if (status) status.textContent = "";
      }, 2400);
    });
  });
};

export default function PostModule() {
  initToc();
  initShare();
}
