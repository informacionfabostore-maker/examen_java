(function () {
  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, (caracter) => {
      const entidades = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entidades[caracter];
    });
  }

  window.tienda = {
    catalogo: [],
    productosVisibles: [],
    formatearPrecio,
    escaparHTML
  };
})();