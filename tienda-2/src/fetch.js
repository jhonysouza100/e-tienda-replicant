window.addEventListener("DOMContentLoaded", async function () {
  /*=============== LOAD DATA ===============*/
  /** ✅ FLAG: Solo se ejecuta en la ruta principal */
  const currentPath = window.location.pathname;
  const shouldLoadHome = currentPath === "/src/" || currentPath === "/src";

  if (shouldLoadHome) {
    /*=============== LOAD POPULAR & NEWS ===============*/
    const popularContainer = document.getElementById("popular-wrapper");
    const newsContainer = document.getElementById("news-wrapper");

    // Ejecuta ambos fetch en paralelo
    Promise.all([
      fetch("/public/static/popular.json").then((res) => {
        if (!res.ok)
          throw new Error("Error fetching products.json: " + res.status);
        return res.json();
      }),
      fetch("/public/static/news.json").then((res) => {
        if (!res.ok) throw new Error("Error fetching news.json: " + res.status);
        return res.json();
      }),
    ])
      .then(([popularData, newsData]) => {
        // Combinar ambos arrays sin repetir los id de los objetos
        const productos = [
          ...new Map(
            [...popularData, ...newsData].map((item) => [item.id, item]),
          ).values(),
        ].map(StoreCart.normalizeProduct);

        // Guardar en localStorage
        StoreCart.saveProducts(productos);

        /*
      const apiResponse = await fetch('https://restful-api-v4.vercel.app/api/v1/products?tenant_id=1&isActive=true&topic=popular');
      const apiProducts = await apiResponse.json();
      StoreCart.saveProducts(apiProducts.products || apiProducts);
      */

        // Renderizar POPULAR
        if (popularContainer && Array.isArray(popularData)) {
          popularContainer.innerHTML = popularData
            .map(
              (product) =>
                `<div class="swiper-slide">
            <article class="product_card">
              <a href="/src/perfume/?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer">
                <span class="product_price">${StoreCart.formatPrice(product.price)}</span>
                <div class="cart_button" title="Agregar al carrito" data-id=${product.id}>
                  <i class="ri-shopping-cart-2-fill"></i>
                </div>
              </div>
            </article>
          </div>`,
            )
            .join("");

          new Swiper(".popular_swiper", {
            loop: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
              350: { slidesPerView: 2 },
              720: { slidesPerView: 3 },
              1023: { slidesPerView: 4, loop: false },
            },
            grabCursor: true,
          });
        }

        // Renderizar NEWS
        if (newsContainer && Array.isArray(newsData)) {
          newsContainer.innerHTML = newsData
            .map(
              (product) =>
                `<div class="swiper-slide">
            <article class="product_card">
              <a href="/src/perfume/?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer">
                <span class="product_price">${StoreCart.formatPrice(product.price)}</span>
                <div class="cart_button" title="Agregar al carrito" data-id=${product.id}>
                  <i class="ri-shopping-cart-2-fill"></i>
                </div>
              </div>
            </article>
          </div>`,
            )
            .join("");

          new Swiper(".news_swiper", {
            loop: true,
            autoplay: { delay: 3500, disableOnInteraction: false },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
              350: { slidesPerView: 2 },
              720: { slidesPerView: 3 },
              1023: { slidesPerView: 4, loop: false },
            },
            grabCursor: true,
          });
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }

  /*=============== SWIPERJS HERO (statics) ===============*/
  let swiperHero = new Swiper(".hero_swiper", {
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    spaceBetween: 32,
    grabCursor: true,
    effect: "creative",
    creativeEffect: {
      prev: {
        translate: [-100, 0, -500],
        opacity: 0,
      },
      next: {
        translate: [100, 0, -500],
        opacity: 0,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  /*=============== SWIPERJS BRAND (statics) ===============*/
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
      },
    },
    grabCursor: true,
  });
});