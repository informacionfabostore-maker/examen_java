(function () {
  const boton = document.getElementById("btnComprar");
  boton.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("confirmar-compra"));
  });
})();