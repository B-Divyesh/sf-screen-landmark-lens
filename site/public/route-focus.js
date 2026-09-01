const routeFocusKey = "lens:focus-route-heading";

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href]");
  if (!link) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && destination.pathname !== location.pathname) {
    sessionStorage.setItem(routeFocusKey, "1");
  }
});

addEventListener("pageshow", () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const shouldFocus = sessionStorage.getItem(routeFocusKey) === "1" || navigation?.type === "back_forward";
  sessionStorage.removeItem(routeFocusKey);
  if (!shouldFocus) return;
  const heading = document.querySelector("h1");
  if (!heading) return;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
  heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
});
