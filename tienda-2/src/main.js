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

/*=============== SWIPERJS HOME ===============*/
let swiperHome = new Swiper(".home_swiper", {
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  spaceBetween: 32,
  grabCursor: true,
  effect: 'creative',
  creativeEffect: {
    prev: {
      translate: [-100, 0, -500],
      opacity: 0
    },
    next: {
      translate: [100, 0, -500],
      opacity: 0
    }
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});

/*=============== SWIPERJS BRAND ===============*/
let swiperBrand = new Swiper(".brand_swiper", {
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  slidesPerView: 2,
  spaceBetween: 20,
  breakpoints: {
    576: {
      slidesPerView: 3,
    },
    1023: {
      slidesPerView: 4,
    }
  },
  grabCursor: true,
});

/*=============== LOAD DATA ===============*/
window.addEventListener('DOMContentLoaded', async function() {
  // ✅ FLAG: Solo se ejecuta en la ruta principal
  const currentPath = window.location.pathname;
  const shouldLoadHome = currentPath === '/src/';

  if (shouldLoadHome) {
    /*=============== LOAD POPULAR & NEWS ===============*/
    const popularContainer = document.getElementById('popular-wrapper');
    const newsContainer = document.getElementById('news-wrapper');

    // Ejecuta ambos fetch en paralelo
    Promise.all([
      fetch('/public/static/popular.json').then(res => {
        if (!res.ok) throw new Error('Error fetching products.json: ' + res.status);
        return res.json();
      }),
      fetch('/public/static/news.json').then(res => {
        if (!res.ok) throw new Error('Error fetching news.json: ' + res.status);
        return res.json();
      })
    ])
    .then(([popularData, newsData]) => {
      // Combinar ambos arrays sin repetir los id de los objetos
      const productos = [...new Map([...popularData, ...newsData].map(item => [item.id, item])).values()];

      // Guardar en localStorage
      localStorage.setItem('products', JSON.stringify(productos));

      // Renderizar POPULAR
      if (popularContainer && Array.isArray(popularData)) {
        popularContainer.innerHTML = popularData.map(product => 
          `<div class="swiper-slide">
            <article class="product_card">
              <a href="/src/perfume/?q=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer">
                <span class="product_price">$${product.price}</span>
                <div class="cart_button" title="Agregar al carrito" data-id=${product.id}>
                  <i class="ri-shopping-cart-2-fill"></i>
                </div>
              </div>
            </article>
          </div>`
        ).join('');

        new Swiper(".popular_swiper", {
          loop: true,
          autoplay: { delay: 3500, disableOnInteraction: false },
          slidesPerView: 1,
          spaceBetween: 20,
          breakpoints: {
            350: { slidesPerView: 2 },
            720: { slidesPerView: 3 },
            1023: { slidesPerView: 4 },
          },
          grabCursor: true,
        });
      }

      // Renderizar NEWS
      if (newsContainer && Array.isArray(newsData)) {
        newsContainer.innerHTML = newsData.map(product => 
          `<div class="swiper-slide">
            <article class="product_card">
              <a href="/src/perfume/?q=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer">
                <span class="product_price">$${product.price}</span>
                <div class="cart_button" title="Agregar al carrito" data-id=${product.id}>
                  <i class="ri-shopping-cart-2-fill"></i>
                </div>
              </div>
            </article>
          </div>`
        ).join('');

        new Swiper(".news_swiper", {
          loop: true,
          autoplay: { delay: 3500, disableOnInteraction: false },
          slidesPerView: 1,
          spaceBetween: 20,
          breakpoints: {
            350: { slidesPerView: 2 },
            720: { slidesPerView: 3 },
            1023: { slidesPerView: 4 },
          },
          grabCursor: true,
        });
      }
    })
    .catch(error => console.error('Fetch error:', error));
  };
})

/*=============== PAGE SECTIONS ACTIVE LINK ===============*/
const urlParam = new URLSearchParams(window.location.search);
const type = urlParam.get("q");

const setActiveLinkByQuery = () => {
  // If type param exists, activate corresponding link
  if (type) {
    const activeLink = document.querySelector(`.nav_menu a[href*="q=${type}"]`);
    if (activeLink) {
      activeLink.classList.add("active-link");
    }
  } else {
    const firstLink = document.querySelector('.nav_menu a');
    if (firstLink) {
      firstLink.classList.add('active-link');
    }
  }
};

// Run on page load
setActiveLinkByQuery();

/*=============== SEARCH INPUT ===============*/
// Algoritmo para tomar el valor del input y redireccionar
document.querySelector('#header-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const inputValue = document.getElementById('header-input').value.trim();
  if (inputValue) {
    window.location.href = `/src/productos/?q=${encodeURIComponent(inputValue)}&page=1`;
  }
});

/*=============== ADD / REMOVE TO CART FUNCTIONALITY + TOOLTIP UPDATE (FIXED) ===============*/
document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("button-tooltip");

  /** 🧮 Actualiza el contador visual del carrito */
  const updateCartTooltip = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemCount = cart.length;

    if (tooltip) {
      if (itemCount > 0) {
        tooltip.textContent = itemCount;
        tooltip.classList.add("tooltip-active");
      } else {
        tooltip.textContent = "";
        tooltip.classList.remove("tooltip-active");
      }
    }
  };

  /** 🎯 Marca los botones de carrito activos según el localStorage */
  const syncCartButtonStates = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartButtons = document.querySelectorAll(".cart_button");

    if (cartButtons.length === 0) {
      // Si aún no hay botones, reintentar después de un corto tiempo
      setTimeout(syncCartButtonStates, 100);
      // 👉 syncCartButtonStates() se ejecuta antes de que los productos se hayan renderizado en
      // el DOM, por eso los botones .cart_button aún no existen cuando se llama por primera vez, y
      // los estilos “in-cart” no se aplican hasta que ocurre una interacción.
      // Esto pasa normalmente si los productos se inyectan dinámicamente en el DOM después del
      // DOMContentLoaded (por ejemplo, desde otra función que los renderiza).
      return;
    }

    cartButtons.forEach((btn) => {
      const productId = btn.getAttribute("data-id");
      const exists = cart.some((item) => String(item.id) === String(productId));
      btn.classList.toggle("in-cart", exists);
    });
  };

  /** 🛒 Escuchar clics en botones de carrito */
  document.addEventListener("click", (e) => {
    const cartBtn = e.target.closest(".cart_button");
    if (cartBtn) {
      const productId = cartBtn.getAttribute("data-id");
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const product = products.find((p) => String(p.id) === String(productId));

      if (product) {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const index = cart.findIndex((item) => String(item.id) === String(productId));

        if (index === -1) {
          // 🟩 No existe → agregar al carrito
          cart.push(product);
          cartBtn.classList.add("in-cart");
        } else {
          // 🟥 Ya existe → eliminar del carrito
          cart.splice(index, 1);
          cartBtn.classList.remove("in-cart");
        }

        // Guardar cambios
        localStorage.setItem("cart", JSON.stringify(cart));

        // 🔄 Actualizar tooltip y estados
        updateCartTooltip();
        syncCartButtonStates();
      }
    }
  });

  // Ejecutar una vez al cargar
  updateCartTooltip();
  syncCartButtonStates();
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

setTimeout(() => {
  // Si aún no estan los componentes, reintentar después de un corto tiempo
  sr.reveal(`.perfume_img, .empty_cart-container`);
  sr.reveal(`.home_data, .perfume_data, .promo_card-normal`, { origin: "right" });
  sr.reveal(`.promo_card-large`,{ origin: "left" });
  sr.reveal(`.footer_container`,{ origin: "bottom" });
}, 100);
