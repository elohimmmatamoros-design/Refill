"use client";

import { FormEvent, useRef, useState } from "react";

type Tab = "home" | "inventory" | "recipes" | "delivery" | "tips";
type Item = { id: number; icon: string; name: string; detail: string; qty: number; price: number; freshness: string; level: number };

const seedItems: Item[] = [
  { id: 1, icon: "🥛", name: "Leche entera", detail: "Sula · 1 litro", qty: 2, price: 31.5, freshness: "Vence en 5 días", level: 72 },
  { id: 2, icon: "🥚", name: "Huevos", detail: "Cartón de 12", qty: 12, price: 68, freshness: "Vence en 12 días", level: 88 },
  { id: 3, icon: "🥑", name: "Aguacates", detail: "Unidad", qty: 3, price: 54, freshness: "Usar pronto", level: 35 },
  { id: 4, icon: "🌿", name: "Culantro", detail: "Mazo fresco", qty: 1, price: 12, freshness: "Usar en 3 días", level: 28 },
  { id: 5, icon: "🍅", name: "Tomates", detail: "Libra", qty: 4, price: 28, freshness: "Vence en 6 días", level: 60 },
];

const stores = [
  { name: "Más x Menos", short: "MxM", color: "#e74c3c", time: "35–50 min", fee: 49, total: 284 },
  { name: "La Colonia", short: "LC", color: "#ef732b", time: "40–55 min", fee: 45, total: 276 },
  { name: "Diprova", short: "DI", color: "#1c63a7", time: "45–60 min", fee: 55, total: 269 },
  { name: "Walmart / Paiz", short: "W", color: "#1478bf", time: "50–70 min", fee: 59, total: 291 },
];

const recipes = [
  { icon: "🍳", title: "Omelette de aguacate", time: "15 min", match: 100, missing: "Nada", note: "Tienes todo" },
  { icon: "🍝", title: "Pasta cremosa con tomate", time: "25 min", match: 82, missing: "Pasta y crema", note: "Faltan 2 · aprox. L 78" },
  { icon: "🥗", title: "Ensalada fresca de pollo", time: "20 min", match: 68, missing: "Pollo y lechuga", note: "Faltan 2 · aprox. L 112" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [items, setItems] = useState(seedItems);
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [editor, setEditor] = useState<Item | "new" | null>(null);
  const [toast, setToast] = useState("");
  const [cartStore, setCartStore] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const announce = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const startScan = () => fileRef.current?.click();
  const scan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false); setScanDone(true);
      setItems((current) => current.some(i => i.name === "Arroz blanco") ? current : [...current,
        { id: Date.now(), icon: "🍚", name: "Arroz blanco", detail: "Paquete · 2 lb", qty: 1, price: 42.5, freshness: "Despensa", level: 95 },
        { id: Date.now()+1, icon: "🍗", name: "Pechuga de pollo", detail: "Bandeja · 1.5 lb", qty: 1, price: 96, freshness: "Vence en 4 días", level: 58 },
      ]);
    }, 1600);
  };

  const saveItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name")); const qty = Number(data.get("qty")); const price = Number(data.get("price"));
    if (editor === "new") setItems(v => [...v, { id: Date.now(), icon:"🛒", name, detail:"Agregado manualmente", qty, price, freshness:"Sin fecha", level:75 }]);
    else if (editor) setItems(v => v.map(i => i.id === editor.id ? {...i, name, qty, price} : i));
    setEditor(null); announce(editor === "new" ? "Producto agregado" : "Cambios guardados");
  };

  return (
    <main className="app-shell"><div className="phone">
      <header className={`topbar ${tab !== "home" ? "lightbar" : ""}`}>
        <div className="brand"><span className="brand-mark">r</span><span>refill</span></div>
        <div className="header-actions"><button className="tip-shortcut" onClick={() => setTab("tips")} aria-label="Tips de conservación">♧</button><button className="avatar" aria-label="Abrir perfil">EM</button></div>
      </header>

      {tab === "home" && <HomeView items={items} total={total} startScan={startScan} go={setTab} />}
      {tab === "inventory" && <InventoryView items={items} total={total} edit={setEditor} />}
      {tab === "recipes" && <RecipesView go={setTab} />}
      {tab === "delivery" && <DeliveryView selected={cartStore} select={(name) => {setCartStore(name); announce(`Pedido preparado con ${name}`)}} />}
      {tab === "tips" && <TipsView />}

      <input ref={fileRef} className="hidden-input" type="file" accept="image/*" capture="environment" onChange={scan} />
      <BottomNav tab={tab} go={setTab} scan={startScan} />

      {scanning && <div className="scan-overlay"><div className="receipt">▤<span className="scan-line" /></div><h3>Analizando tu factura…</h3><p>La IA está identificando productos, cantidades y precios.</p></div>}
      {scanDone && <div className="modal-backdrop"><div className="result-modal"><button className="modal-x" onClick={() => setScanDone(false)}>×</button><span className="success-check">✓</span><small>FACTURA PROCESADA</small><h2>¡Inventario actualizado!</h2><p>Encontramos 2 productos nuevos por un total de <b>L 138.50</b>.</p><div className="found-item"><span>🍚</span><div><b>Arroz blanco</b><small>1 × L 42.50</small></div><strong>L 42.50</strong></div><div className="found-item"><span>🍗</span><div><b>Pechuga de pollo</b><small>1 × L 96.00</small></div><strong>L 96.00</strong></div><button className="primary-button" onClick={() => {setScanDone(false);setTab("inventory")}}>Revisar inventario</button></div></div>}
      {editor && <div className="modal-backdrop"><form className="edit-modal" onSubmit={saveItem}><button type="button" className="modal-x" onClick={() => setEditor(null)}>×</button><span className="eyebrow dark">{editor === "new" ? "NUEVO PRODUCTO" : "EDITAR PRODUCTO"}</span><h2>{editor === "new" ? "Agregar manualmente" : "Actualiza los datos"}</h2><label>Producto<input name="name" required defaultValue={editor === "new" ? "" : editor.name} placeholder="Ej. Banano" /></label><div className="form-row"><label>Cantidad<input name="qty" type="number" min="1" required defaultValue={editor === "new" ? 1 : editor.qty} /></label><label>Precio total (L)<input name="price" type="number" step="0.01" min="0" required defaultValue={editor === "new" ? "" : editor.price} /></label></div><button className="primary-button">Guardar producto</button></form></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div></main>
  );
}

function HomeView({items,total,startScan,go}:{items:Item[];total:number;startScan:()=>void;go:(t:Tab)=>void}) {
  return <><section className="hero"><span className="eyebrow">TU COCINA, MÁS INTELIGENTE</span><h1>Hola, Elo <span>👋</span></h1><p>Convierte tu factura en un inventario en segundos.</p><button className="scan-card" onClick={startScan}><span className="scan-icon">▣</span><span className="scan-copy"><strong>Escanear factura</strong><small>Toma una foto o sube una imagen</small></span><span className="arrow">›</span></button></section><section className="content">
    <div className="summary-row"><div className="summary"><span className="summary-icon green">▦</span><div><b>{items.reduce((s,i)=>s+i.qty,0)}</b><small>unidades registradas</small></div></div><div className="summary"><span className="summary-icon blue">L</span><div><b>{total.toFixed(2)}</b><small>valor estimado</small></div></div></div>
    <div className="section-heading"><div><span className="eyebrow dark">INVENTARIO RECIENTE</span><h2>Lo que tienes en casa</h2></div><button onClick={()=>go("inventory")}>Ver todo</button></div><ItemList items={items.slice(0,3)} />
    <button className="recipe-teaser" onClick={()=>go("recipes")}><span className="spark">✦</span><span><small>IDEAS CON LO QUE TIENES</small><strong>3 recetas listas para cocinar</strong></span><span>›</span></button>
    <button className="daily-tip" onClick={()=>go("tips")}><span>🌿</span><div><small>TIP DEL DÍA</small><b>Haz que tu culantro dure hasta 2 semanas</b></div><span>›</span></button>
  </section></>;
}

function InventoryView({items,total,edit}:{items:Item[];total:number;edit:(i:Item|"new")=>void}) {
  const [query,setQuery]=useState(""); const filtered=items.filter(i=>i.name.toLowerCase().includes(query.toLowerCase()));
  return <section className="screen"><span className="eyebrow dark">MI COCINA</span><div className="screen-title"><div><h1>Inventario</h1><p>{items.length} tipos de productos · L {total.toFixed(2)}</p></div><button className="add-button" onClick={()=>edit("new")}>＋</button></div><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar un producto" /></div><div className="filter-row"><button className="selected">Todos</button><button>Por vencer</button><button>Refrigerados</button></div><div className="inventory-list"><ItemList items={filtered} editable edit={edit} /></div><button className="manual-add" onClick={()=>edit("new")}>＋ Agregar producto manualmente</button></section>;
}

function ItemList({items,editable,edit}:{items:Item[];editable?:boolean;edit?:(i:Item)=>void}) {
  return <div className="item-list">{items.map(item=><article className="item" key={item.id}><span className="food-icon">{item.icon}</span><div className="item-info"><strong>{item.name}</strong><small>{item.detail} · L {item.price.toFixed(2)}</small><div className="fresh-row"><span className={item.level<40?"danger":"ok"}>{item.freshness}</span><i><em style={{width:`${item.level}%`}} /></i></div></div><div className="qty"><b>{item.qty}</b><small>unid.</small></div>{editable&&<button className="edit-button" onClick={()=>edit?.(item)}>•••</button>}</article>)}</div>;
}

function RecipesView({go}:{go:(t:Tab)=>void}) {
  return <section className="screen"><span className="eyebrow dark">GENERADO CON IA</span><div className="screen-title"><div><h1>¿Qué cocinamos?</h1><p>Ideas basadas en tu inventario actual</p></div><span className="ai-badge">✦ IA</span></div><div className="prompt-box"><span>✦</span><div><b>Pídele algo a Refill</b><small>“Algo rápido, saludable y sin horno”</small></div><button>Enviar</button></div><div className="filter-row"><button className="selected">Para hoy</button><button>15 min</button><button>Saludable</button></div><div className="recipe-list">{recipes.map((r,i)=><article className="recipe-card" key={r.title}><div className={`recipe-art art-${i}`}>{r.icon}<span>{r.match}% compatible</span></div><div className="recipe-body"><small>{r.time} · {i===0?"Fácil":"Intermedio"}</small><h3>{r.title}</h3><p className={r.missing==="Nada"?"complete":"missing"}>{r.missing==="Nada"?"✓ ":"＋ "}{r.note}</p>{r.missing!=="Nada"&&<button onClick={()=>go("delivery")}>Comprar lo que falta →</button>}</div></article>)}</div></section>;
}

function DeliveryView({selected,select}:{selected:string;select:(n:string)=>void}) {
  return <section className="screen"><span className="eyebrow dark">DELIVERY</span><div className="screen-title"><div><h1>Completa tu receta</h1><p>Compara precios y recibe en casa</p></div><span className="cart-count">2</span></div><div className="shopping-summary"><span>🛍️</span><div><b>Te faltan 2 ingredientes</b><small>Pasta · Crema de leche</small></div><strong>desde L 269</strong></div><div className="location"><span>⌖</span><div><small>ENTREGAR EN</small><b>Tegucigalpa, Francisco Morazán</b></div><button>Cambiar</button></div><div className="store-heading"><h2>Elige tu supermercado</h2><small>Productos + envío estimado</small></div><div className="store-list">{stores.map((s,i)=><article className={`store ${selected===s.name?"chosen":""}`} key={s.name}><span className="store-logo" style={{background:s.color}}>{s.short}</span><div><b>{s.name}</b><small>{s.time} · Envío L {s.fee}</small></div>{i===2&&<span className="best">MEJOR PRECIO</span>}<strong>L {s.total}</strong><button onClick={()=>select(s.name)}>{selected===s.name?"Elegido":"Elegir"}</button></article>)}</div><p className="disclaimer">Precios demostrativos. La disponibilidad y el total final dependen de cada supermercado.</p></section>;
}

function TipsView() {
  const tips=[{icon:"🌿",title:"Culantro fresco por más tiempo",text:"Lávalo, sécalo muy bien y colócalo en un frasco con un poco de agua. Cubre las hojas suavemente y refrigera.",tag:"Hasta 2 semanas"},{icon:"🥑",title:"Aguacate sin oscurecerse",text:"Guarda la mitad con semilla, añade unas gotas de limón y cúbrela sin dejar aire.",tag:"2–3 días"},{icon:"🍅",title:"Tomates con mejor sabor",text:"Déjalos fuera del refrigerador con el tallo hacia abajo. Refrigera solamente cuando ya estén muy maduros.",tag:"5–7 días"},{icon:"🥬",title:"Hojas verdes crujientes",text:"Envuelve la lechuga en papel absorbente y guárdala en un recipiente ventilado.",tag:"7–10 días"}];
  return <section className="screen"><span className="eyebrow dark">CERO DESPERDICIO</span><div className="screen-title"><div><h1>Conserva mejor</h1><p>Tips prácticos para que tus alimentos duren más</p></div><span className="leaf-badge">♧</span></div><div className="tip-feature"><span>🌿</span><small>RECOMENDADO PARA TU INVENTARIO</small><h2>Tu culantro necesita atención</h2><p>Córtale apenas la base de los tallos, ponlo en un vaso con 2 cm de agua y cúbrelo con una bolsa floja antes de refrigerar.</p><div><b>Resultado</b><span>Puede durar hasta 2 semanas</span></div></div><h2 className="more-title">Más consejos para ti</h2><div className="tips-list">{tips.slice(1).map(t=><article className="tip-card" key={t.title}><span>{t.icon}</span><div><h3>{t.title}</h3><p>{t.text}</p><small>{t.tag}</small></div></article>)}</div></section>;
}

function BottomNav({tab,go,scan}:{tab:Tab;go:(t:Tab)=>void;scan:()=>void}) {
  return <nav className="bottom-nav" aria-label="Navegación principal"><button className={tab==="home"?"active":""} onClick={()=>go("home")}><span>⌂</span>Inicio</button><button className={tab==="inventory"?"active":""} onClick={()=>go("inventory")}><span>▦</span>Inventario</button><button className="center-action" onClick={scan} aria-label="Escanear factura"><span>▣</span></button><button className={tab==="recipes"?"active":""} onClick={()=>go("recipes")}><span>✦</span>Recetas</button><button className={tab==="delivery"?"active":""} onClick={()=>go("delivery")}><span>◎</span>Comprar</button></nav>;
}
