(() => {
  const burger = document.querySelector(".burger");
  const drawer = document.getElementById("drawer");
  const closeBtn = drawer?.querySelector(".drawer-close");
  const panel = drawer?.querySelector(".drawer-panel");

  if (!burger || !drawer || !closeBtn || !panel) return;

  const open = () => {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  // clic sur l'overlay pour fermer
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) close();
  });

  // clic sur un lien => fermer
  drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

  // touche ESC => fermer
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
})();