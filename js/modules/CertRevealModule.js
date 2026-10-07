export default function CertRevealModule() {
  const cards = [...document.querySelectorAll(".card-item.is-cert")].filter((card) =>
    card.querySelector(".cert-reveal"),
  );
  if (!cards.length) return;

  const touchOnly = window.matchMedia("(hover: none)");

  const closeAll = (except) => {
    cards.forEach((card) => {
      if (card !== except) card.classList.remove("is-revealed");
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!touchOnly.matches || card.classList.contains("is-revealed")) return;

      event.preventDefault();
      closeAll(card);
      card.classList.add("is-revealed");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest?.(".card-item.is-cert")) closeAll();
  });
}
