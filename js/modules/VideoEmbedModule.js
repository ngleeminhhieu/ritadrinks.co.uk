export default function VideoEmbedModule() {
  document.querySelectorAll(".videoEmbedJS").forEach((embed) => {
    const iframe = embed.querySelector("iframe[data-src]");
    const cover = embed.querySelector(".video-cover");
    if (!iframe || !cover) return;

    cover.addEventListener("click", () => {
      if (!iframe.getAttribute("src")) iframe.setAttribute("src", iframe.dataset.src);
      embed.classList.add("is-playing");
      iframe.focus();
    }, { once: true });
  });
}
