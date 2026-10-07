export default function DetailDialogModule() {
  const dialogs = [...document.querySelectorAll(".detailDialogJS")];
  if (!dialogs.length) return;

  dialogs.forEach((dialog) => {
    const details = [...dialog.querySelectorAll(".dialog-detail")];
    const moreSlider = dialog.querySelector(".detailMoreJS");
    const moreWrapper = moreSlider?.querySelector(".swiper-wrapper");
    const moreItems = moreWrapper ? [...moreWrapper.children] : [];
    const panel = dialog.querySelector(".detail-dialog__panel");
    const titleId = `${dialog.id}-title`;
    let moreSwiper = null;

    const syncMore = (id) => {
      if (!moreWrapper) return;
      moreWrapper.replaceChildren(...moreItems.filter((item) => item.dataset.detail !== id));

      if (typeof window.Swiper !== "function") return;
      if (!moreSwiper) {
        moreSwiper = new window.Swiper(moreSlider, {
          slidesPerView: 2.4,
          spaceBetween: 10,
          speed: 500,
          grabCursor: true,
          watchOverflow: true,
          navigation: {
            prevEl: dialog.querySelector(".detailMorePrevJS"),
            nextEl: dialog.querySelector(".detailMoreNextJS"),
          },
          a11y: {
            enabled: true,
            prevSlideMessage: "Previous items",
            nextSlideMessage: "Next items",
          },
          breakpoints: {
            681: { slidesPerView: 3, spaceBetween: 16 },
          },
        });
        return;
      }
      moreSwiper.update();
      moreSwiper.slideTo(0, 0);
    };

    const show = (id) => {
      details.forEach((detail) => {
        const active = detail.dataset.detail === id;
        detail.hidden = !active;
        const title = detail.querySelector(".dialog-detail__title");
        title?.removeAttribute("id");
        if (active) title?.setAttribute("id", titleId);
      });
      panel?.scrollTo({ top: 0 });
    };

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".detailOpenJS");
      if (!trigger || trigger.getAttribute("aria-controls") !== dialog.id) return;
      show(trigger.dataset.detail);
      if (!dialog.open) dialog.showModal();
      syncMore(trigger.dataset.detail);
      dialog.querySelector(".detailCloseJS")?.focus();
    });

    dialog.querySelector(".detailCloseJS")?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
      if (event.target.closest(".detailLeadJS")) dialog.close();
    });
  });
}
