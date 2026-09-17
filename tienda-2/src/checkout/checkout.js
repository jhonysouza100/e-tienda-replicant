window.addEventListener("DOMContentLoaded", () => {
  const API = "https://restful-api-v4.vercel.app/api/v1";
  const form = document.getElementById("shipping-form");
  const itemsEl = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  const messageEl = document.getElementById("form-message");
  const provinceEl = document.getElementById("provinceCode");
  const agencyField = document.getElementById("agency-field");
  const agencyEl = document.getElementById("agency");
  const postalField = document.getElementById("postal-field");
  const postalEl = document.getElementById("postalCode");
  const deliveryField = document.getElementById("delivery-field");
  const deliveryEl = document.getElementById("deliveryMethod");
  const homeFields = document.getElementById("home-fields");
  const submitEl = document.getElementById("submit-btn");
  const shipmentPanel = document.getElementById("shipment-panel");
  const modal = document.getElementById("payment-modal");
  const closeModal = document.getElementById("payment-close");
  let agencies = [];
  let shipmentOptions = [];

  const setMessage = (text, type = "") => {
    messageEl.textContent = text;
    messageEl.className = type;
  };

  const renderCart = () => {
    const cart = StoreCart.getCart();
    if (!cart.length) {
      itemsEl.innerHTML = "<p>Tu carrito está vacío. <a href='/src/'>Volver a la tienda</a></p>";
      submitEl.disabled = true;
      return;
    }
    itemsEl.innerHTML = cart.map((item) => `
      <article class="checkout_item">
        <img src="${item.image}" alt="${item.name}">
        <div><p>${item.name}</p><small>${item.quantity} x ${StoreCart.formatPrice(item.price)}</small></div>
        <strong>${StoreCart.formatPrice(item.price * item.quantity)}</strong>
      </article>`).join("");
    totalEl.textContent = StoreCart.formatPrice(StoreCart.getCartTotal());
  };

  const selectedAgency = () => agencies[Number(agencyEl.value)] || null;
  const resetDelivery = () => {
    agencyEl.innerHTML = '<option value="">Seleccioná una sucursal</option>';
    agencyEl.disabled = true;
    deliveryEl.value = "";
    deliveryEl.disabled = true;
    agencyField.hidden = true;
    postalField.hidden = true;
    deliveryField.hidden = true;
    homeFields.hidden = true;
    document.getElementById("address").required = false;
    document.getElementById("streetNumber").required = false;
  };

  provinceEl.addEventListener("change", async () => {
    resetDelivery();
    setMessage("Cargando sucursales...");
    try {
      const response = await fetch(`${API}/shipments/micorreo/agencies?provinceCode=${encodeURIComponent(provinceEl.value)}`);
      if (!response.ok) throw new Error("agencies");
      const data = await response.json();
      agencies = (Array.isArray(data) ? data.flat() : []).filter((agency) => agency?.status === "ACTIVE");
      localStorage.setItem("agencies", JSON.stringify(agencies));
      agencies.sort((a, b) => (a.location?.address?.city || "").localeCompare(b.location?.address?.city || "", "es"));
      agencies.forEach((agency, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${agency.location?.address?.city || "Ciudad"} - ${agency.name || "Sucursal"}`;
        agencyEl.appendChild(option);
      });
      agencyField.hidden = agencies.length === 0;
      agencyEl.disabled = agencies.length === 0;
      if (!agencies.length) setMessage("No hay sucursales disponibles.", "error");
      else setMessage("");
    } catch {
      agencies = [];
      setMessage("No pudimos cargar las sucursales.", "error");
    }
  });

  agencyEl.addEventListener("change", () => {
    const agency = selectedAgency();
    if (!agency) return;
    postalEl.value = agency.location?.address?.postalCode?.match(/\d+/g)?.join("") || "";
    postalField.hidden = false;
    deliveryField.hidden = false;
    deliveryEl.disabled = false;
    setMessage("");
  });

  deliveryEl.addEventListener("change", () => {
    const isHome = deliveryEl.value === "domicilio";
    homeFields.hidden = !isHome;
    document.getElementById("address").required = isHome;
    document.getElementById("streetNumber").required = isHome;
    submitEl.disabled = !form.checkValidity();
  });

  const dimensions = () => StoreCart.getCart().reduce((result, item) => {
    const d = item.dimensions || {};
    const quantity = item.quantity || item.minCant || 1;
    result.volume += (Number(d.width) || 1) * (Number(d.height) || 1) * (Number(d.length) || 1) * quantity;
    result.weight += (Number(d.weight) || 1) * quantity;
    return result;
  }, { volume: 0, weight: 0 });

  const calculateShipment = async () => {
    const { volume, weight } = dimensions();
    const side = Math.max(1, Math.ceil(Math.cbrt(volume)));
    const response = await fetch(`${API}/shipments/micorreo/rates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postalCodeDestination: postalEl.value, dimensions: { weight: Math.ceil(weight), height: side, width: side, length: side } }),
    });
    if (!response.ok) throw new Error("rates");
    const data = await response.json();
    shipmentOptions = Array.isArray(data.rates) ? data.rates : [];
    if (!shipmentOptions.length) throw new Error("empty-rates");
    const selectedType = deliveryEl.value === "sucursal" ? "S" : "D";
    const option = shipmentOptions.find((rate) => String(rate.deliveredType || rate.deliveryType).toUpperCase() === selectedType);
    if (!option) throw new Error("method-rate");
    shipmentPanel.innerHTML = `<div class="shipment_option"><span>Envío estimado</span><strong>${StoreCart.formatPrice(option.price)}</strong></div>`;
    return option;
  };

  const createPayment = async (shipment) => {
    const data = new FormData(form);
    const agency = selectedAgency();
    const pickup = data.get("deliveryMethod") === "sucursal";
    const payload = {
      items: StoreCart.getCart().map((item) => ({ item_id: Number(item.id), quantity: item.quantity })),
      payment: { method: "Mercadopago" },
      shipment: {
        deliveredType: pickup ? "S" : "D",
        pickupLocation: pickup ? agency?.code || "" : "",
        fullName: data.get("fullName"), dni: data.get("dni"), phone: data.get("phone"), email: data.get("email"),
        streetName: pickup ? agency?.location?.address?.streetName || "" : data.get("address"),
        streetNumber: pickup ? agency?.location?.address?.streetNumber || "" : data.get("streetNumber"),
        city: agency?.location?.address?.city || "",
        provinceCode: data.get("provinceCode"), postalCodeDestination: data.get("postalCodeDestination"),
      },
    };
    const response = await fetch(`${API}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("order");
    const result = await response.json();
    const preferenceId = result.payment?.preference_id;
    document.getElementById("payment-summary").textContent = `Subtotal ${StoreCart.formatPrice(StoreCart.getCartTotal())} + envío ${StoreCart.formatPrice(shipment.price)}`;
    modal.hidden = false;
    if (preferenceId && window.MercadoPago) {
      const mp = new MercadoPago("APP_USR-e8aac406-e839-47f9-9865-b6b0874b9b2d", { locale: "es-AR" });
      const bricks = mp.bricks();
      await bricks.create("wallet", "walletBrick_container", { initialization: { preferenceId }, customization: { texts: { valueProp: "security_safety" } } });
    }
  };

  form.addEventListener("input", () => { submitEl.disabled = !form.checkValidity(); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    submitEl.disabled = true;
    setMessage("Calculando envío...");
    try {
      const shipment = await calculateShipment();
      setMessage("Pedido preparado. Generando pago...", "success");
      await createPayment(shipment);
    } catch (error) {
      console.error(error);
      setMessage("No pudimos calcular el envío o preparar el pago. Intentá nuevamente.", "error");
      submitEl.disabled = false;
    }
  });

  closeModal.addEventListener("click", () => { modal.hidden = true; });
  renderCart();
});
