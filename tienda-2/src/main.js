window.addEventListener("DOMContentLoaded", async function () {
  StoreCart.renderCartTooltip();
  const syncCartUI = () => {
    StoreCart.renderCartTooltip();
    document.querySelectorAll("[data-product-card]").forEach((card) => {
      const id = card.dataset.id;
      const product = StoreCart.getProducts().find((item) => String(item.id) === String(id));
      const cartItem = StoreCart.getCart().find((item) => String(item.id) === String(id));
      if (!product) return;
      const quantity = cartItem?.quantity || 0;
      const toggle = card.querySelector('[data-action="toggle"]');
      const decrease = card.querySelector('[data-action="decrease"]');
      const increase = card.querySelector('[data-action="increase"]');
      const quantityEl = card.querySelector("[data-cart-quantity]");
      if (toggle) {
        toggle.innerHTML = `<i class="${cartItem ? "ri-close-line" : "ri-shopping-cart-2-line"}" aria-hidden="true"></i>`;
        toggle.setAttribute("aria-label", `${cartItem ? "Eliminar" : "Agregar"} ${product.name}`);
        toggle.setAttribute("aria-pressed", String(Boolean(cartItem)));
      }
      if (quantityEl) quantityEl.textContent = quantity;
      if (decrease) decrease.disabled = !cartItem || quantity <= product.minCant;
      if (increase) increase.disabled = Boolean(cartItem && quantity + product.minCant > product.stock);
    });
  };

  // ADD/REMOVE ITEM FROM CART
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const product = StoreCart.getProducts().find((item) => String(item.id) === String(control.dataset.id));
    if (!product) return;
    event.preventDefault();
    if (control.dataset.action === "toggle") {
      const isInCart = StoreCart.getCart().some((item) => String(item.id) === String(product.id));
      isInCart ? StoreCart.removeFromCart(product.id) : StoreCart.addToCart(product);
    } else if (control.dataset.action === "increase") {
      StoreCart.updateCartItemQuantity(product.id, 1);
    } else if (control.dataset.action === "decrease") {
      StoreCart.updateCartItemQuantity(product.id, -1);
    }
  });

  window.addEventListener("cartchange", syncCartUI);

  /*=============== SHOW MENU ===============*/
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

  /* Menu show */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  /* Menu hidden */
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  /*=============== REMOVE MENU MOBILE ===============*/
  const navLink = document.querySelectorAll(".nav_link");

  const linkAction = () => {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav_link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
  };
  navLink.forEach((n) => n.addEventListener("click", linkAction));

  /*=============== ADD BLUR HEADER ===============*/
  const blurHeader = () => {
    const header = document.getElementById("header");
    // Add a class if the bottom offset is greater than 50 of the viewport
    window.scrollY >= 50
      ? header.classList.add("blur-header")
      : header.classList.remove("blur-header");
  };
  window.addEventListener("scroll", blurHeader);

  /*=============== SHOW SCROLL UP ===============*/
  const scrollUp = () => {
    const scrollUp = document.getElementById("scroll-up");
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    window.scrollY >= 350
      ? scrollUp.classList.add("show-scroll")
      : scrollUp.classList.remove("show-scroll");
  };
  window.addEventListener("scroll", scrollUp);

  /*=============== TRIGGER RIPPLE ===============*/
  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "animate-ripples";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600); // Match animation duration
    });
  });

  /*=============== PAGE SECTIONS ACTIVE LINK ===============*/
  const urlParam = new URLSearchParams(window.location.search);
  const type = urlParam.get("topic");
  // If type param exists, activate corresponding link
  if (type) {
    const activeLink = document.querySelector(
      `.nav_menu a[href*="topic=${type}"]`,
    );
    if (activeLink) {
      activeLink.classList.add("active-link");
    }
  } else {
    const firstLink = document.querySelector(".nav_menu a");
    if (firstLink) {
      firstLink.classList.add("active-link");
    }
  }

  /*=============== SEARCH INPUT ===============*/
  // Algoritmo para tomar el valor del input y redireccionar
  document
    .querySelector("#search-input")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const inputValue = document.getElementById("header-input").value.trim();
      if (inputValue) {
        window.location.href = `/src/productos/?name=${encodeURIComponent(inputValue)}&page=1`;
      }
    });

  /*=============== SCROLL REVEAL ANIMATION ===============*/
  const sr = ScrollReveal({
    origin: "top",
    distance: "40px",
    opacity: 0,
    duration: 2500,
    delay: 250,
    reset: false,
  });
  
  sr.reveal(`.perfume_img, .empty_cart-container`);
  sr.reveal(`.hero_data, .perfume_data, .promo_card-normal`, {
    origin: "right",
  });
  sr.reveal(`.promo_card-large`, { origin: "left" });
  sr.reveal(`.footer_container`, { origin: "bottom" });
});