const items = [
  {id:1,icon:"🥛",name:"Leche entera",detail:"Sula · 1 litro",qty:2,price:31.5,fresh:"Vence en 5 días",level:72},
  {id:2,icon:"🥚",name:"Huevos",detail:"Cartón de 12",qty:12,price:68,fresh:"Vence en 12 días",level:88},
  {id:3,icon:"🥑",name:"Aguacates",detail:"Unidad",qty:3,price:54,fresh:"Usar pronto",level:35},
  {id:4,icon:"🌿",name:"Culantro",detail:"Mazo fresco",qty:1,price:12,fresh:"Usar en 3 días",level:28},
  {id:5,icon:"🍅",name:"Tomates",detail:"Libra",qty:4,price:28,fresh:"Vence en 6 días",level:60}
];
let currentTab = "home";
const view = document.querySelector("#view");
const overlay = document.querySelector("#overlay");
const receiptInput = document.querySelector("#receiptInput");

function money(value){return Number(value).toFixed(2)}
function total(){return items.reduce(function(sum,item){return sum+item.price},0)}
function units(){return items.reduce(function(sum,item){return sum+item.qty},0)}
function itemList(list,editable){
  return '<div class="item-list">'+list.map(function(item){
    return '<article class="item"><span class="food-icon">'+item.icon+'</span><div class="item-info"><strong>'+item.name+'</strong><small>'+item.detail+' · L '+money(item.price)+'</small><div class="fresh-row"><span class="'+(item.level<40?'danger':'ok')+'">'+item.fresh+'</span><span class="bar"><i style="width:'+item.level+'%"></i></span></div></div><div class="qty"><b>'+item.qty+'</b><small>unid.</small></div>'+(editable?'<button class="edit-button" data-edit="'+item.id+'">•••</button>':'')+'</article>';
  }).join("")+'</div>';
}
function home(){
  return '<section class="hero"><span class="eyebrow">TU COCINA, MÁS INTELIGENTE</span><h1>Hola, Elo 👋</h1><p>Convierte tu factura en un inventario en segundos.</p><button class="scan-card scan-trigger"><span class="scan-icon">▣</span><span class="scan-copy"><strong>Escanear factura</strong><small>Toma una foto o sube una imagen</small></span><span class="arrow">›</span></button></section><section class="content"><div class="summary-row"><div class="summary"><span class="summary-icon">▦</span><div><b>'+units()+'</b><small>unidades registradas</small></div></div><div class="summary"><span class="summary-icon blue">L</span><div><b>'+money(total())+'</b><small>valor estimado</small></div></div></div><div class="section-heading"><div><span class="eyebrow dark">INVENTARIO RECIENTE</span><h2>Lo que tienes en casa</h2></div><button data-go="inventory">Ver todo</button></div>'+itemList(items.slice(0,3),false)+'<button class="recipe-teaser" data-go="recipes"><span class="spark">✦</span><span><small>IDEAS CON LO QUE TIENES</small><strong>3 recetas listas para cocinar</strong></span><span>›</span></button><button class="daily-tip" data-go="tips"><span>🌿</span><div><small>TIP DEL DÍA</small><b>Haz que tu culantro dure hasta 2 semanas</b></div><span>›</span></button></section>';
}
function inventory(){
  return '<section class="screen"><span class="eyebrow dark">MI COCINA</span><div class="screen-title"><div><h1>Inventario</h1><p>'+items.length+' tipos de productos · L '+money(total())+'</p></div><button class="add-button" data-add>＋</button></div><div class="search"><span>⌕</span><input id="search" placeholder="Buscar un producto"></div><div class="filter-row"><button class="selected">Todos</button><button>Por vencer</button><button>Refrigerados</button></div><div id="inventoryList">'+itemList(items,true)+'</div><button class="manual-add" data-add>＋ Agregar producto manualmente</button></section>';
}
const recipes = [
  ["🍳","Omelette de aguacate","15 min","100","✓ Tienes todo"],
  ["🍝","Pasta cremosa con tomate","25 min","82","＋ Faltan 2 · aprox. L 78"],
  ["🥗","Ensalada fresca de pollo","20 min","68","＋ Faltan 2 · aprox. L 112"]
];
function recipeView(){
  return '<section class="screen"><span class="eyebrow dark">GENERADO CON IA</span><div class="screen-title"><div><h1>¿Qué cocinamos?</h1><p>Ideas basadas en tu inventario actual</p></div><span class="ai-badge">✦ IA</span></div><div class="prompt-box"><span>✦</span><div><b>Pídele algo a Refill</b><small>“Algo rápido, saludable y sin horno”</small></div><button id="aiSend">Enviar</button></div><div class="filter-row"><button class="selected">Para hoy</button><button>15 min</button><button>Saludable</button></div><div class="recipe-list">'+recipes.map(function(r,i){return '<article class="recipe-card"><div class="recipe-art">'+r[0]+'<span>'+r[3]+'% compatible</span></div><div class="recipe-body"><small>'+r[2]+' · '+(i?'Intermedio':'Fácil')+'</small><h3>'+r[1]+'</h3><p class="'+(i?'danger':'ok')+'">'+r[4]+'</p>'+(i?'<button data-go="delivery">Comprar lo que falta →</button>':'')+'</div></article>'}).join("")+'</div></section>';
}
const stores=[["Más x Menos","MxM","#e74c3c","35–50 min",49,284],["La Colonia","LC","#ef732b","40–55 min",45,276],["Diprova","DI","#1c63a7","45–60 min",55,269],["Walmart / Paiz","W","#1478bf","50–70 min",59,291]];
function delivery(){
  return '<section class="screen"><span class="eyebrow dark">DELIVERY</span><div class="screen-title"><div><h1>Completa tu receta</h1><p>Compara precios y recibe en casa</p></div><span class="ai-badge">2</span></div><div class="shopping-summary"><span>🛍️</span><div><b>Te faltan 2 ingredientes</b><small>Pasta · Crema de leche</small></div><strong>desde L 269</strong></div><div class="location"><span>⌖</span><div><small>ENTREGAR EN</small><b>Tegucigalpa, Francisco Morazán</b></div><button>Cambiar</button></div><div class="store-heading"><h2>Elige tu supermercado</h2><small>Productos + envío estimado</small></div><div class="store-list">'+stores.map(function(s){return '<article class="store"><span class="store-logo" style="background:'+s[2]+'">'+s[1]+'</span><div><b>'+s[0]+'</b><small>'+s[3]+' · Envío L '+s[4]+'</small></div><strong>L '+s[5]+'</strong><button class="choose-store" data-store="'+s[0]+'">Elegir</button></article>'}).join("")+'</div></section>';
}
function tips(){
  const more=[["🥑","Aguacate sin oscurecerse","Añade unas gotas de limón y cúbrelo sin dejar aire.","2–3 días"],["🍅","Tomates con mejor sabor","Déjalos fuera del refrigerador con el tallo hacia abajo.","5–7 días"],["🥬","Hojas verdes crujientes","Envuélvelas en papel absorbente dentro de un recipiente.","7–10 días"]];
  return '<section class="screen"><span class="eyebrow dark">CERO DESPERDICIO</span><div class="screen-title"><div><h1>Conserva mejor</h1><p>Tips para que tus alimentos duren más</p></div><span class="leaf-badge">♧</span></div><div class="tip-feature"><small>RECOMENDADO PARA TU INVENTARIO</small><h2>Tu culantro necesita atención</h2><p>Córtale apenas la base, ponlo en un vaso con 2 cm de agua y cúbrelo con una bolsa floja antes de refrigerar.</p><div class="tip-result"><b>Resultado</b><span>Puede durar hasta 2 semanas</span></div></div><h2 class="more-title">Más consejos para ti</h2><div class="tips-list">'+more.map(function(t){return '<article class="tip-card"><span>'+t[0]+'</span><div><h3>'+t[1]+'</h3><p>'+t[2]+'</p><small>'+t[3]+'</small></div></article>'}).join("")+'</div></section>';
}
function render(){
  const pages={home:home,inventory:inventory,recipes:recipeView,delivery:delivery,tips:tips};
  view.innerHTML=pages[currentTab]();
  document.querySelectorAll(".bottom-nav [data-tab]").forEach(function(btn){btn.classList.toggle("active",btn.dataset.tab===currentTab)});
  bindView();
}
function go(tab){currentTab=tab;window.scrollTo(0,0);render()}
function bindView(){
  document.querySelectorAll("[data-go]").forEach(function(el){el.onclick=function(){go(el.dataset.go)}});
  document.querySelectorAll(".scan-trigger").forEach(function(el){el.onclick=function(){receiptInput.click()}});
  document.querySelectorAll("[data-add]").forEach(function(el){el.onclick=function(){openEditor()}});
  document.querySelectorAll("[data-edit]").forEach(function(el){el.onclick=function(){openEditor(Number(el.dataset.edit))}});
  document.querySelectorAll(".choose-store").forEach(function(el){el.onclick=function(){showToast("Pedido preparado con "+el.dataset.store)}});
  const search=document.querySelector("#search");if(search)search.oninput=function(){const q=search.value.toLowerCase();document.querySelector("#inventoryList").innerHTML=itemList(items.filter(function(i){return i.name.toLowerCase().includes(q)}),true);bindView()};
  const ai=document.querySelector("#aiSend");if(ai)ai.onclick=function(){showToast("La IA preparó nuevas sugerencias")};
}
function scan(){
  overlay.className="overlay";
  overlay.innerHTML='<div class="receipt">▤<span class="scan-line"></span></div><h3>Analizando tu factura…</h3><p>La IA está identificando productos, cantidades y precios.</p>';
  setTimeout(function(){
    if(!items.some(function(i){return i.name==="Arroz blanco"})){items.push({id:Date.now(),icon:"🍚",name:"Arroz blanco",detail:"Paquete · 2 lb",qty:1,price:42.5,fresh:"Despensa",level:95});items.push({id:Date.now()+1,icon:"🍗",name:"Pechuga de pollo",detail:"Bandeja · 1.5 lb",qty:1,price:96,fresh:"Vence en 4 días",level:58})}
    overlay.className="modal-backdrop";overlay.innerHTML='<div class="modal success"><button class="modal-x" id="closeModal">×</button><span class="success-check">✓</span><span class="eyebrow dark">FACTURA PROCESADA</span><h2>¡Inventario actualizado!</h2><p>Encontramos 2 productos nuevos por L 138.50.</p><div class="found"><span>🍚</span><div><b>Arroz blanco</b><small>1 × L 42.50</small></div><strong>L 42.50</strong></div><div class="found"><span>🍗</span><div><b>Pechuga de pollo</b><small>1 × L 96.00</small></div><strong>L 96.00</strong></div><button class="primary-button" id="reviewInventory">Revisar inventario</button></div>';
    document.querySelector("#closeModal").onclick=closeOverlay;document.querySelector("#reviewInventory").onclick=function(){closeOverlay();go("inventory")};
  },1400);
}
function closeOverlay(){overlay.className="";overlay.innerHTML=""}
function openEditor(id){
  const current=items.find(function(i){return i.id===id});
  overlay.className="modal-backdrop";overlay.innerHTML='<form class="modal" id="itemForm"><button type="button" class="modal-x" id="closeModal">×</button><span class="eyebrow dark">'+(current?'EDITAR PRODUCTO':'NUEVO PRODUCTO')+'</span><h2>'+(current?'Actualiza los datos':'Agregar manualmente')+'</h2><label>Producto<input name="name" required value="'+(current?current.name:'')+'" placeholder="Ej. Banano"></label><div class="form-row"><label>Cantidad<input name="qty" type="number" min="1" required value="'+(current?current.qty:1)+'"></label><label>Precio total (L)<input name="price" type="number" step=".01" min="0" required value="'+(current?current.price:'')+'"></label></div><button class="primary-button">Guardar producto</button></form>';
  document.querySelector("#closeModal").onclick=closeOverlay;document.querySelector("#itemForm").onsubmit=function(e){e.preventDefault();const f=new FormData(e.target);if(current){current.name=f.get("name");current.qty=Number(f.get("qty"));current.price=Number(f.get("price"))}else{items.push({id:Date.now(),icon:"🛒",name:f.get("name"),detail:"Agregado manualmente",qty:Number(f.get("qty")),price:Number(f.get("price")),fresh:"Sin fecha",level:75})}closeOverlay();render();showToast("Producto guardado")};
}
function showToast(message){const t=document.querySelector("#toast");t.textContent="✓ "+message;t.hidden=false;setTimeout(function(){t.hidden=true},2200)}
document.querySelectorAll("[data-tab]").forEach(function(el){el.onclick=function(){go(el.dataset.tab)}});
document.querySelector("#scanButton").onclick=function(){receiptInput.click()};
receiptInput.onchange=scan;
render();
