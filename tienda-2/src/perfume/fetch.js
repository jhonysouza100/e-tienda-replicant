// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("q"); // ej: /src/perfume/?q=123

/*=============== LOAD PRODUCT FROM LOCALSTORAGE ===============*/
window.addEventListener('DOMContentLoaded', () => {
  const pageContainer = document.getElementById('page-container');

  // Obtener productos del localStorage
  const products = JSON.parse(localStorage.getItem('products') || '[]');

  if (!Array.isArray(products) || products.length === 0) {
    console.error('No hay productos en localStorage');
    if (pageContainer) {
      pageContainer.innerHTML = `<p>No hay productos disponibles.</p>`;
    }
    return;
  }

  // Buscar el producto por ID (asegúrate que los IDs coincidan en tipo)
  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    console.warn('Producto no encontrado con ID:', id);
    if (pageContainer) {
      pageContainer.innerHTML = `<p>Producto no encontrado.</p>`;
    }
    return;
  }

  // Renderizar componente con los datos del producto
  if (pageContainer) {
    pageContainer.innerHTML = `
      <div class="perfume_data">
        <h2 class="perfume_subtitle">${product.brand || 'Marca desconocida'}</h2>
        <h1 class="perfume_title">
          ${product.name || 'Sin nombre'}
        </h1>
        <p class="perfume_description">
          ${product.description || 'Sin descripción disponible.'}
        </p>
        <a href="/src/carrito" class="perfume_button button" data-id="${product.id}"  id="perfume-button" title="Agregar al carrito">
          COMPRAR AHORA
          <i class="ri-shopping-cart-line"></i>
        </a>
      </div>

      <div class="perfume_images">
        <div class="perfume_circle"></div>
        <div class="perfume_swiper">
          <article class="perfume_article swiper-slide">
            <img src="${product.image}" alt="${product.name}" class="perfume_img">
          </article>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <div class="perfume_social">
      </div>
    `;
  }

  // ---------------------------
  // Seleccionar el botón y agregar listener
  // ---------------------------
  const perfumeButton = document.getElementById('perfume-button');
  if (perfumeButton) {
    perfumeButton.addEventListener('click', (evt) => {
      // Evitar que el <a> navegue inmediatamente
      evt.preventDefault();

      const productId = perfumeButton.getAttribute('data-id');
      const productsList = JSON.parse(localStorage.getItem('products') || '[]');
      const prod = productsList.find(p => String(p.id) === String(productId));

      if (!prod) {
        console.warn('No se encontró el producto en localStorage.products:', productId);
        return;
      }

      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Si no existe en el carrito, agregar
      const exists = cart.some(item => String(item.id) === String(productId));
      if (!exists) {
        cart.push(prod);
        localStorage.setItem('cart', JSON.stringify(cart));
        perfumeButton.classList.add('in-cart');
        window.location.href = '/src/carrito/?q=cart';
      } else {
        // Si el producto ya esta en el carrito, solo redirecciona
        window.location.href = '/src/carrito/?q=cart';
      }
    });
  }
});