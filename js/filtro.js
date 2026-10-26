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

    if (criterios.orden === "asc") {
      resultado = resultado.sort((a, b) => a.price - b.price);
    } else if (criterios.orden === "desc") {
      resultado = resultado.sort((a, b) => b.price - a.price);
    }

    return resultado;
  }

  window.filtrosTienda = { filtrarProductos };
})();