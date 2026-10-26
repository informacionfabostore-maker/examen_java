(function () {
  function filtrarProductos(productos, criterios) {
    const termino = criterios.busqueda.trim().toLocaleLowerCase("es");
    let resultado = productos.filter((producto) => {
      const coincideTexto =
        !termino ||
        producto.name.toLocaleLowerCase("es").includes(termino) ||
        producto.description.toLocaleLowerCase("es").includes(termino);
      const coincideCategoria =
        !criterios.categoria || producto.category === criterios.categoria;
      const estaDisponible = producto.active && producto.stock > 0;

      return (
        coincideTexto &&
        coincideCategoria &&
        (!criterios.soloDisponibles || estaDisponible)
      );
    });

    const compararTexto = (a, b) => a.localeCompare(b, "es", { sensitivity: "base" });
    const ordenes = {
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      "nombre-asc": (a, b) => compararTexto(a.name, b.name),
      "nombre-desc": (a, b) => compararTexto(b.name, a.name),
      "categoria-asc": (a, b) =>
        compararTexto(a.category, b.category) || compararTexto(a.name, b.name),
      "categoria-desc": (a, b) =>
        compararTexto(b.category, a.category) || compararTexto(a.name, b.name)
    };

    resultado.sort(ordenes[criterios.orden] || (() => 0));

    return resultado;
  }

  window.filtrosTienda = { filtrarProductos };
})();