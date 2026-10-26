(function () {
  const CLAVE_CARRITO = "tecnostock-carrito";
  const UMBRAL_DESCUENTO = 300000;
  const PORCENTAJE_DESCUENTO = 0.1;

  class Carrito {
    constructor(catalogo) {
      this.catalogo = catalogo;
      this.lineas = this.leerPersistencia();
    }

    leerPersistencia() {
      const guardado = localStorage.getItem(CLAVE_CARRITO);
      if (guardado === null) return [];

      let lineas;
      try {
        lineas = JSON.parse(guardado);
      } catch (error) {
        throw new Error("Los datos guardados del carrito están dañados. Borra los datos del sitio para continuar.");
      }

      if (!Array.isArray(lineas)) {
        throw new Error("Los datos guardados del carrito no tienen un formato válido.");
      }

      const identificadores = new Set();
      lineas.forEach((linea) => {
        if (!linea || !Number.isInteger(linea.id) || !Number.isInteger(linea.cantidad)) {
          throw new Error("El carrito guardado contiene productos o cantidades inválidas.");
        }
        const producto = this.obtenerProducto(linea.id);
        if (
          identificadores.has(linea.id) ||
          !Number.isInteger(linea.cantidad) ||
          linea.cantidad < 1 ||
          linea.cantidad > producto.stock ||
          !producto.active ||
          producto.stock === 0
        ) {
          throw new Error("El carrito guardado contiene productos o cantidades inválidas.");
        }
        identificadores.add(linea.id);
      });

      return lineas;
    }

    obtenerProducto(id) {
      const producto = this.catalogo.find((item) => item.id === id);
      if (!producto) throw new Error("El producto no existe en el catálogo actual.");
      return producto;
    }

    guardar() {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.lineas));
    }

    agregar(id, cantidad = 1) {
      const producto = this.obtenerProducto(id);
      if (!producto.active || producto.stock < 1) {
        throw new Error("No se pueden agregar productos inactivos o agotados.");
      }
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw new Error("La cantidad debe ser un entero mayor o igual a 1.");
      }

      const linea = this.lineas.find((item) => item.id === id);
      const nuevaCantidad = (linea ? linea.cantidad : 0) + cantidad;
      if (nuevaCantidad > producto.stock) {
        throw new Error(`Solo hay ${producto.stock} unidades disponibles de ${producto.name}.`);
      }

      if (linea) {
        linea.cantidad = nuevaCantidad;
      } else {
        this.lineas.push({ id, cantidad });
      }
      this.guardar();
    }

    cambiarCantidad(id, cambio) {
      if (!Number.isInteger(cambio) || Math.abs(cambio) !== 1) {
        throw new Error("El cambio de cantidad debe ser de una unidad.");
      }
      const linea = this.lineas.find((item) => item.id === id);
      if (!linea) throw new Error("El producto no está en el carrito.");

      const nuevaCantidad = linea.cantidad + cambio;
      if (nuevaCantidad < 1) {
        throw new Error("La cantidad no puede ser menor que 1. Elimina el producto si ya no lo necesitas.");
      }

      const producto = this.obtenerProducto(id);
      if (nuevaCantidad > producto.stock) {
        throw new Error(`Solo hay ${producto.stock} unidades disponibles de ${producto.name}.`);
      }

      linea.cantidad = nuevaCantidad;
      this.guardar();
    }

    eliminar(id) {
      const lineasActualizadas = this.lineas.filter((linea) => linea.id !== id);
      if (lineasActualizadas.length === this.lineas.length) {
        throw new Error("El producto no está en el carrito.");
      }
      this.lineas = lineasActualizadas;
      this.guardar();
    }

    vaciar() {
      this.lineas = [];
      this.guardar();
    }

    calcularResumen() {
      const lineas = this.lineas.map((linea) => {
        const producto = this.obtenerProducto(linea.id);
        return {
          id: producto.id,
          name: producto.name,
          price: producto.price,
          cantidad: linea.cantidad,
          subtotal: producto.price * linea.cantidad
        };
      });
      const subtotal = lineas.reduce((suma, linea) => suma + linea.subtotal, 0);
      const descuento = subtotal >= UMBRAL_DESCUENTO
        ? Math.round(subtotal * PORCENTAJE_DESCUENTO)
        : 0;

      return {
        lineas,
        unidades: lineas.reduce((suma, linea) => suma + linea.cantidad, 0),
        subtotal,
        descuento,
        total: subtotal - descuento
      };
    }
  }

  window.Carrito = Carrito;
})();