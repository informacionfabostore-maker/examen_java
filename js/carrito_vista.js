(function () {
  class ShoppingCart extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-action]");
        if (!boton) return;

        this.dispatchEvent(
          new CustomEvent("carrito-accion", {
            bubbles: true,
            composed: true,
            detail: {
              action: boton.dataset.action,
              id: Number(boton.dataset.id)
            }
          })
        );
      });
    }

    mostrar(resumen) {
      const escapar = window.tienda.escaparHTML;
      const formato = window.tienda.formatearPrecio;
      const lineas = resumen.lineas.length
        ? resumen.lineas.map((linea) => `
            <li>
              <strong>${escapar(linea.name)}</strong>
              <p>${formato(linea.price)} × ${linea.cantidad} = ${formato(linea.subtotal)}</p>
              <button type="button" data-action="disminuir" data-id="${linea.id}" aria-label="Disminuir cantidad">−</button>
              <button type="button" data-action="aumentar" data-id="${linea.id}" aria-label="Aumentar cantidad">+</button>
              <button type="button" data-action="eliminar" data-id="${linea.id}">Eliminar</button>
            </li>
          `).join("")
        : "<li>El carrito está vacío.</li>";

      this.innerHTML = `
        <h2>Carrito (${resumen.unidades} unidades)</h2>
        <ul>${lineas}</ul>
        <p>Subtotal: ${formato(resumen.subtotal)}</p>
        <p>Descuento: −${formato(resumen.descuento)}</p>
        <p><strong>Total: ${formato(resumen.total)}</strong></p>
        <button type="button" data-action="vaciar" ${resumen.lineas.length ? "" : "disabled"}>
          Vaciar carrito
        </button>
      `;
    }
  }

  customElements.define("shopping-cart", ShoppingCart);
})();