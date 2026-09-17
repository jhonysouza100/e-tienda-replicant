window.addEventListener("DOMContentLoaded", () => {
  const pageContainer = document.getElementById("page-container");
  const emptyContainer = document.getElementById("empty-cart-container");

  const renderCart = () => {
    const cart = StoreCart.getCart();
    if (!pageContainer) return;
    pageContainer.innerHTML = "";
    if (emptyContainer) emptyContainer.innerHTML = "";

    if (cart.length === 0) {
      const emptyHTML = `
        <div class="empty_cart-container container section grid">
          <p class="empty_cart-msg">El carrito está vacío.</p>
          <a href="/src/" class="empty_cart-btn button" aria-label="Volver al inicio">
            <i class="home_button-circle"><span class="ri-arrow-left-s-line"></span></i>
            Volver al Inicio
          </a>
        </div>`;
      if (emptyContainer) emptyContainer.innerHTML = emptyHTML;
      else pageContainer.innerHTML = emptyHTML;
      return;
    }

    pageContainer.innerHTML = `
      <div class="cart_summary" aria-live="polite">
        ${cart.map((product) => {
          const minusDisabled = product.quantity <= product.minCant ? "disabled" : "";
          const plusDisabled = product.quantity + product.minCant > product.stock ? "disabled" : "";
          const subtotal = product.price * product.quantity;
          return `
            <article class="product_card" data-id="${product.id}">
              <a href="/src/perfume/?q=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product_img">
                <p class="product_name">${product.name}</p>
              </a>
              <div class="product_footer cart_item-footer">
                <div>
                  <span class="product_price">${StoreCart.formatPrice(product.price)} c/u</span>
                  <div class="cart_quantity" aria-label="Cantidad de ${product.name}">
                    <button type="button" class="cart_quantity-btn" data-action="decrease" data-id="${product.id}" ${minusDisabled} aria-label="Disminuir cantidad">-</button>
                    <span>${product.quantity}</span>
                    <button type="button" class="cart_quantity-btn" data-action="increase" data-id="${product.id}" ${plusDisabled} aria-label="Aumentar cantidad">+</button>
                  </div>
                </div>
                <div>
                  <strong>${StoreCart.formatPrice(subtotal)}</strong>
                  <button type="button" class="cart_remove" data-action="remove" data-id="${product.id}" title="Eliminar del carrito" aria-label="Eliminar ${product.name}">
                    <i class="ri-close-fill"></i>
                  </button>
                </div>
              </div>
            </article>`;
        }).join("")}
        <div class="cart_total"><span>Total</span><strong>${StoreCart.formatPrice(StoreCart.getCartTotal())}</strong></div>
        <a class="button cart_checkout" href="/src/checkout/">Continuar al checkout <i class="ri-arrow-right-line"></i></a>
      </div>`;
  };

  pageContainer?.addEventListener("click", (event) => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const { action, id } = control.dataset;
    if (action === "increase") StoreCart.updateCartItemQuantity(id, 1);
    if (action === "decrease") StoreCart.updateCartItemQuantity(id, -1);
    if (action === "remove") StoreCart.removeFromCart(id);
    renderCart();
  });

  renderCart();
});
