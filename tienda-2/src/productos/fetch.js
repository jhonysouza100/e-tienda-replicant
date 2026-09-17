// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const query = params.get("q");

/*=============== LOAD PRODUCTS ===============*/
window.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('/public/static/productos.json');
    if (response.ok) {
      const data = await response.json();
      const products = data.map(StoreCart.normalizeProduct);
      StoreCart.saveProducts(products);

      /*
      const apiResponse = await fetch('https://restful-api-v4.vercel.app/api/v1/products?tenant_id=2');
      const apiPayload = await apiResponse.json();
      StoreCart.saveProducts(apiPayload.products || apiPayload);
      */

      // Render product cards
      const pageContainer = document.getElementById('page-container');
      if (pageContainer && Array.isArray(data)) {
        pageContainer.innerHTML = products.map(product => `
          <article class="product_card">
            <a href="/src/perfume/?q=${product.id}">
              <img src="${product.image}" alt="Perfume image ${product.id}" class="product_img">
              <p class="product_name">${product.name}</p>
            </a>
            <div class="product_footer">
              <span class="product_price">${StoreCart.formatPrice(product.price)}</span>
              <div class="cart_button" title="Agregar al carrito" data-id=${product.id}>
                <i class="ri-shopping-cart-2-fill"></i>
              </div>
            </div>
          </article>
        `).join('');
      }
    } else {
      console.error('Error fetching products.json:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
})

/*=============== SET PAGE TITLE ===============*/
const pageTitle = document.getElementById("page-title");

// Si existe la query, mostrarla en el título
if (query && pageTitle) {
  switch (query) {
    case "men":
      pageTitle.textContent = "Fragancias Masculinas";
      break;
    case "women":
      pageTitle.textContent = "Fragancias Femeninas";
      break;
    case "popular":
      pageTitle.textContent = "Perfumes Populares";
      break;
    default:
      pageTitle.textContent = `Buscar: ${decodeURIComponent(query)}`;
  }
} else {
  pageTitle.textContent = "Producto no encontrado";
}