(() => {
  const CART_KEY = "cart";
  const PRODUCTS_KEY = "products";

  const parsePrice = (value) => {
    if (typeof value !== "string") return Number(value) || 0;
    const raw = value.trim();
    if (!raw) return 0;
    if (raw.includes(",") && raw.includes(".")) {
      return Number(raw.replace(/\./g, "").replace(",", ".")) || 0;
    }
    if (raw.includes(",")) return Number(raw.replace(",", ".")) || 0;
    if (raw.includes(".")) {
      const decimals = raw.slice(raw.lastIndexOf(".") + 1);
      if (decimals.length === 3) return Number(raw.replace(/\./g, "")) || 0;
    }
    return Number(raw) || 0;
  };

  const formatPrice = (value) => `$${parsePrice(value).toLocaleString("es-AR")}`;

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const renderCartTooltip = (root = document) => {
    const quantity = getCartQuantity();
    root.querySelectorAll("[data-cart-tooltip], #button-tooltip").forEach((tooltip) => {
      tooltip.textContent = quantity;
      tooltip.hidden = quantity === 0;
      tooltip.setAttribute("aria-label", `${quantity} productos en el carrito`);
    });
    return quantity;
  };

  const renderProductCard = (product) => {
    const normalized = normalizeProduct(product);
    const item = getCart().find((cartItem) => String(cartItem.id) === String(normalized.id));
    const quantity = item?.quantity || 0;
    const isInCart = Boolean(item);
    const canIncrease = !item || quantity + normalized.minCant <= normalized.stock;
    const canDecrease = quantity > normalized.minCant;

    return `
      <article class="product_card" data-product-card data-id="${escapeHTML(normalized.id)}">
        <a href="/src/perfume/?id=${encodeURIComponent(normalized.id)}">
          <img src="${escapeHTML(normalized.image)}" alt="${escapeHTML(normalized.name)}" class="product_img">
          <p class="product_name">${escapeHTML(normalized.name)}</p>
        </a>
        <div class="product_footer">
          <span class="product_price">${formatPrice(normalized.price)}</span>
          <div class="product_card-controls" data-cart-controls>
            <button class="button cart_quantity-btn" type="button" data-action="decrease" data-id="${escapeHTML(normalized.id)}" aria-label="Disminuir cantidad de ${escapeHTML(normalized.name)}" title="Disminuir cantidad de ${escapeHTML(normalized.name)}" ${!canDecrease ? "disabled" : ""}>-</button>
            <span data-cart-quantity>${quantity}</span>
            <button class="button cart_quantity-btn" type="button" data-action="increase" data-id="${escapeHTML(normalized.id)}" aria-label="Aumentar cantidad de ${escapeHTML(normalized.name)}" title="Aumentar cantidad de ${escapeHTML(normalized.name)}" ${!canIncrease ? "disabled" : ""}>+</button>
            <button class="button" type="button" data-action="toggle" data-id="${escapeHTML(normalized.id)}" aria-label="${isInCart ? "Eliminar" : "Agregar"} aria-label="Agregar/Quitar ${escapeHTML(normalized.name)}" title="Agregar/Quitar ${escapeHTML(normalized.name)}" ${escapeHTML(normalized.name)}" aria-pressed="${isInCart}">
              <i class="${isInCart ? "ri-close-line" : "ri-shopping-cart-2-line"}" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>`;
  };
  

  const readArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const notifyCartChange = () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("cartchange"));
  };

  const normalizeProduct = (product = {}) => ({
    ...product,
    id: product.id,
    name: product.name || "Producto",
    brand: product.brand || "",
    description: product.description || "",
    image: typeof product.image === "string" ? product.image : "",
    price: parsePrice(product.price),
    stock: Number(product.stock) > 0 ? Number(product.stock) : Infinity,
    minCant: Number(product.minCant || product.minCount) > 0
      ? Number(product.minCant || product.minCount)
      : 1,
    dimensions: product.dimensions || {},
  });

  const normalizeCartItem = (item) => {
    const product = normalizeProduct(item);
    const minCant = product.minCant;
    const stock = product.stock;
    const requested = Number(item.quantity);
    const quantity = Math.min(
      stock,
      Math.max(minCant, requested > 0 ? requested : minCant),
    );
    return { ...product, quantity };
  };

  const getCart = () => readArray(CART_KEY).map(normalizeCartItem);
  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart.map(normalizeCartItem)));
    notifyCartChange();
  };
  const getProducts = () => readArray(PRODUCTS_KEY).map(normalizeProduct);
  const saveProducts = (products) => localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(products.map(normalizeProduct)),
  );

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    const cart = getCart();
    const existing = cart.find((item) => String(item.id) === String(normalized.id));
    if (existing) {
      const next = Math.min(existing.stock, existing.quantity + existing.minCant);
      existing.quantity = next;
    } else {
      cart.push({ ...normalized, quantity: normalized.minCant });
    }
    saveCart(cart);
    return getCart();
  };

  const removeFromCart = (productId) => {
    const cart = getCart().filter((item) => String(item.id) !== String(productId));
    saveCart(cart);
    return cart;
  };

  const updateCartItemQuantity = (productId, delta) => {
    const cart = getCart();
    const item = cart.find((entry) => String(entry.id) === String(productId));
    if (!item) return cart;
    const next = item.quantity + delta * item.minCant;
    if (next < item.minCant) return removeFromCart(productId);
    if (next <= item.stock) item.quantity = next;
    saveCart(cart);
    return getCart();
  };

  const getCartTotal = () => getCart().reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const getCartQuantity = () => getCart().reduce((total, item) => total + item.quantity, 0);

  window.StoreCart = {
    CART_KEY,
    PRODUCTS_KEY,
    parsePrice,
    formatPrice,
    normalizeProduct,
    getCart,
    saveCart,
    getProducts,
    saveProducts,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartQuantity,
    renderCartTooltip,
    renderProductCard,
  };
})();
