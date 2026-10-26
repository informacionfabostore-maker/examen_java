(function () {
  const mensaje = document.getElementById("mensaje");
  const lista = document.getElementById("listaProductos");
  const carritoVista = document.getElementById("carrito");
  let carrito;

  function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.style.color = esError ? "red" : "green";
  }

  function aplicarFiltros() {
    const criterios = {
      busqueda: document.getElementById("buscar").value,
      categoria: document.getElementById("categoria").value,
      soloDisponibles: document.getElementById("disponibles").checked,
      orden: document.getElementById("orden").value
    };
    window.tienda.productosVisibles = window.filtrosTienda.filtrarProductos(
      window.tienda.catalogo,
      criterios
    );
    lista.mostrar(window.tienda.productosVisibles);
  }

  function actualizarCarrito() {
    carritoVista.mostrar(carrito.calcularResumen());
  }

  function ejecutarAccionCarrito(accion, id) {
    switch (accion) {
      case "aumentar":
        carrito.cambiarCantidad(id, 1);
        break;
      case "disminuir":
        carrito.cambiarCantidad(id, -1);
        break;
      case "eliminar":
        carrito.eliminar(id);
        break;
      case "vaciar":
        carrito.vaciar();
        break;
      default:
        throw new Error("La acción del carrito no es válida.");
    }
  }

  function conectarControles() {
    ["buscar", "categoria", "disponibles", "orden"].forEach((id) => {
      document.getElementById(id).addEventListener("input", aplicarFiltros);
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });

    lista.addEventListener("producto-agregar", (evento) => {
      try {
        carrito.agregar(evento.detail.id);
        actualizarCarrito();
        mostrarMensaje("Producto agregado al carrito.");
      } catch (error) {
        mostrarMensaje(error.message, true);
      }
    });

    carritoVista.addEventListener("carrito-accion", (evento) => {
      try {
        ejecutarAccionCarrito(evento.detail.action, evento.detail.id);
        actualizarCarrito();
        mostrarMensaje("Carrito actualizado.");
      } catch (error) {
        mostrarMensaje(error.message, true);
      }
    });

    document.addEventListener("confirmar-compra", () => {
      try {
        window.checkout.confirmarCompra(carrito);
        actualizarCarrito();
        mostrarMensaje("La compra se confirmó correctamente.");
      } catch (error) {
        mostrarMensaje(error.message, true);
      }
    });
  }

  async function inicializar() {
    mostrarMensaje("Cargando catálogo...");
    try {
      window.tienda.catalogo = await window.catalogoApi.cargarCatalogo();
      const selector = document.getElementById("categoria");
      [...new Set(window.tienda.catalogo.map((producto) => producto.category))]
        .sort((a, b) => a.localeCompare(b, "es"))
        .forEach((categoria) => {
          const opcion = document.createElement("option");
          opcion.value = categoria;
          opcion.textContent = categoria;
          selector.append(opcion);
        });

      carrito = new window.Carrito(window.tienda.catalogo);
      conectarControles();
      aplicarFiltros();
      actualizarCarrito();
      mostrarMensaje("Catálogo cargado correctamente.");
    } catch (error) {
      mostrarMensaje(error.message, true);
    }
  }

  document.addEventListener("DOMContentLoaded", inicializar);
})();