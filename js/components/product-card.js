(function () {
  class ProductCard extends HTMLElement {
    set producto(producto) {
      this._producto = producto;
      this.render();
    }

    render() {
      const producto = this._producto;
      if (!producto) return;

      const disponible = producto.active && producto.stock > 0;
      this.innerHTML = `
        <article class="producto">
          <p class="producto__categoria">${window.tienda.escaparHTML(producto.category)}</p>
          <h3>${window.tienda.escaparHTML(producto.name)}</h3>
          <p class="producto__descripcion">${window.tienda.escaparHTML(producto.description)}</p>
          <p class="producto__precio">${window.tienda.formatearPrecio(producto.price)}</p>
          <p class="producto__inventario">${disponible ? `Unidades disponibles: ${producto.stock}` : "No disponible"}</p>
          <button type="button" ${disponible ? "" : "disabled"}>Agregar al carrito</button>
        </article>
      `;

      this.querySelector("button").addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("producto-agregar", {
          bubbles: true,
          composed: true,
          detail: { id: producto.id }
        }));
      });
    }
  }

  customElements.define("product-card", ProductCard);
})();
