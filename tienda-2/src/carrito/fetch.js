/*=============== LOAD PRODUCTS FROM LOCALSTORAGE CART + REMOVE ITEM ===============*/
window.addEventListener("DOMContentLoaded", function () {
  const pageContainer = document.getElementById("page-container");

  /** 🧮 Función para renderizar el contenido del carrito */
  const renderCart = () => {
    try {
      const cartData = localStorage.getItem("cart");
      const data = cartData ? JSON.parse(cartData) : [];

      const emptyCartContainer = document.getElementById("empty-cart-container");

      if (!pageContainer) return;

      // 🧹 Siempre limpiar ambos contenedores antes de renderizar
      pageContainer.innerHTML = "";
      if (emptyCartContainer) emptyCartContainer.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        // 🛍️ Renderizar productos del carrito
        pageContainer.innerHTML = data
          .map(
            (product) => `
            <article class="product_card" data-id="${product.id}">
              <a href="/src/perfume/?q=${product.id}">
                <img src="${product.image}" alt="Perfume image ${product.id}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer">
                <span class="product_price">$${product.price}</span>
                <div class="cart_remove" title="Eliminar del carrito" data-id="${product.id}">
                  <i class="ri-close-fill"></i>
                </div>
              </div>
            </article>
          `
          )
          .join("");
      } else {
        // 🕳️ Carrito vacío
        const emptyHTML = `
          <div class="empty_cart-container container section grid">
            <p class="empty_cart-msg">El carrito está vacío.</p>
            <a href="/src/" class="empty_cart-btn button" aria-label="return">
              <i class="home_button-circle">
                <span class="ri-arrow-left-s-line"></span>
              </i>
              Volver al Inicio
            </a>
          </div>
        `;

        if (emptyCartContainer) {
          emptyCartContainer.innerHTML = emptyHTML;
        } else {
          // Si no existe el contenedor, mostrar dentro del principal
          pageContainer.innerHTML = emptyHTML;
        }
      }
    } catch (error) {
      console.error("Error al cargar los productos desde el carrito:", error);
    }
  };


  /** 🗑️ Eliminar producto del carrito */
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart_remove");
    if (removeBtn) {
      const productId = removeBtn.getAttribute("data-id");

      // Eliminar del localStorage
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart = cart.filter((item) => String(item.id) !== String(productId));
      localStorage.setItem("cart", JSON.stringify(cart));

      // Volver a renderizar el carrito (DOM + mensaje vacío si corresponde)
      renderCart();
    }
  });

  // 🚀 Renderizar al cargar la página
  renderCart();
});