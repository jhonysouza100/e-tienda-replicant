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

  const readArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
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
  const saveCart = (cart) => localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart.map(normalizeCartItem)),
  );
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
  };
})();
