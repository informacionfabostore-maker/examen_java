(function () {
  const CLAVE_CARRITO = "tecnostock-carrito";

  window.almacenamientoCarrito = {
    leer: () => localStorage.getItem(CLAVE_CARRITO),
    guardar: (lineas) => localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas))
  };
})();
