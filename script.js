const STORAGE_KEY = "refill-inventory-v2";

/* =========================================================
   DATOS INICIALES
========================================================= */

const starterItems = [
  {
    id: 1,
    icon: "🥛",
    name: "Leche entera",
    detail: "Sula · 1 litro",
    qty: 2,
    price: 63,
    fresh: "Vence en 5 días",
    level: 72
  },
  {
    id: 2,
    icon: "🥚",
    name: "Huevos",
    detail: "Cartón de 12",
    qty: 12,
    price: 68,
    fresh: "Vence en 12 días",
    level: 88
  },
  {
    id: 3,
    icon: "🥑",
    name: "Aguacates",
    detail: "Unidad",
    qty: 3,
    price: 54,
    fresh: "Usar pronto",
    level: 35
  },
  {
    id: 4,
    icon: "🌿",
    name: "Culantro",
    detail: "Mazo fresco",
    qty: 1,
    price: 12,
    fresh: "Usar en 3 días",
    level: 28
  },
  {
    id: 5,
    icon: "🍅",
    name: "Tomates",
    detail: "Libra",
    qty: 4,
    price: 28,
    fresh: "Vence en 6 días",
    level: 60
  }
];

let items = loadItems();
let currentTab = "home";
let selectedRecipe = null;

const view = document.querySelector("#view");
const overlay = document.querySelector("#overlay");
const receiptInput = document.querySelector("#receiptInput");

/* =========================================================
   RECETAS
========================================================= */

const recipeCatalog = [
  {
    icon: "🍳",
    name: "Omelette de aguacate",
    time: "15 min",
    level: "Fácil",
    ingredients: ["huevos", "aguacate", "culantro"],
    prices: {
      huevos: 68,
      aguacate: 18,
      culantro: 12
    }
  },
  {
    icon: "🍝",
    name: "Pasta cremosa con tomate",
    time: "25 min",
    level: "Intermedio",
    ingredients: ["pasta", "tomate", "crema", "leche"],
    prices: {
      pasta: 38,
      tomate: 28,
      crema: 47,
      leche: 32
    }
  },
  {
    icon: "🥗",
    name: "Ensalada fresca de pollo",
    time: "20 min",
    level: "Fácil",
    ingredients: ["pollo", "tomate", "aguacate", "culantro"],
    prices: {
      pollo: 96,
      tomate: 28,
      aguacate: 18,
      culantro: 12
    }
  },
  {
    icon: "🍚",
    name: "Arroz salteado con vegetales",
    time: "30 min",
    level: "Fácil",
    ingredients: ["arroz", "huevos", "tomate", "cebolla"],
    prices: {
      arroz: 43,
      huevos: 12,
      tomate: 14,
      cebolla: 16
    }
  }
];

/* =========================================================
   SUPERMERCADOS
========================================================= */

const stores = [
  {
    name: "La Colonia",
    logo: "assets/la-colonia.jpg",
    time: "40–55 min",
    shipping: 45,
    base: 276,
    url: "https://www.lacolonia.com/"
  },
  {
    name: "Diprova",
    logo: "assets/diprova.jpg",
    time: "45–60 min",
    shipping: 55,
    base: 269,
    url: "https://diprova.com/"
  },
  {
    name: "Walmart",
    logo: "assets/walmart.png",
    time: "50–70 min",
    shipping: 59,
    base: 291,
    url: "https://www.walmartcentroamerica.com/"
  },
  {
    name: "Paiz",
    logo: "assets/paiz.png",
    time: "45–65 min",
    shipping: 52,
    base: 283,
    url: "https://www.walmartcentroamerica.com/"
  },
  {
    name: "Más x Menos",
    logo: "assets/mas-x-menos.jpg",
    time: "35–50 min",
    shipping: 49,
    base: 284,
    url: "https://www.walmartcentroamerica.com/",
    regional: true
  }
];

/* =========================================================
   STORAGE
========================================================= */

function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return Array.isArray(saved) && saved.length
      ? saved
      : starterItems.map(item => ({ ...item }));
  } catch (error) {
    return starterItems.map(item => ({ ...item }));
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* =========================================================
   UTILIDADES
========================================================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return Number(value || 0).toFixed(2);
}

function total() {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );
}

function units() {
  return items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/* =========================================================
   EMOJIS DE PRODUCTOS 🥛🥑🍅
========================================================= */

function iconFor(name) {
  const n = normalize(name);

  const icons = [
    [["leche", "crema", "yogur", "yogurt"], "🥛"],
    [["huevo", "huevos"], "🥚"],
    [["aguacate", "aguacates"], "🥑"],
    [["culantro", "cilantro", "perejil"], "🌿"],
    [["tomate", "tomates"], "🍅"],
    [["arroz"], "🍚"],
    [["pollo", "pechuga"], "🍗"],
    [["carne", "res"], "🥩"],
    [["pan", "bimbo"], "🍞"],
    [["pasta", "espagueti"], "🍝"],
    [["cebolla", "cebollas"], "🧅"],
    [["papa", "papas"], "🥔"],
    [["banano", "banana", "platano", "plátano"], "🍌"],
    [["manzana", "manzanas"], "🍎"],
    [["queso"], "🧀"],
    [["cafe", "café"], "☕"],
    [["agua", "jugo", "refresco"], "🧃"],
    [["fresa", "fresas"], "🍓"],
    [["naranja", "naranjas"], "🍊"],
    [["limon", "limón"], "🍋"],
    [["uva", "uvas"], "🍇"],
    [["piña", "pina"], "🍍"],
    [["sandia", "sandía"], "🍉"],
    [["zanahoria", "zanahorias"], "🥕"],
    [["brocoli", "brócoli"], "🥦"],
    [["lechuga"], "🥬"],
    [["maiz", "maíz"], "🌽"],
    [["pepino"], "🥒"],
    [["ajo"], "🧄"],
    [["mantequilla"], "🧈"],
    [["galleta", "galletas"], "🍪"],
    [["chocolate"], "🍫"],
    [["cereal"], "🥣"],
    [["pescado", "tilapia", "salmon", "salmón"], "🐟"],
    [["camaron", "camarón"], "🍤"]
  ];

  const found = icons.find(([words]) =>
    words.some(word => n.includes(normalize(word)))
  );

  return found ? found[1] : "🛒";
}

/* =========================================================
   LISTA DE INVENTARIO
========================================================= */

function itemList(list, editable) {
  if (!list.length) {
    return `
      <div class="scan-note">
        No hay productos que coincidan.
        Puedes agregarlos manualmente.
      </div>
    `;
  }

  return `
    <div class="item-list">

      ${list.map(item => `
        <article class="item">

          <span class="food-icon">
            ${escapeHTML(item.icon)}
          </span>

          <div class="item-info">

            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <small>
              ${escapeHTML(item.detail)} · L ${money(item.price)}
            </small>

            <div class="fresh-row">

              <span class="${item.level < 40 ? "danger" : "ok"}">
                ${escapeHTML(item.fresh)}
              </span>

              <span class="bar">
                <i style="width:${Number(item.level || 75)}%"></i>
              </span>

            </div>

          </div>

          <div class="qty">
            <b>${escapeHTML(item.qty)}</b>
            <small>unid.</small>
          </div>

          ${
            editable
              ? `
                <button
                  class="edit-button"
                  data-edit="${item.id}"
                  aria-label="Editar producto"
                >
                  •••
                </button>
              `
              : ""
          }

        </article>
      `).join("")}

    </div>
  `;
}

/* =========================================================
   HOME
========================================================= */

function home() {
  return `
    <section class="hero">

      <span class="eyebrow">
        TU COCINA, MÁS INTELIGENTE
      </span>

      <h1>
        Hola, Elo 👋
      </h1>

      <p>
        Convierte tu factura en un inventario editable.
      </p>

      <button class="scan-card scan-trigger">

        <span class="scan-icon">▣</span>

        <span class="scan-copy">
          <strong>Escanear factura</strong>
          <small>
            Reconocimiento inteligente de productos y precios
          </small>
        </span>

        <span class="arrow">›</span>

      </button>

    </section>

    <section class="content">

      <div class="summary-row">

        <div class="summary">

          <span class="summary-icon">▦</span>

          <div>
            <b>${units()}</b>
            <small>unidades registradas</small>
          </div>

        </div>

        <div class="summary">

          <span class="summary-icon blue">L</span>

          <div>
            <b>${money(total())}</b>
            <small>valor estimado</small>
          </div>

        </div>

      </div>

      <div class="section-heading">

        <div>
          <span class="eyebrow dark">
            INVENTARIO RECIENTE
          </span>

          <h2>Lo que tienes en casa</h2>
        </div>

        <button data-go="inventory">
          Ver todo
        </button>

      </div>

      ${itemList(items.slice(0, 3), false)}

      <button
        class="recipe-teaser"
        data-go="recipes"
      >

        <span class="spark">✦</span>

        <span>
          <small>IDEAS CON LO QUE TIENES</small>
          <strong>
            Recetas calculadas con tu inventario
          </strong>
        </span>

        <span>›</span>

      </button>

      <button
        class="daily-tip"
        data-go="tips"
      >

        <span>🌿</span>

        <div>
          <small>TIP DEL DÍA</small>
          <b>
            Haz que tu culantro dure hasta 2 semanas
          </b>
        </div>

        <span>›</span>

      </button>

    </section>
  `;
}

/* =========================================================
   INVENTARIO
========================================================= */

function inventory() {
  return `
    <section class="screen">

      <span class="eyebrow dark">
        MI COCINA
      </span>

      <div class="screen-title">

        <div>
          <h1>Inventario</h1>

          <p>
            ${items.length} tipos de productos ·
            L ${money(total())}
          </p>
        </div>

        <button
          class="add-button"
          data-add
        >
          ＋
        </button>

      </div>

      <div class="search">

        <span>⌕</span>

        <input
          id="search"
          placeholder="Buscar un producto"
        >

      </div>

      <div class="filter-row">

        <button
          class="selected"
          data-filter="all"
        >
          Todos
        </button>

        <button data-filter="soon">
          Por vencer
        </button>

        <button data-filter="scan">
          De factura
        </button>

      </div>

      <div id="inventoryList">
        ${itemList(items, true)}
      </div>

      <button
        class="manual-add"
        data-add
      >
        ＋ Agregar producto manualmente
      </button>

    </section>
  `;
}

/* =========================================================
   RECETAS
========================================================= */

function recipeAnalysis(recipe) {
  const names = items.map(
    item => normalize(item.name)
  );

  const missing = recipe.ingredients.filter(
    ingredient =>
      !names.some(name =>
        name.includes(normalize(ingredient))
      )
  );

  const cost = missing.reduce(
    (sum, ingredient) =>
      sum + (recipe.prices[ingredient] || 25),
    0
  );

  const compatible = Math.round(
    (
      (recipe.ingredients.length - missing.length) /
      recipe.ingredients.length
    ) * 100
  );

  return {
    ...recipe,
    missing,
    cost,
    compatible
  };
}

function recipeView() {
  const recipes = recipeCatalog
    .map(recipeAnalysis)
    .sort((a, b) => b.compatible - a.compatible);

  return `
    <section class="screen">

      <span class="eyebrow dark">
        SUGERENCIAS INTELIGENTES
      </span>

      <div class="screen-title">

        <div>
          <h1>¿Qué cocinamos? 🍳</h1>
          <p>
            Ideas recalculadas con tu inventario
          </p>
        </div>

        <span class="ai-badge">
          ✦ IA
        </span>

      </div>

      <div class="prompt-box">

        <span>✦</span>

        <div>
          <b>Personaliza las sugerencias</b>
          <small>
            Rápido, saludable o con pocos ingredientes
          </small>
        </div>

        <button id="aiSend">
          Mezclar
        </button>

      </div>

      <div class="filter-row">
        <button class="selected">Para hoy</button>
        <button>15 min</button>
        <button>Saludable</button>
      </div>

      <div class="recipe-list">

        ${recipes.map(recipe => `
          <article class="recipe-card">

            <div class="recipe-art">

              ${recipe.icon}

              <span>
                ${recipe.compatible}% compatible
              </span>

            </div>

            <div class="recipe-body">

              <small>
                ${recipe.time} · ${recipe.level}
              </small>

              <h3>
                ${escapeHTML(recipe.name)}
              </h3>

              <p class="${recipe.missing.length ? "danger" : "ok"}">

                ${
                  recipe.missing.length
                    ? `
                      ＋ Faltan ${recipe.missing.length}:
                      ${escapeHTML(recipe.missing.join(", "))}
                      · aprox. L ${money(recipe.cost)}
                    `
                    : "✓ Tienes todo"
                }

              </p>

              ${
                recipe.missing.length
                  ? `
                    <button
                      data-recipe="${escapeHTML(recipe.name)}"
                    >
                      Comparar lo que falta →
                    </button>
                  `
                  : ""
              }

            </div>

          </article>
        `).join("")}

      </div>

    </section>
  `;
}

/* =========================================================
   DELIVERY
========================================================= */

function delivery() {
  const originalRecipe = selectedRecipe
    ? recipeCatalog.find(
        recipe => recipe.name === selectedRecipe
      ) || recipeCatalog[1]
    : recipeCatalog[1];

  const recipe = recipeAnalysis(originalRecipe);

  const missingText = recipe.missing.length
    ? recipe.missing.join(" · ")
    : "Tu inventario ya está completo";

  const estimate = recipe.cost || 78;

  return `
    <section class="screen">

      <span class="eyebrow dark">
        DELIVERY
      </span>

      <div class="screen-title">

        <div>
          <h1>Completa tu receta 🛒</h1>
          <p>
            Compara precios estimados y elige una tienda
          </p>
        </div>

        <span class="ai-badge">
          ${recipe.missing.length}
        </span>

      </div>

      <div class="shopping-summary">

        <span>🛍️</span>

        <div>
          <b>
            ${recipe.missing.length}
            ingredientes por conseguir
          </b>

          <small>
            ${escapeHTML(missingText)}
          </small>
        </div>

        <strong>
          aprox. L ${money(estimate)}
        </strong>

      </div>

      <div class="location">

        <span>📍</span>

        <div>
          <small>ENTREGAR EN</small>

          <b id="deliveryAddress">
            Tegucigalpa, Francisco Morazán
          </b>
        </div>

        <button id="changeLocation">
          Cambiar
        </button>

      </div>

      <div class="store-heading">

        <h2>
          Elige tu supermercado
        </h2>

        <small>
          Referencia de productos + envío
        </small>

      </div>

      <div class="store-list">

        ${stores.map((store, index) => `
          <article class="store">

            <img
              class="store-logo"
              src="${store.logo}"
              alt="Logo de ${escapeHTML(store.name)}"
            >

            <div>

              <b>
                ${escapeHTML(store.name)}
              </b>

              <small>
                ${store.time} ·
                Envío L ${store.shipping}
              </small>

              ${
                store.regional
                  ? `
                    <small class="regional">
                      Opción regional · Costa Rica
                    </small>
                  `
                  : ""
              }

            </div>

            <strong>
              L ${money(
                store.base +
                estimate +
                index * 3
              )}
            </strong>

            <button
              class="choose-store"
              data-store="${escapeHTML(store.name)}"
              data-url="${store.url}"
            >
              Elegir
            </button>

          </article>
        `).join("")}

      </div>

    </section>
  `;
}

/* =========================================================
   TIPS
========================================================= */

function tips() {
  const more = [
    [
      "🥑",
      "Aguacate sin oscurecerse",
      "Añade unas gotas de limón y cúbrelo sin dejar aire.",
      "2–3 días"
    ],
    [
      "🍅",
      "Tomates con mejor sabor",
      "Déjalos fuera del refrigerador con el tallo hacia abajo.",
      "5–7 días"
    ],
    [
      "🥬",
      "Hojas verdes crujientes",
      "Envuélvelas en papel absorbente dentro de un recipiente.",
      "7–10 días"
    ],
    [
      "🍞",
      "Pan fresco por más tiempo",
      "Congélalo en porciones y tuéstalo directamente al usarlo.",
      "Hasta 3 meses"
    ]
  ];

  return `
    <section class="screen">

      <span class="eyebrow dark">
        CERO DESPERDICIO
      </span>

      <div class="screen-title">

        <div>
          <h1>Conserva mejor 🌿</h1>

          <p>
            Consejos prácticos para tus alimentos
          </p>
        </div>

        <span class="leaf-badge">
          🌱
        </span>

      </div>

      <div class="tip-feature">

        <small>
          RECOMENDADO PARA TU INVENTARIO
        </small>

        <h2>
          Tu culantro necesita atención
        </h2>

        <p>
          Corta apenas la base, ponlo en un vaso con
          2 cm de agua y cúbrelo con una bolsa floja
          antes de refrigerar. Cambia el agua cada dos días.
        </p>

        <div class="tip-result">
          <b>Resultado</b>
          <span>
            Puede durar hasta 2 semanas ✨
          </span>
        </div>

      </div>

      <h2 class="more-title">
        Más consejos para ti
      </h2>

      <div class="tips-list">

        ${more.map(tip => `
          <article class="tip-card">

            <span>
              ${tip[0]}
            </span>

            <div>
              <h3>${tip[1]}</h3>
              <p>${tip[2]}</p>
              <small>${tip[3]}</small>
            </div>

          </article>
        `).join("")}

      </div>

    </section>
  `;
}

/* =========================================================
   RENDER
========================================================= */

function render() {
  const pages = {
    home,
    inventory,
    recipes: recipeView,
    delivery,
    tips
  };

  view.innerHTML = pages[currentTab]();

  document
    .querySelectorAll(".bottom-nav [data-tab]")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.tab === currentTab
      );
    });

  bindView();
}

function go(tab) {
  currentTab = tab;

  window.scrollTo(0, 0);

  render();
}

/* =========================================================
   EVENTOS
========================================================= */

function bindView() {
  document
    .querySelectorAll("[data-go]")
    .forEach(el => {
      el.onclick = () =>
        go(el.dataset.go);
    });

  document
    .querySelectorAll(".scan-trigger")
    .forEach(el => {
      el.onclick = () =>
        receiptInput.click();
    });

  document
    .querySelectorAll("[data-add]")
    .forEach(el => {
      el.onclick = () =>
        openEditor();
    });

  document
    .querySelectorAll("[data-edit]")
    .forEach(el => {
      el.onclick = () =>
        openEditor(
          Number(el.dataset.edit)
        );
    });

  document
    .querySelectorAll("[data-recipe]")
    .forEach(el => {
      el.onclick = () => {
        selectedRecipe = el.dataset.recipe;
        go("delivery");
      };
    });

  document
    .querySelectorAll(".choose-store")
    .forEach(el => {
      el.onclick = () =>
        openStore(
          el.dataset.store,
          el.dataset.url
        );
    });

  const search =
    document.querySelector("#search");

  if (search) {
    search.oninput = () => {
      updateInventoryList(
        items.filter(item =>
          normalize(item.name).includes(
            normalize(search.value)
          )
        )
      );
    };
  }

  document
    .querySelectorAll("[data-filter]")
    .forEach(button => {
      button.onclick = () => {

        document
          .querySelectorAll("[data-filter]")
          .forEach(b =>
            b.classList.remove("selected")
          );

        button.classList.add("selected");

        let filtered = items;

        if (
          button.dataset.filter === "soon"
        ) {
          filtered = items.filter(
            item =>
              Number(item.level) < 40
          );
        }

        if (
          button.dataset.filter === "scan"
        ) {
          filtered = items.filter(
            item =>
              item.source ===
              "Factura escaneada"
          );
        }

        updateInventoryList(filtered);
      };
    });

  const ai =
    document.querySelector("#aiSend");

  if (ai) {
    ai.onclick = () => {
      recipeCatalog.push(
        recipeCatalog.shift()
      );

      render();

      showToast(
        "Sugerencias actualizadas ✨"
      );
    };
  }

  const location =
    document.querySelector("#changeLocation");

  if (location) {
    location.onclick =
      changeLocation;
  }
}

function updateInventoryList(list) {
  const holder =
    document.querySelector("#inventoryList");

  if (!holder) return;

  holder.innerHTML =
    itemList(list, true);

  holder
    .querySelectorAll("[data-edit]")
    .forEach(el => {
      el.onclick = () =>
        openEditor(
          Number(el.dataset.edit)
        );
    });
}

/* =========================================================
   SUPERMERCADOS
========================================================= */

function openStore(name, url) {
  showToast(
    "Abriendo " + name + " 🛒"
  );

  setTimeout(() => {
    window.open(
      url,
      "_blank",
      "noopener"
    );
  }, 350);
}

function changeLocation() {
  const current =
    document
      .querySelector("#deliveryAddress")
      ?.textContent || "";

  const next =
    window.prompt(
      "¿Dónde deseas recibir tu compra?",
      current
    );

  if (
    next &&
    next.trim()
  ) {
    document
      .querySelector("#deliveryAddress")
      .textContent =
        next.trim();

    showToast(
      "Ubicación actualizada 📍"
    );
  }
}

/* =========================================================
   PREPROCESAMIENTO OCR V3
========================================================= */

async function createProcessedReceipt(
  file,
  mode = "soft"
) {
  return new Promise(
    (resolve, reject) => {

      const image =
        new Image();

      const objectURL =
        URL.createObjectURL(file);

      image.onload = () => {
        try {
          const desiredWidth =
            Math.min(
              1800,
              Math.max(
                1400,
                image.naturalWidth * 1.8
              )
            );

          const scale =
            desiredWidth /
            image.naturalWidth;

          const width =
            Math.round(
              image.naturalWidth *
              scale
            );

          const height =
            Math.round(
              image.naturalHeight *
              scale
            );

          const canvas =
            document.createElement("canvas");

          canvas.width =
            width;

          canvas.height =
            height;

          const ctx =
            canvas.getContext(
              "2d",
              {
                willReadFrequently: true
              }
            );

          ctx.fillStyle =
            "#ffffff";

          ctx.fillRect(
            0,
            0,
            width,
            height
          );

          ctx.drawImage(
            image,
            0,
            0,
            width,
            height
          );

          const imageData =
            ctx.getImageData(
              0,
              0,
              width,
              height
            );

          const data =
            imageData.data;

          for (
            let i = 0;
            i < data.length;
            i += 4
          ) {
            const red =
              data[i];

            const green =
              data[i + 1];

            const blue =
              data[i + 2];

            let gray =
              0.299 * red +
              0.587 * green +
              0.114 * blue;

            if (
              mode === "soft"
            ) {
              gray =
                (gray - 128) *
                1.3 +
                128;

              if (gray > 225) {
                gray = 255;
              }

              if (gray < 80) {
                gray = 35;
              }
            }

            if (
              mode === "binary"
            ) {
              gray =
                gray < 175
                  ? 0
                  : 255;
            }

            gray =
              Math.max(
                0,
                Math.min(
                  255,
                  gray
                )
              );

            data[i] =
              gray;

            data[i + 1] =
              gray;

            data[i + 2] =
              gray;
          }

          ctx.putImageData(
            imageData,
            0,
            0
          );

          canvas.toBlob(
            blob => {
              URL.revokeObjectURL(
                objectURL
              );

              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            "image/png"
          );

        } catch (error) {
          URL.revokeObjectURL(
            objectURL
          );

          reject(error);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectURL
        );

        reject(
          new Error(
            "No se pudo preparar la imagen."
          )
        );
      };

      image.src =
        objectURL;
    }
  );
}

/* =========================================================
   EJECUTAR OCR
========================================================= */

async function runOCR(
  image,
  label,
  progressStart,
  progressEnd
) {
  updateScanningText(label);

  const result =
    await window.Tesseract.recognize(
      image,
      "spa+eng",
      {
        logger: message => {
          const originalProgress =
            Number(
              message.progress || 0
            );

          const mapped =
            progressStart +
            originalProgress *
            (
              progressEnd -
              progressStart
            );

          updateOCRProgressCustom(
            message.status,
            mapped
          );
        }
      }
    );

  return {
    text:
      result?.data?.text || "",

    confidence:
      Math.round(
        result?.data?.confidence || 0
      )
  };
}

function scoreOCRResult(result) {
  const products =
    parseReceipt(result.text);

  const priceCount =
    (
      result.text.match(
        /\d+[.,]\d{2}/g
      ) || []
    ).length;

  const readableWords =
    (
      result.text.match(
        /[A-Za-zÁÉÍÓÚÑáéíóúñ]{4,}/g
      ) || []
    ).length;

  const score =
    result.confidence +
    products.length * 15 +
    Math.min(priceCount, 15) * 2 +
    Math.min(readableWords, 30) * 0.5;

  return {
    ...result,
    products,
    score
  };
}

/* =========================================================
   ESCANEAR FACTURA
========================================================= */

async function scanReceipt(file) {
  if (!file) return;

  const previewUrl =
    URL.createObjectURL(file);

  showScanning(previewUrl);

  try {
    if (!window.Tesseract) {
      throw new Error(
        "El módulo OCR no pudo cargarse."
      );
    }

    updateScanningText(
      "Preparando la factura… 🧾"
    );

    const softImage =
      await createProcessedReceipt(
        file,
        "soft"
      );

    const binaryImage =
      await createProcessedReceipt(
        file,
        "binary"
      );

    const firstOCR =
      await runOCR(
        softImage,
        "Primera lectura: analizando productos…",
        0.08,
        0.48
      );

    const secondOCR =
      await runOCR(
        binaryImage,
        "Segunda lectura: verificando precios…",
        0.50,
        0.92
      );

    updateScanningText(
      "Comparando resultados… ✨"
    );

    const candidate1 =
      scoreOCRResult(firstOCR);

    const candidate2 =
      scoreOCRResult(secondOCR);

    const best =
      candidate2.score >
      candidate1.score
        ? candidate2
        : candidate1;

    console.log(
      "OCR SUAVE:",
      candidate1
    );

    console.log(
      "OCR BINARIO:",
      candidate2
    );

    console.log(
      "OCR ELEGIDO:",
      best
    );

    updateOCRProgressCustom(
      "complete",
      1
    );

    closeOverlay();

    openReceiptReview(
      best.products,
      best.text,
      best.confidence
    );

  } catch (error) {
    console.error(error);

    closeOverlay();

    openReceiptReview(
      [],
      "",
      0,
      error.message ||
        "No fue posible leer la factura."
    );

  } finally {
    URL.revokeObjectURL(
      previewUrl
    );

    receiptInput.value = "";
  }
}

/* =========================================================
   UI DEL ESCÁNER
========================================================= */

function showScanning(previewUrl) {
  overlay.className =
    "overlay";

  overlay.innerHTML = `
    <div class="receipt-preview">

      <img
        src="${previewUrl}"
        alt="Vista previa de la factura"
      >

      <span class="scan-line"></span>

    </div>

    <h3>
      Analizando tu factura… 🧾
    </h3>

    <p id="ocrStatus">
      Preparando una lectura más precisa.
    </p>

    <div class="progress">
      <i id="ocrBar"></i>
    </div>
  `;
}

function updateScanningText(text) {
  const status =
    document.querySelector("#ocrStatus");

  if (status) {
    status.textContent =
      text;
  }
}

function updateOCRProgressCustom(
  statusName,
  progressValue
) {
  const bar =
    document.querySelector("#ocrBar");

  const status =
    document.querySelector("#ocrStatus");

  if (!bar) return;

  const percentage =
    Math.max(
      4,
      Math.min(
        100,
        Math.round(
          Number(progressValue) *
          100
        )
      )
    );

  bar.style.width =
    percentage + "%";

  if (
    status &&
    statusName === "complete"
  ) {
    status.textContent =
      "Lectura completada ✓";
  }
}

/* =========================================================
   PRECIOS
========================================================= */

function parseMoney(value) {
  let cleaned =
    String(value || "")
      .replace(
        /[^\d.,]/g,
        ""
      );

  if (
    cleaned.includes(".") &&
    cleaned.includes(",")
  ) {
    const lastDot =
      cleaned.lastIndexOf(".");

    const lastComma =
      cleaned.lastIndexOf(",");

    if (
      lastDot >
      lastComma
    ) {
      cleaned =
        cleaned.replaceAll(
          ",",
          ""
        );
    } else {
      cleaned =
        cleaned
          .replaceAll(
            ".",
            ""
          )
          .replace(
            ",",
            "."
          );
    }

  } else if (
    cleaned.includes(",") &&
    /,\d{2}$/.test(cleaned)
  ) {
    cleaned =
      cleaned.replace(
        ",",
        "."
      );

  } else {
    cleaned =
      cleaned.replaceAll(
        ",",
        ""
      );
  }

  return (
    Number.parseFloat(cleaned) ||
    0
  );
}

/* =========================================================
   LIMPIAR PRODUCTO
========================================================= */

function cleanProductName(value) {
  let name =
    String(value || "");

  name =
    name
      .replace(
        /^[#*.:/\\\-\s]+/,
        ""
      )
      .replace(
        /\b(?:LPS?|HNL)\b/gi,
        ""
      )
      .replace(
        /^\d{5,14}\s+/,
        ""
      )
      .replace(
        /\s{2,}/g,
        " "
      )
      .trim();

  if (
    !/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(name)
  ) {
    return "";
  }

  return name
    .toLowerCase()
    .replace(
      /(^|\s)[a-záéíóúñ]/g,
      char =>
        char.toUpperCase()
    );
}

/* =========================================================
   DETECTAR SUPERMERCADO
========================================================= */

function detectStore(text) {
  const n =
    normalize(text);

  if (
    n.includes("la colonia") ||
    n.includes(
      "supermercados la colonia"
    )
  ) {
    return "La Colonia";
  }

  if (
    n.includes("walmart")
  ) {
    return "Walmart";
  }

  if (
    n.includes("paiz")
  ) {
    return "Paiz";
  }

  if (
    n.includes("diprova")
  ) {
    return "Diprova";
  }

  if (
    n.includes("mas x menos") ||
    n.includes("mas por menos")
  ) {
    return "Más x Menos";
  }

  return "Supermercado";
}

/* =========================================================
   PARSER DE FACTURA
========================================================= */

function parseReceipt(text) {
  const detectedStore =
    detectStore(text);

  const ignored =
    /\b(subtotal|impuesto|isv|total a pagar|gran total|cambio|efectivo|tarjeta|rtn|cai|factura|fecha|hora|cajero|gracias|descuento|ahorro|vuelto|saldo|telefono|cliente|autorizacion|referencia|visa|mastercard|nit|orden|tienda|sucursal|direccion|precio unit|descripcion)\b/i;

  let lines =
    String(text || "")
      .split(/\r?\n/)
      .map(line =>
        line
          .replace(
            /[|_]/g,
            " "
          )
          .replace(
            /\s{2,}/g,
            " "
          )
          .trim()
      )
      .filter(Boolean);

  const products = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    let line =
      lines[i];

    if (
      line.length < 3 ||
      ignored.test(line)
    ) {
      continue;
    }

    let priceMatches =
      [
        ...line.matchAll(
          /(?:L(?:PS?)?\.?\s*)?(\d{1,5}[.,]\d{2})/gi
        )
      ];

    if (
      !priceMatches.length &&
      i < lines.length - 1 &&
      /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(line)
    ) {
      const nextLine =
        lines[i + 1];

      const nextPrices =
        [
          ...nextLine.matchAll(
            /(?:L(?:PS?)?\.?\s*)?(\d{1,5}[.,]\d{2})/gi
          )
        ];

      if (
        nextPrices.length
      ) {
        line =
          line +
          " " +
          nextLine;

        i++;

        priceMatches =
          [
            ...line.matchAll(
              /(?:L(?:PS?)?\.?\s*)?(\d{1,5}[.,]\d{2})/gi
            )
          ];
      }
    }

    if (
      !priceMatches.length
    ) {
      continue;
    }

    const prices =
      priceMatches
        .map(match =>
          parseMoney(
            match[1]
          )
        )
        .filter(price =>
          price > 0 &&
          price < 10000
        );

    if (
      !prices.length
    ) {
      continue;
    }

    const totalPrice =
      prices[
        prices.length - 1
      ];

    const unitPrice =
      prices.length >= 2
        ? prices[
            prices.length - 2
          ]
        : totalPrice;

    const firstPriceIndex =
      priceMatches[0].index;

    let beforePrice =
      line
        .slice(
          0,
          firstPriceIndex
        )
        .trim();

    beforePrice =
      beforePrice
        .replace(
          /^\d{5,14}\s+/,
          ""
        )
        .replace(
          /^[#*.:/\-\s]+/,
          ""
        )
        .trim();

    let qty = 1;

    const qtyMatch =
      beforePrice.match(
        /^(\d+(?:[.,]\d+)?)\s+(.+)/
      );

    if (
      qtyMatch
    ) {
      const possibleQty =
        parseMoney(
          qtyMatch[1]
        );

      if (
        possibleQty > 0 &&
        possibleQty <= 50
      ) {
        qty =
          possibleQty;

        beforePrice =
          qtyMatch[2]
            .trim();
      }
    }

    const multiplication =
      beforePrice.match(
        /^(\d+(?:[.,]\d+)?)\s*[xX*@]\s*(?:L(?:PS?)?\.?\s*)?[\d.,]+\s*(.*)$/i
      );

    if (
      multiplication
    ) {
      qty =
        Math.max(
          1,
          parseMoney(
            multiplication[1]
          )
        );

      beforePrice =
        multiplication[2]
          .trim();
    }

    const name =
      cleanProductName(
        beforePrice
      );

    if (
      !name
    ) {
      continue;
    }

    const normalizedName =
      normalize(name);

    const badWords = [
      "subtotal",
      "total",
      "isv",
      "efectivo",
      "cambio",
      "cajero",
      "cliente",
      "factura",
      "rtn",
      "cai",
      "precio",
      "descripcion",
      "cantidad"
    ];

    if (
      badWords.some(word =>
        normalizedName.includes(
          word
        )
      )
    ) {
      continue;
    }

    const letters =
      name.match(
        /[A-Za-zÁÉÍÓÚÑáéíóúñ]/g
      );

    if (
      !letters ||
      letters.length < 4
    ) {
      continue;
    }

    products.push({
      name,
      qty,
      price:
        totalPrice,
      unitPrice,
      icon:
        iconFor(name),
      store:
        detectedStore
    });
  }

  const unique = [];

  products.forEach(
    product => {
      const duplicate =
        unique.find(
          item =>
            normalize(item.name) ===
            normalize(product.name) &&
            Math.abs(
              Number(item.price) -
              Number(product.price)
            ) < 0.01
        );

      if (
        !duplicate
      ) {
        unique.push(
          product
        );
      }
    }
  );

  return unique.slice(
    0,
    30
  );
}

/* =========================================================
   REVISIÓN DE FACTURA
========================================================= */

function reviewRow(product = {}) {
  return `
    <div class="review-row">

      <input
        data-field="name"
        value="${escapeHTML(product.name || "")}"
        placeholder="Producto"
      >

      <input
        data-field="qty"
        type="number"
        min="0.01"
        step="0.01"
        value="${Number(product.qty || 1)}"
      >

      <input
        data-field="price"
        type="number"
        min="0"
        step="0.01"
        value="${
          product.price
            ? money(product.price)
            : ""
        }"
        placeholder="0.00"
      >

      <button
        type="button"
        class="remove-row"
      >
        ×
      </button>

    </div>
  `;
}

function openReceiptReview(
  products,
  rawText,
  confidence,
  errorMessage = ""
) {
  const initialRows =
    products.length
      ? products
      : [{}];

  const detectedStore =
    rawText
      ? detectStore(rawText)
      : "";

  overlay.className =
    "modal-backdrop";

  overlay.innerHTML = `
    <form
      class="modal"
      id="receiptReview"
    >

      <button
        type="button"
        class="modal-x"
        id="closeModal"
      >
        ×
      </button>

      <span class="eyebrow dark">
        REVISIÓN DE FACTURA 🧾
      </span>

      <h2>
        ${
          products.length
            ? `Encontramos ${products.length} productos 🎉`
            : "Revisa la factura"
        }
      </h2>

      <p class="modal-intro">

        ${
          detectedStore
            ? `Factura detectada: ${escapeHTML(detectedStore)}. `
            : ""
        }

        Confirma nombres, cantidades y precios
        antes de agregarlos.

      </p>

      <div class="scan-note ${errorMessage ? "ocr-warning" : ""}">

        ${
          errorMessage
            ? escapeHTML(
                errorMessage
              )
            : `
                Confianza de lectura:
                ${confidence}%
              `
        }

      </div>

      <div class="review-head">

        <span>PRODUCTO</span>
        <span>CANT.</span>
        <span>PRECIO L</span>
        <span></span>

      </div>

      <div id="reviewRows">

        ${initialRows
          .map(reviewRow)
          .join("")}

      </div>

      <button
        type="button"
        class="secondary-button"
        id="addReviewRow"
      >
        ＋ Agregar otra línea
      </button>

      <div class="review-total">

        <span>
          Total detectado
        </span>

        <strong id="reviewTotal">
          L 0.00
        </strong>

      </div>

      ${
        rawText
          ? `
            <details class="raw-details">

              <summary>
                Ver texto leído por el OCR
              </summary>

              <textarea readonly>${escapeHTML(rawText)}</textarea>

            </details>
          `
          : ""
      }

      <button class="primary-button">
        Agregar al inventario 🛒
      </button>

    </form>
  `;

  document
    .querySelector("#closeModal")
    .onclick =
      closeOverlay;

  document
    .querySelector("#addReviewRow")
    .onclick = () => {

      document
        .querySelector("#reviewRows")
        .insertAdjacentHTML(
          "beforeend",
          reviewRow()
        );

      bindReviewRows();
    };

  document
    .querySelector("#receiptReview")
    .onsubmit =
      saveReceiptProducts;

  bindReviewRows();

  updateReviewTotal();
}

function bindReviewRows() {
  document
    .querySelectorAll(".review-row")
    .forEach(row => {

      row
        .querySelector(".remove-row")
        .onclick = () => {

          row.remove();

          if (
            !document.querySelector(
              ".review-row"
            )
          ) {
            document
              .querySelector("#reviewRows")
              .insertAdjacentHTML(
                "beforeend",
                reviewRow()
              );
          }

          bindReviewRows();
          updateReviewTotal();
        };

      row
        .querySelectorAll("input")
        .forEach(input => {
          input.oninput =
            updateReviewTotal;
        });
    });
}

function updateReviewTotal() {
  const sum =
    [
      ...document.querySelectorAll(
        '.review-row [data-field="price"]'
      )
    ].reduce(
      (totalValue, input) =>
        totalValue +
        Number(input.value || 0),
      0
    );

  const totalNode =
    document.querySelector(
      "#reviewTotal"
    );

  if (
    totalNode
  ) {
    totalNode.textContent =
      "L " + money(sum);
  }
}

/* =========================================================
   GUARDAR PRODUCTOS DE FACTURA
========================================================= */

function saveReceiptProducts(event) {
  event.preventDefault();

  const products =
    [
      ...document.querySelectorAll(
        ".review-row"
      )
    ]
      .map(row => ({
        name:
          row
            .querySelector(
              '[data-field="name"]'
            )
            .value
            .trim(),

        qty:
          Number(
            row
              .querySelector(
                '[data-field="qty"]'
              )
              .value || 1
          ),

        price:
          Number(
            row
              .querySelector(
                '[data-field="price"]'
              )
              .value || 0
          )
      }))
      .filter(
        product =>
          product.name
      );

  if (
    !products.length
  ) {
    showToast(
      "Agrega al menos un producto"
    );

    return;
  }

  products.forEach(
    (product, index) => {

      items.unshift({
        id:
          Date.now() +
          index,

        icon:
          iconFor(
            product.name
          ),

        name:
          product.name,

        detail:
          "Factura escaneada",

        source:
          "Factura escaneada",

        qty:
          product.qty,

        price:
          product.price,

        fresh:
          "Revisa su vencimiento",

        level:
          75
      });
    }
  );

  saveItems();

  closeOverlay();

  go("inventory");

  showToast(
    products.length +
    " productos agregados 🛒"
  );
}

/* =========================================================
   CERRAR MODAL
========================================================= */

function closeOverlay() {
  overlay.className = "";
  overlay.innerHTML = "";
}

/* =========================================================
   EDITAR / AGREGAR PRODUCTO
========================================================= */

function openEditor(id) {
  const current =
    items.find(
      item =>
        item.id === id
    );

  overlay.className =
    "modal-backdrop";

  overlay.innerHTML = `
    <form
      class="modal"
      id="itemForm"
    >

      <button
        type="button"
        class="modal-x"
        id="closeModal"
      >
        ×
      </button>

      <span class="eyebrow dark">

        ${
          current
            ? "EDITAR PRODUCTO"
            : "NUEVO PRODUCTO"
        }

      </span>

      <h2>

        ${
          current
            ? "Actualiza los datos"
            : "Agregar manualmente 🛒"
        }

      </h2>

      <label>

        Producto

        <input
          name="name"
          required
          value="${escapeHTML(current?.name || "")}"
          placeholder="Ej. Banano"
        >

      </label>

      <div class="form-row">

        <label>

          Cantidad

          <input
            name="qty"
            type="number"
            min="0.01"
            step="0.01"
            required
            value="${current?.qty || 1}"
          >

        </label>

        <label>

          Precio total (L)

          <input
            name="price"
            type="number"
            step=".01"
            min="0"
            required
            value="${current?.price ?? ""}"
          >

        </label>

      </div>

      <label>

        Nota o presentación

        <input
          name="detail"
          value="${escapeHTML(current?.detail || "")}"
          placeholder="Ej. Bolsa de 2 lb"
        >

      </label>

      <button class="primary-button">
        Guardar producto ✓
      </button>

      ${
        current
          ? `
            <button
              type="button"
              class="delete-button"
              id="deleteItem"
            >
              Eliminar del inventario
            </button>
          `
          : ""
      }

    </form>
  `;

  document
    .querySelector("#closeModal")
    .onclick =
      closeOverlay;

  document
    .querySelector("#itemForm")
    .onsubmit = event => {

      event.preventDefault();

      const form =
        new FormData(
          event.target
        );

      const name =
        form
          .get("name")
          .trim();

      const data = {
        name,

        icon:
          iconFor(name),

        qty:
          Number(
            form.get("qty")
          ),

        price:
          Number(
            form.get("price")
          ),

        detail:
          form
            .get("detail")
            .trim() ||
          "Agregado manualmente"
      };

      if (
        current
      ) {
        Object.assign(
          current,
          data
        );

      } else {
        items.unshift({
          id:
            Date.now(),

          ...data,

          fresh:
            "Sin fecha",

          level:
            75,

          source:
            "Manual"
        });
      }

      saveItems();

      closeOverlay();

      render();

      showToast(
        "Producto guardado ✓"
      );
    };

  const remove =
    document.querySelector(
      "#deleteItem"
    );

  if (
    remove
  ) {
    remove.onclick = () => {

      items =
        items.filter(
          item =>
            item.id !==
            current.id
        );

      saveItems();

      closeOverlay();

      render();

      showToast(
        "Producto eliminado"
      );
    };
  }
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  const toast =
    document.querySelector("#toast");

  if (!toast) return;

  toast.textContent =
    "✓ " + message;

  toast.hidden =
    false;

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(
      () => {
        toast.hidden =
          true;
      },
      2300
    );
}

/* =========================================================
   EVENTOS GLOBALES
========================================================= */

document
  .querySelectorAll("[data-tab]")
  .forEach(el => {
    el.onclick = () =>
      go(el.dataset.tab);
  });

const scanButton =
  document.querySelector(
    "#scanButton"
  );

if (
  scanButton
) {
  scanButton.onclick = () =>
    receiptInput.click();
}

if (
  receiptInput
) {
  receiptInput.onchange =
    event =>
      scanReceipt(
        event.target.files?.[0]
      );
}

/* =========================================================
   INICIO
========================================================= */

render();