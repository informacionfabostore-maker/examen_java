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
          <button type="button" ${disponible ? "" : "disabled"}>
            Agregar al carrito
          </button>
        </article>
      `;

      this.querySelector("button").addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("producto-agregar", {
            bubbles: true,
            composed: true,
            detail: { id: producto.id }
          })
        );
      });
    }
  }

  class ProductList extends HTMLElement {
    mostrar(productos) {
      this.replaceChildren();
      if (productos.length === 0) {
        this.textContent = "No se encontraron productos con esos filtros.";
        return;
      }

      productos.forEach((producto) => {
        const tarjeta = document.createElement("product-card");
        tarjeta.producto = producto;
        this.append(tarjeta);
      });
    }
  }

  customElements.define("product-card", ProductCard);
  customElements.define("product-list", ProductList);
})();