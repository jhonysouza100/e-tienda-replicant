window.addEventListener("DOMContentLoaded", async function () {
  const API_URL = 'https://restful-api-v4.vercel.app/api/v1/products';
  /*=============== LOAD DATA ===============*/
  /** ✅ FLAG: Solo se ejecuta en la ruta principal */
  const currentPath = window.location.pathname;
  const shouldLoadHome = currentPath === "/src/" || currentPath === "/src" || currentPath === "/src#";

  if (shouldLoadHome) {
    /*=============== LOAD POPULAR & NEWS ===============*/
    const popularContainer = document.getElementById("popular-wrapper");
    const newsContainer = document.getElementById("news-wrapper");

    // Ejecuta ambos fetch en paralelo
    Promise.all([
      fetch(`${API_URL}?tenant_id=1&isActive=true&limit=6&topic=popular`).then((res) => {
        if (!res.ok)
          throw new Error("Error fetching products.json: " + res.status);
        return res.json();
      }),
      fetch(`${API_URL}?tenant_id=1&isActive=true&limit=6&topic=new`).then((res) => {
        if (!res.ok) throw new Error("Error fetching news.json: " + res.status);
        return res.json();
      }),
    ])
      .then(([popularData, newsData]) => {
        // Combinar ambos arrays sin repetir los id de los objetos
        const productos = [
          ...new Map(
            [...popularData.data, ...newsData.data].map((item) => [item.id, item]),
          ).values(),
        ];
        
        // Guardar en localStorage
        StoreCart.saveProducts(productos);

        // Renderizar POPULAR
        if (popularContainer && Array.isArray(popularData.data)) {
          popularContainer.innerHTML = popularData.data
            .map((product) => `<div class="swiper-slide">${StoreCart.renderProductCard(product)}</div>`)
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
        if (newsContainer && Array.isArray(newsData.data)) {
          newsContainer.innerHTML = newsData.data
            .map((product) => `<div class="swiper-slide">${StoreCart.renderProductCard(product)}</div>`)
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