window.addEventListener("DOMContentLoaded", async function () {
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