// ================================================
// DOM.jquery.js - Versión unificada completa (con jQuery)
// ================================================

// ---------- 1) DATOS DE PRODUCTOS ----------
const productos = {
  pro1: {
    id: "pro1",
    nombre: "Jeans Sueltos Negros",
    precio: 65.0,
    imagenes: ["img/products/pro1.jpg"],
    color: "Negro clásico",
    tallas: ["S", "M", "L", "XL", "XXL"],
  },
  pro2: {
    id: "pro2",
    nombre: "Superman Cut-Off",
    precio: 40.0,
    imagenes: ["img/products/pro2.jpg"],
    color: "Azul",
    tallas: ["S", "M", "L"],
  },
  pro3: {
    id: "pro3",
    nombre: "Pantalones Deportivos Grises",
    precio: 35.0,
    imagenes: ["img/products/pro3.jpg"],
    color: "Gris",
    tallas: ["M", "L", "XL"],
  },
  pro4: {
    id: "pro4",
    nombre: "Mineral Hoodie",
    precio: 52.0,
    imagenes: ["img/products/pro4.jpg"],
    color: "Gris",
    tallas: ["S", "M", "L", "XL"],
  },
  pro5: {
    id: "pro5",
    nombre: "Gorra Americana",
    precio: 22.0,
    imagenes: ["img/products/pro5.jpg"],
    color: "Negro",
    tallas: ["Única"],
  },
};

// ---------- 2) LISTA DE PRODUCTOS PRINCIPALES ----------
const prds = [
  { id: "1", title: "Zapatos deportivos Puma", marca: "Puma", price: 69.99, img: "img/products/zapatospuma.jpg" },
  { id: "2", title: "Bolso Puma Unicolor", marca: "Puma", price: 49.99, img: "img/products/bolso.jpg" },
  { id: "3", title: "Reloj Elegante Casio", marca: "Casio", price: 42.99, img: "img/products/reloj.jpg" },
  { id: "4", title: "Perfume 212 VIP MEN", marca: "Carolina Herrera", price: 79.99, img: "img/products/perfume.jpg" },
  { id: "5", title: "Camiseta Nike Deportiva", marca: "Nike", price: 17.99, img: "img/products/camiseta.jpg" },
  { id: "6", title: "Vestido Celeste", marca: "Talismán", price: 25.0, img: "img/products/vestido.webp" },
  { id: "7", title: "Zapatillas elegantes punta cerrada", marca: "Gabriela's Shoes", price: 29.99, img: "img/products/zapatillas.webp" },
  { id: "8", title: "Cadena de oro para mujer", marca: "Baliq Joyerías", price: 220.0, img: "img/products/collar.jpg" },
];

// ---------- 3) FUNCIONES DE CARRITO ----------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("carrito", JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  const $count = $("#cart-count");
  if ($count.length) $count.text(cart.length);
}

// ---------- 4) RENDERIZAR PRODUCTOS EN INDEX ----------
$(function () {
  const $container = $("#products-items");
  if (!$container.length) return;

  prds.forEach((p) => {
    const html = `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <img src="${p.img}" class="card-img-top" alt="${p.title}">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="fw-bold">${p.title}</h5>
              <div class="text-warning mb-2">⭐⭐⭐⭐⭐</div>
              <h4 class="fw-bold text-success mb-3">$${p.price.toFixed(2)}</h4>
            </div>
            <button class="btn btn-outline-success w-100 buy-now" data-id="${p.id}">Ir a la tienda</button>
          </div>
        </div>
      </div>`;
    $container.append(html);
  });
});

// Delegado: click en "Comprar ahora" (navega a detalle)
$(document).on("click", ".buy-now", function () {
  const id = $(this).data("id");
  window.location.href = `tienda.html`;
});

// ---------- 5) DETALLE DE PRODUCTO ----------
$(function () {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (!id) return;

  if (!String(id).startsWith("pro")) id = "pro" + id;
  const p = productos[id];
  if (!p) return;

  const $imgMain = $("#producto-imagen");
  const $miniaturas = $("#miniaturas");
  const $tallas = $("#tallas");

  $("#producto-nombre").text(p.nombre);
  $("#producto-precio").text(`$${p.precio.toFixed(2)}`);

  const $colorEl = $("#producto-color");
  if ($colorEl.length) $colorEl.text(p.color);

  if ($imgMain.length) $imgMain.attr("src", p.imagenes[0]);

  if ($miniaturas.length) {
    $miniaturas.html(
      p.imagenes
        .map((img) => `<img src="${img}" class="miniatura rounded" width="70" />`)
        .join("")
    );
  }

  if ($tallas.length) {
    $tallas.html(p.tallas.map((t) => `<button class="btn-talla">${t}</button>`).join(""));
  }

  // Cambio de miniatura
  $(document).on("click", ".miniatura", function () {
    const src = $(this).attr("src");
    if ($imgMain.length) $imgMain.attr("src", src);
  });

  // Selección de talla
  $(document).on("click", ".btn-talla", function () {
    $(".btn-talla").removeClass("selected");
    $(this).addClass("selected");
  });

  // Botón agregar al carrito (detalle de producto)
  const $addBtn = $(".btn-comprar");
  if ($addBtn.length) {
    $addBtn.data("id", id);
    $addBtn.on("click", function () {
      let cart = getCart();
      const item = cart.find((c) => c.id === id);
      if (item) item.cantidad++;
      else cart.push({ id, cantidad: 1 });
      saveCart(cart);
      updateCartCount();
      alert("✅ Producto agregado al carrito");
    });
  }
});

// ===== TIENDA: manejar "Añadir al carrito" en las cards =====
$(document).on("click", ".add-to-cart", function (e) {
  e.preventDefault();

  const $btn = $(this);
  const id = $btn.data("id");
  const nombre = $btn.data("nombre");
  const precio = parseFloat($btn.data("precio"));
  const img = $btn.data("img");

  let cart = getCart();
  const item = cart.find((p) => p.id === id);

  if (item) item.cantidad++;
  else cart.push({ id, cantidad: 1, nombre, precio, img });

  saveCart(cart);
  updateCartCount();

  const old = $btn.text();
  $btn.prop("disabled", true).text("Añadido ✓");
  setTimeout(() => {
    $btn.prop("disabled", false).text(old);
  }, 900);
});
// Render de productos en la página tienda
$(function () {
  const $grid = $("#grid-tienda");
  if (!$grid.length) return;

  const cards = Object.values(productos).map(p => `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card h-100 text-center">
        <a href="producto.html?id=${p.id}" class="text-decoration-none text-dark">
          <img src="${p.imagenes[0]}" class="card-img-top" alt="${p.nombre}">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p>$${p.precio.toFixed(2)}</p>
          </div>
        </a>
        <div class="card-footer bg-transparent border-0">
          <button 
            class="btn btn-comprar add-to-cart"
            data-id="${p.id}"
            data-nombre="${p.nombre}"
            data-precio="${p.precio}"
            data-img="${p.imagenes[0]}">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  `).join("");

  $grid.html(cards);
});

// ---------- 6) RENDERIZAR CARRITO ----------
function renderCart() {
  const $table = $("#cart-table");
  if (!$table.length) return;

  const $tbody = $table.find("tbody");
  const $totalEl = $("#total");
  $tbody.empty();

  let total = 0;
  const cart = getCart();

  cart.forEach((item) => {
    const p = productos[item.id];
    if (!p) return;
    const subtotal = p.precio * item.cantidad;
    total += subtotal;

    $tbody.append(`
      <tr>
        <td><img src="${p.imagenes[0]}" width="60"></td>
        <td>${p.nombre}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-secondary decrease" data-id="${item.id}">-</button>
          <span class="mx-2">${item.cantidad}</span>
          <button class="btn btn-sm btn-secondary increase" data-id="${item.id}">+</button>
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm remove" data-id="${item.id}">X</button></td>
      </tr>
    `);
  });

  if ($totalEl.length) $totalEl.text(total.toFixed(2));
}
$(function () {
  renderCart();
});

// ---------- 7) EVENTOS CARRITO ----------
$(document).on("click", ".increase, .decrease, .remove", function () {
  const id = $(this).data("id");
  let cart = getCart();

  if ($(this).hasClass("increase")) {
    const item = cart.find((p) => p.id === id);
    if (item) item.cantidad++;
  } else if ($(this).hasClass("decrease")) {
    const item = cart.find((p) => p.id === id);
    if (item) {
      item.cantidad--;
      if (item.cantidad <= 0) cart = cart.filter((p) => p.id !== id);
    }
  } else if ($(this).hasClass("remove")) {
    cart = cart.filter((p) => p.id !== id);
  } else {
    return;
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
});

// ---------- 8) FINALIZAR COMPRA ----------
$(document).on("click", "#btnFinalizarCompra", function () {
  const $form = $("#compraForm");
  if (!$form.length) return;

  // checkValidity con jQuery: usar el DOM nativo
  const formEl = $form.get(0);
  if (!formEl.checkValidity()) {
    formEl.reportValidity();
    return;
  }

  const $modalBody = $(".modal-body");
  const $modalFooter = $(".modal-footer");

  $form.hide();
  $modalBody.html(`<p class="text-center fw-bold">Procesando...</p>`);
  $modalFooter.hide();

  setTimeout(() => {
    localStorage.removeItem("carrito");
    updateCartCount();
    renderCart();
    $modalBody.html(`
      <div class="text-center">
        <h4 class="text-success fw-bold">✅ Compra exitosa</h4>
        <p>Gracias por tu compra</p>
      </div>
    `);
    $modalFooter.html(`<button class="btn btn-success" data-bs-dismiss="modal">Finalizar</button>`).show();
  }, 1500);
});

// Mantener contador actualizado al cargar
$(function () {
  updateCartCount();
  console.log("✅ DOM (jQuery) combinado cargado correctamente");
});

// ---------- 9) ABRIR MODAL DE COMPRA DESDE EL CARRITO ----------
$(document).on("click", "#checkout-btn", function () {
  const cart = getCart();
  if (!cart.length) {
    alert("🛒 Tu carrito está vacío. Agrega productos antes de continuar.");
    return;
  }

  const modalEl = document.getElementById("formCompra");
  if (!modalEl) {
    console.warn("⚠️ No se encontró el modal #formCompra en esta página.");
    return;
  }
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});









//-------------------------------------------------------------------------------------------------

$(document).ready(function() {

  // Interceptar el envío del formulario
  $("#form").on("submit", function(event) {
    event.preventDefault();

    // Obtener valores de los campos
    const nombre = $("#nombre").val().trim();
    const cedula = $("#cedula").val().trim();
    const telefono = $("#telefono").val().trim();
    const ciudad = $("#ciudad").val().trim();
    const correo = $("#correo").val()?.trim(); // opcional si agregas campo email

    // Validar campos vacíos
    if (!nombre || !cedula || !telefono || !ciudad) {
      mostrarAlerta("Por favor completa todos los campos antes de enviar.", "warning");
      return;
    }

    // Validar correo si existe el campo
    if (correo && !correo.includes("@")) {
      mostrarAlerta("Por favor ingresa un correo válido con '@'.", "danger");
      return;
    }

    // Si todo es válido, mostrar animación de éxito
    mostrarAnimacionExito();
  });

  // Función para mostrar alertas Bootstrap dinámicamente
  function mostrarAlerta(mensaje, tipo) {
    const alerta = $(`
      <div class="alert alert-${tipo} alert-dismissible fade show mt-3" role="alert">
        <i class="fa-solid fa-circle-exclamation me-2"></i>${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `);

    // Insertar debajo del formulario
    $("#form").prepend(alerta);

    // Desaparecer después de 4s
    setTimeout(() => alerta.alert('close'), 4000);
  }

  // Función animación de éxito
  function mostrarAnimacionExito() {
    // Desactivar botón temporalmente
    const boton = $("#form button[type='submit']");
    boton.prop("disabled", true).text("Enviando...");

    // Simular envío (2s)
    setTimeout(() => {
      boton.prop("disabled", false).text("Enviar mensaje");

      // Mostrar mensaje animado con Bootstrap
      const exito = $(`
        <div class="alert alert-success fade show mt-3 text-center" role="alert">
          <i class="fa-solid fa-circle-check me-2"></i>
          ¡Tu solicitud fue enviada correctamente y pronto nos comunicaremos contigo!
        </div>
      `);

      $("#form").prepend(exito);
      exito.hide().fadeIn(500);

      // Limpiar formulario
      $("#form")[0].reset();

      // Animar desaparición
      setTimeout(() => exito.fadeOut(600, () => exito.remove()), 3500);
    }, 2000);
  }

});
