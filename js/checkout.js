(function () {
  function validarCarrito(carrito) {
    if (carrito.lineas.length === 0) {
      throw new Error("Agrega productos al carrito antes de confirmar la compra.");
    }

    carrito.lineas.forEach((linea) => {
      const producto = carrito.obtenerProducto(linea.id);
      if (
        !producto.active ||
        producto.stock < 1 ||
        !Number.isInteger(linea.cantidad) ||
        linea.cantidad < 1 ||
        linea.cantidad > producto.stock
      ) {
        throw new Error(`La cantidad o disponibilidad de ${producto.name} cambió. Revisa el carrito.`);
      }
    });
  }

  function generarIdPedido() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `PED-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function confirmarCompra(carrito) {
    validarCarrito(carrito);
    const resumen = carrito.calcularResumen();
    const idPedido = generarIdPedido();
    const escapar = window.tienda.escaparHTML;
    const formato = window.tienda.formatearPrecio;
    const lineas = resumen.lineas.map((linea) => `
      <li>${escapar(linea.name)} — ${linea.cantidad} × ${formato(linea.price)}
      = ${formato(linea.subtotal)}</li>
    `).join("");
    const contenido = `
      <h2>Compra confirmada</h2>
      <p>Pedido: <strong>${escapar(idPedido)}</strong></p>
      <ul>${lineas}</ul>
      <p>Subtotal: ${formato(resumen.subtotal)}</p>
      <p>Descuento: −${formato(resumen.descuento)}</p>
      <p><strong>Total: ${formato(resumen.total)}</strong></p>
    `;

    carrito.vaciar();
    document.getElementById("resumenCompra").innerHTML = contenido;
    return idPedido;
  }

  window.checkout = { confirmarCompra };
})();