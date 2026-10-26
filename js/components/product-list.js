(function () {
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

  customElements.define("product-list", ProductList);
})();
