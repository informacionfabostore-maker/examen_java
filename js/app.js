(function () {
  function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(valor);
  }

  function escaparHTML(valor) {
    const entidades = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(valor).replace(/[&<>"']/g, (caracter) => entidades[caracter]);
  }

  function filtrarProductos(productos, criterios) {
    const termino = criterios.busqueda.trim().toLocaleLowerCase("es");
    const texto = (valor) => valor.toLocaleLowerCase("es");
    const comparar = (a, b) => a.localeCompare(b, "es", { sensitivity: "base" });
    const ordenes = {
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      "nombre-asc": (a, b) => comparar(a.name, b.name),
      "nombre-desc": (a, b) => comparar(b.name, a.name),
      "categoria-asc": (a, b) => comparar(a.category, b.category) || comparar(a.name, b.name),
      "categoria-desc": (a, b) => comparar(b.category, a.category) || comparar(a.name, b.name)
    };

    return productos
      .filter((producto) => {
        const coincideTexto = !termino ||
          texto(producto.name).includes(termino) ||
          texto(producto.description).includes(termino);
        const disponible = producto.active && producto.stock > 0;
        return coincideTexto &&
          (!criterios.categoria || producto.category === criterios.categoria) &&
          (!criterios.soloDisponibles || disponible);
      })
      .sort(ordenes[criterios.orden] || (() => 0));
  }

  function validarCarrito(carrito) {
    if (carrito.lineas.length === 0) {
      throw new Error("Agrega productos al carrito antes de confirmar la compra.");
    }
    carrito.lineas.forEach((linea) => {
      const producto = carrito.obtenerProducto(linea.id);
      if (
        !producto.active ||
        producto.stock < 1 ||
        !Number.isInteger(linea.cantidad) ||
        linea.cantidad < 1 ||
        linea.cantidad > producto.stock
      ) {
        throw new Error(`La cantidad o disponibilidad de ${producto.name} cambió. Revisa el carrito.`);
      }
    });
  }

  function confirmarCompra(carrito) {
    validarCarrito(carrito);
    const resumen = carrito.calcularResumen();
    const idPedido = window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `PED-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const lineas = resumen.lineas.map((linea) => `
      <li class="comprobante__linea">
        <div class="comprobante__producto">
          <strong>${escaparHTML(linea.name)}</strong>
          <span>${linea.cantidad} × ${formatearPrecio(linea.price)}</span>
        </div>
        <strong class="comprobante__subtotal">${formatearPrecio(linea.subtotal)}</strong>
      </li>
    `).join("");
    const contenido = `
      <article class="comprobante" aria-labelledby="tituloComprobante">
        <div class="comprobante__encabezado">
          <div>
            <p class="comprobante__etiqueta">Comprobante de compra</p>
            <h2 id="tituloComprobante">¡Gracias por tu compra!</h2>
            <p class="comprobante__pedido">Pedido <strong>${escaparHTML(idPedido)}</strong></p>
          </div>
          <span class="comprobante__estado">✓ Confirmada</span>
        </div>
        <section class="comprobante__detalle" aria-label="Productos comprados">
          <h3>Productos <span>${resumen.unidades} unidades</span></h3>
          <ul>${lineas}</ul>
        </section>
        <dl class="comprobante__totales">
          <div><dt>Subtotal</dt><dd>${formatearPrecio(resumen.subtotal)}</dd></div>
          <div><dt>Descuento</dt><dd>−${formatearPrecio(resumen.descuento)}</dd></div>
          <div class="comprobante__total"><dt>Total pagado</dt><dd>${formatearPrecio(resumen.total)}</dd></div>
        </dl>
      </article>
    `;

    carrito.vaciar();
    const resumenCompra = document.getElementById("resumenCompra");
    resumenCompra.innerHTML = contenido;
    resumenCompra.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const mensaje = document.getElementById("mensaje");
  const lista = document.getElementById("listaProductos");
  const carritoVista = document.getElementById("carrito");
  let carrito;

  window.tienda = { catalogo: [], productosVisibles: [], formatearPrecio, escaparHTML };

  function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("mensaje--error", esError);
    mensaje.classList.toggle("mensaje--exito", !esError);
  }

  function aplicarFiltros() {
    const criterios = {
      busqueda: document.getElementById("buscar").value,
      categoria: document.getElementById("categoria").value,
      soloDisponibles: document.getElementById("disponibles").checked,
      orden: document.getElementById("orden").value
    };
    const productos = window.tienda.catalogo.map((producto) => ({
      ...producto,
      stock: carrito.stockDisponible(producto.id)
    }));
    window.tienda.productosVisibles = filtrarProductos(productos, criterios);
    lista.mostrar(window.tienda.productosVisibles);
  }

  function actualizarCarrito() {
    carritoVista.mostrar(carrito.calcularResumen());
    aplicarFiltros();
  }

  function ejecutarAccionCarrito({ action, id }) {
    const acciones = {
      aumentar: () => carrito.cambiarCantidad(id, 1),
      disminuir: () => carrito.cambiarCantidad(id, -1),
      eliminar: () => carrito.eliminar(id),
      vaciar: () => carrito.vaciar()
    };
    if (!acciones[action]) throw new Error("La acción del carrito no es válida.");
    acciones[action]();
  }

  function conectarControles() {
    ["buscar", "categoria", "disponibles", "orden"].forEach((id) => {
      const control = document.getElementById(id);
      control.addEventListener("input", aplicarFiltros);
      control.addEventListener("change", aplicarFiltros);
    });

    lista.addEventListener("producto-agregar", ({ detail }) => {
      try {
        carrito.agregar(detail.id);
        actualizarCarrito();
        mostrarMensaje("Producto agregado al carrito.");
      } catch (error) {
        mostrarMensaje(error.message, true);
      }
    });

    carritoVista.addEventListener("carrito-accion", (evento) => {
      try {
        ejecutarAccionCarrito(evento.detail);
        actualizarCarrito();
        mostrarMensaje("Carrito actualizado.");
      } catch (error) {
        mostrarMensaje(error.message, true);
      }
    });

    document.getElementById("btnComprar").addEventListener("click", () => {
      if (!window.confirm("¿Estás seguro de confirmar tu compra? Esta acción vaciará el carrito.")) return;
      try {
        confirmarCompra(carrito);
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
      actualizarCarrito();
      mostrarMensaje("Catálogo cargado correctamente.");
    } catch (error) {
      mostrarMensaje(error.message, true);
    }
  }

  document.addEventListener("DOMContentLoaded", inicializar);
})();
