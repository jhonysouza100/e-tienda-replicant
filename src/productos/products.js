// Obtener los parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const topicQuery = params.get("topic");
  const nameQuery = params.get("name");

  /*=============== SET PAGE TITLE ===============*/
  const pageTitle = document.getElementById("page-title");
  
  // Si existe la query, mostrarla en el título
  if (topicQuery && pageTitle || nameQuery && pageTitle) {
    switch (topicQuery) {
      case "hombre":
        pageTitle.textContent = "Fragancias Masculinas";
        break;
      case "mujer":
        pageTitle.textContent = "Fragancias Femeninas";
        break;
      case "popular":
        pageTitle.textContent = "Perfumes Populares";
        break;
      default:
        pageTitle.textContent = `Buscar: ${decodeURIComponent(nameQuery)}`;
    }
  } else {
    pageTitle.textContent = "Producto no encontrado";
  }
  
  /*=============== LOAD PRODUCTS ===============*/
window.addEventListener('DOMContentLoaded', async function() {
  const API_URL = 'https://restful-api-v4.vercel.app/api/v1/products';
  try {
    let response = [];
    if(nameQuery) {
      response = await fetch(`${API_URL}?tenant_id=1&isActive=true&name=${nameQuery}`);
    } else {
      response = await fetch(`${API_URL}?tenant_id=1&isActive=true&topic=${topicQuery}`);
    }
    if (response.ok) {
      const data = (await response.json());
      const products = data.data.map(StoreCart.normalizeProduct);
      StoreCart.saveProducts(products);

      // Render product cards
      const pageContainer = document.getElementById('page-container');
      if (pageContainer && Array.isArray(data.data)) {
        pageContainer.innerHTML = products.map((product) => StoreCart.renderProductCard(product)).join('');
      }
    } else {
      console.error('Error fetching products.json:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
})
