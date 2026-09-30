// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id"); // ej: /src/perfume/?id=123

/*=============== LOAD PRODUCT FROM LOCALSTORAGE ===============*/
window.addEventListener('DOMContentLoaded', async () => {
  const API_URL = 'https://restful-api-v4.vercel.app/api/v1/products';
  const pageContainer = document.getElementById('page-container');

  // Obtener productos del localStorage
  let products = StoreCart.getProducts();
  console.log("PRODUCTOS:", products)

  if (products.length === 0) {
    const response = await fetch(`${API_URL}?tenant_id=1&isActive=true&id=${id}`);
    data = (await response.json());
    products = data.data.map(StoreCart.normalizeProduct);
    StoreCart.saveProducts(products);
  }

  if (!Array.isArray(products) || products.length === 0) {
    console.error('No hay productos en localStorage');
    if (pageContainer) {
      pageContainer.innerHTML = `<p>El producto NO esta disponible.</p>`;
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

  const item = StoreCart.getCart().find((cartItem) => String(cartItem.id) === String(product.id));
  const quantity = item?.quantity || 0;
  const canIncrease = !item || quantity + product.minCant <= product.stock;
  const canDecrease = quantity > product.minCant;

  // Renderizar el componente con los datos del producto
  if (pageContainer) {
    pageContainer.innerHTML = `
      <div class="perfume_data" data-product-card data-id="${product.id}">
        <h2 class="perfume_subtitle">${product.brand || 'Marca desconocida'}</h2>
        <h1 class="perfume_title">
          ${product.name || 'Sin nombre'}
        </h1>
        <p class="perfume_description">
          ${product.description || 'Sin descripción disponible.'}
        </p>
        <div class="product_card-controls" data-cart-controls>
          <button class="button cart_quantity-btn" type="button" data-action="decrease" data-id="${product.id}" aria-label="Disminuir cantidad de ${product.name}" title="Disminuir cantidad de ${product.name}" ${!canDecrease ? "disabled" : ""}>-</button>
          <span data-cart-quantity>${quantity}</span>
          <button class="button cart_quantity-btn" type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar cantidad de ${product.name}" title="Aumentar cantidad de ${product.name}" ${!canIncrease ? "disabled" : ""}>+</button>
          <button type="button" class="perfume_button button" data-id="${product.id}" id="perfume-button" title="Agregar al carrito">
            COMPRAR AHORA
            <i class="ri-shopping-cart-line"></i>
          </button>
          </div>
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

      const exists = StoreCart.getCart().some(item => String(item.id) === String(productId));
      if (!exists) {
        StoreCart.addToCart(prod);
        perfumeButton.classList.add('in-cart');
        window.location.href = '/src/checkout/';
      } else {
        window.location.href = '/src/checkout/';
      }
    });
  }
});