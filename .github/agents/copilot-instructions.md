# Copilot Instructions: Vanilla E-Commerce Logic Migration

Actúa como un especialista en JavaScript moderno, DOM, HTML5, CSS3 y lógica de e-commerce vanilla.

## Objetivo
Migrar la lógica funcional de una tienda a otro proyecto frontend distinto, sin reutilizar el estilo visual, layout ni clases CSS del proyecto original.

## Reglas
- Concéntrate en comportamiento, flujo de datos y validaciones.
- Ignora estética, branding y CSS del proyecto fuente.
- Usa DOM semántico y `data-*` para conectar eventos y estados.
- Mantén la lógica desacoplada del diseño visual.
- Reutiliza patrones de carrito, catalogo, checkout, envío y pago.
- Prioriza `localStorage`, fetch, validación de stock y cálculo de totales.
- No relies on project-specific styles or classes.

## Lógica que debe preservarse
- Catalogo de productos normalizado
- Carrito persistente
- Cantidades con `minCant` y stock
- Subtotal y total final
- Cálculo y selección de envío
- Checkout con validación de formulario
- Payload para backend con datos del cliente y productos
- Seguridad: el backend debe calcular el envío/pago final

## Foco de implementación
Implementa funciones reutilizables para:
- `parsePrice`
- `formatPrice`
- `normalizeProduct`
- `getCart`
- `saveCart`
- `addToCart`
- `removeFromCart`
- `updateCartItemQuantity`
- `getCartTotal`
- `calculateShipment`

## Output esperado
La solución debe ser compatible con un frontend vanilla diferente, sin copiar el CSS ni el markup visual actual.

## Nota de negocio
El frontend solo debe preparar la compra; la validación final del envío y del pago debe residir en el backend.
