(function () {
  const boton = document.getElementById("btnComprar");
  boton.addEventListener("click", () => {
    const confirmado = window.confirm(
      "¿Estás seguro de confirmar tu compra? Esta acción vaciará el carrito."
    );
    if (!confirmado) return;

    document.dispatchEvent(new CustomEvent("confirmar-compra"));
  });
})();