# TecnoStock

Tienda web de suministros tecnológicos creada con HTML, CSS y JavaScript nativo. Permite consultar un catálogo local, filtrar productos, administrar un carrito y simular una compra.

## Cómo ejecutar

La aplicación obtiene los productos desde `data/products.json` mediante `fetch`, por lo que debe abrirse desde un servidor web local y no directamente como archivo `file://`.

1. Abre la carpeta del proyecto en Visual Studio Code.
2. Inicia `index.html` con la extensión **Live Server** (clic derecho → **Open with Live Server**).
3. Usa la tienda en la dirección local que abra el navegador.

No se necesita instalar dependencias ni ejecutar un proceso de compilación.

## Funcionalidades

- Carga de `data/products.json` mediante HTTP local, con validación de datos y mensajes de error.
- Búsqueda por nombre o descripción, sin distinguir mayúsculas y minúsculas.
- Filtros combinables por categoría y disponibilidad.
- Orden por precio, nombre o categoría, ascendente y descendente.
- Tarjetas de producto que muestran su precio, categoría y unidades disponibles.
- Carrito con agregar, aumentar, disminuir, eliminar y vaciar productos.
- Actualización inmediata de la disponibilidad y validación del inventario.
- Persistencia del carrito en `localStorage` del navegador.
- Subtotal, cantidad total, descuento del 10 % cuando el subtotal alcanza $300.000 COP y total final.
- Confirmación antes de procesar la compra; al aceptarla se muestra un resumen simulado y se vacía el carrito.
- Diseño adaptable a pantallas móviles y de escritorio.

La compra es una simulación local: no se conecta a una pasarela de pago ni a un servidor de inventario.

## Catálogo de productos

El archivo `products.json` debe contener un arreglo de al menos 12 productos, distribuidos en al menos 3 categorías. Cada producto usa esta estructura:

```json
{
  "id": 101,
  "name": "Teclado mecánico",
  "category": "Periféricos",
  "price": 189900,
  "stock": 8,
  "description": "Teclado USB para uso diario",
  "active": true
}
```

Reglas del catálogo:

- `id`: entero positivo y único.
- `name`, `category` y `description`: texto; nombre y categoría no pueden estar vacíos.
- `price`: número positivo, expresado en pesos colombianos.
- `stock`: entero igual o mayor que cero.
- `active`: valor booleano. Un producto solo se puede agregar si está activo y tiene existencias.

## Estructura del proyecto

```text
index.html       Estructura de la tienda y carga de scripts
css/
  styles.css     Estilos, paleta de colores y diseño adaptable
data/
  products.json  Datos del catálogo
js/
  app.js         Inicialización, filtros y flujo de compra
  api.js         Carga y validación del catálogo
  cart.js        Reglas del carrito, inventario y totales
  storage.js     Persistencia del carrito en localStorage
  components/
    product-card.js    Tarjeta de producto
    product-list.js    Lista del catálogo
    shopping-cart.js   Vista e interacción del carrito
```
