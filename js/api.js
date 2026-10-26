(function () {
  function validarCatalogo(productos) {
    if (!Array.isArray(productos) || productos.length < 12) {
      throw new Error("El catálogo debe contener al menos 12 productos.");
    }

    const identificadores = new Set();
    const categorias = new Set();

    productos.forEach((producto, indice) => {
      const esValido =
        producto &&
        Number.isInteger(producto.id) &&
        producto.id > 0 &&
        typeof producto.name === "string" &&
        producto.name.trim() !== "" &&
        typeof producto.category === "string" &&
        producto.category.trim() !== "" &&
        Number.isFinite(producto.price) &&
        producto.price > 0 &&
        Number.isInteger(producto.stock) &&
        producto.stock >= 0 &&
        typeof producto.description === "string" &&
        typeof producto.active === "boolean";

      if (!esValido) {
        throw new Error(`El producto en la posición ${indice + 1} tiene datos inválidos.`);
      }

      if (identificadores.has(producto.id)) {
        throw new Error(`El identificador ${producto.id} está duplicado en el catálogo.`);
      }

      identificadores.add(producto.id);
      categorias.add(producto.category);
    });

    if (categorias.size < 3) {
      throw new Error("El catálogo debe incluir al menos tres categorías.");
    }

    return productos;
  }

  async function cargarCatalogo() {
    let respuesta;

    try {
      respuesta = await fetch("products.json");
    } catch (error) {
      throw new Error("No se pudo consultar el catálogo. Verifica la conexión y vuelve a intentarlo.");
    }

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar el catálogo (HTTP ${respuesta.status}).`);
    }

    let productos;
    try {
      productos = await respuesta.json();
    } catch (error) {
      throw new Error("El catálogo no contiene un JSON válido.");
    }

    return validarCatalogo(productos);
  }

  window.catalogoApi = { cargarCatalogo };
})();