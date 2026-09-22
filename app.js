const seedProducts=[
{id:"1001",name:"Premium Coffee",category:"Coffee",price:120,stock:18,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80"},
{id:"1002",name:"Classic Burger",category:"Food",price:185,stock:12,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"},
{id:"1003",name:"Fresh Juice",category:"Drinks",price:90,stock:25,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80"},
{id:"1004",name:"Chocolate Cake",category:"Desserts",price:150,stock:7,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"}
];

const $=s=>document.querySelector(s);
const getProducts=()=>JSON.parse(localStorage.getItem("shishti_products")||"null")||seedProducts;
const saveProducts=p=>localStorage.setItem("shishti_products",JSON.stringify(p));
const getOrders=()=>JSON.parse(localStorage.getItem("shishti_orders")||"[]");
const money=n=>"EGP "+Number(n).toLocaleString("en-EG",{maximumFractionDigits:0});
const toast=m=>{const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)};
let cart=JSON.parse(localStorage.getItem("shishti_cart")||"[]");
const saveCart=()=>localStorage.setItem("shishti_cart",JSON.stringify(cart));

if(document.body.dataset.page==="store") initStore();
if(document.body.dataset.page==="admin") initAdmin();

function initStore(){
 renderCategories();renderProducts();
 $("#search").addEventListener("input",renderProducts);
 $("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;
 $("#checkoutBtn").onclick=()=>{if(!cart.length)return toast("Your cart is empty");openModal("checkoutModal")};
 $("#checkoutForm").onsubmit=placeOrder;
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
 updateCartCount();
}
let activeCategory="All";
function renderCategories(){
 const cats=["All",...new Set(getProducts().map(p=>p.category).filter(Boolean))];
 $("#categories").innerHTML=cats.map(c=>`<button class="chip ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
 document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderCategories();renderProducts()});
}
function renderProducts(){
 const q=$("#search").value.toLowerCase();
 const products=getProducts().filter(p=>(activeCategory==="All"||p.category===activeCategory)&&p.name.toLowerCase().includes(q));
 $("#productGrid").innerHTML=products.map(p=>`<article class="product-card"><div class="product-img"><img src="${p.image||placeholder()}" alt="${escapeHtml(p.name)}" onerror="this.src='https://placehold.co/600x600/181818/ffffff?text=SHISHTI'"></div><div class="product-info"><small>${escapeHtml(p.category||"General")}</small><h3>${escapeHtml(p.name)}</h3><div class="price-row"><span class="price">${money(p.price)}</span><button class="add-btn" onclick="addToCart('${p.id}')">+</button></div></div></article>`).join("")||'<div class="empty">No products found.</div>';
}
function addToCart(id){const p=getProducts().find(x=>x.id===id);if(!p||p.stock<1)return toast("Product is out of stock");const x=cart.find(i=>i.id===id);if(x){if(x.qty>=p.stock)return toast("No more stock available");x.qty++}else cart.push({id,qty:1});saveCart();updateCartCount();toast("Added to cart");}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0)}
function openCart(){renderCart();$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
function renderCart(){
 const ps=getProducts();let total=0;
 $("#cartItems").innerHTML=cart.map(i=>{const p=ps.find(x=>x.id===i.id);if(!p)return"";total+=p.price*i.qty;return`<div class="cart-row"><img src="${p.image}" alt=""><div><strong>${escapeHtml(p.name)}</strong><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button>${i.qty}<button onclick="changeQty('${p.id}',1)">+</button></div></div><b>${money(p.price*i.qty)}</b></div>`}).join("")||'<div class="empty" style="margin-top:20px">Your cart is empty.</div>';
 $("#cartTotal").textContent=money(total);
}
function changeQty(id,d){const p=getProducts().find(x=>x.id===id),i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);if(p&&i.qty>p.stock)i.qty=p.stock;saveCart();updateCartCount();renderCart()}
function placeOrder(e){e.preventDefault();const f=new FormData(e.target),products=getProducts();const items=cart.map(i=>{const p=products.find(x=>x.id===i.id);return{id:p.id,name:p.name,qty:i.qty,price:p.price}});const total=items.reduce((a,i)=>a+i.price*i.qty,0);const orders=getOrders();orders.unshift({id:"S-"+Date.now().toString().slice(-6),customer:f.get("name"),phone:f.get("phone"),address:f.get("address"),payment:f.get("payment"),items,total,status:"Pending",date:new Date().toLocaleString()});saveProducts(products.map(p=>{const i=cart.find(x=>x.id===p.id);return i?{...p,stock:Math.max(0,p.stock-i.qty)}:p}));localStorage.setItem("shishti_orders",JSON.stringify(orders));cart=[];saveCart();updateCartCount();e.target.reset();closeModal("checkoutModal");closeCart();toast("Order placed successfully");}

function initAdmin(){
 renderInventory();renderOrders();updateStats();
 $("#addManual").onclick=()=>openProductModal();
 $("#openScanner").onclick=()=>{openModal("scannerModal");startScanner()};
 $("#lookupBarcode").onclick=()=>lookupBarcode($("#barcodeInput").value.trim());
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{if(b.dataset.close==="scannerModal")stopScanner();closeModal(b.dataset.close)});
 $("#productForm").onsubmit=saveProduct;
}
function renderInventory(){
 const p=getProducts();$("#inventory").innerHTML=p.map(x=>`<tr><td><div class="table-product"><img src="${x.image||placeholder()}"><div><strong>${escapeHtml(x.name)}</strong><small style="display:block;color:#666">${x.id}</small></div></div></td><td>${escapeHtml(x.category||"General")}</td><td>${money(x.price)}</td><td>${x.stock}</td><td><span class="status ${x.stock<5?"low":""}">${x.stock<5?"Low stock":"In stock"}</span></td><td><button class="action-btn" onclick="editProduct('${x.id}')">Edit</button></td></tr>`).join("");
}
function renderOrders(){
 const o=getOrders();$("#orders").innerHTML=o.length?o.slice(0,8).map(x=>`<div class="order"><div><strong>${x.id} · ${escapeHtml(x.customer)}</strong><p>${x.items.map(i=>i.qty+"× "+escapeHtml(i.name)).join(", ")}</p><p>${escapeHtml(x.address)} · ${escapeHtml(x.phone)}</p></div><div style="text-align:right"><b>${money(x.total)}</b><p>${x.status}</p></div></div>`).join(""):'<div class="empty">No orders yet. Place an order from the Store page to see it here.</div>';
}
function updateStats(){const p=getProducts(),o=getOrders();$("#statProducts").textContent=p.length;$("#statOrders").textContent=o.length;$("#statPending").textContent=o.filter(x=>x.status==="Pending").length;$("#statSales").textContent=money(o.reduce((a,x)=>a+x.total,0))}
function openProductModal(product=null){
 $("#productModalTitle").textContent=product?"Edit product":"Add product";
 const f=$("#productForm");f.reset();f.elements.id.value=product?.id||"";f.elements.name.value=product?.name||"";f.elements.category.value=product?.category||"";f.elements.price.value=product?.price??"";f.elements.stock.value=product?.stock??"";f.elements.image.value=product?.image||"";$("#previewName").textContent=product?.name||"New product";$("#previewImage").src=product?.image||placeholder();$("#previewSource").textContent=product?"Saved product":"Manual product";openModal("productModal");
}
function editProduct(id){openProductModal(getProducts().find(p=>p.id===id))}
function saveProduct(e){e.preventDefault();const f=new FormData(e.target),p=getProducts(),id=f.get("id")||"P-"+Date.now();const item={id,name:f.get("name"),category:f.get("category")||"General",price:Number(f.get("price")),stock:Number(f.get("stock")),image:f.get("image")||placeholder()};const idx=p.findIndex(x=>x.id===id);if(idx>=0)p[idx]=item;else p.unshift(item);saveProducts(p);closeModal("productModal");renderInventory();renderProductsIfStore();updateStats();toast("Product saved")}
async function lookupBarcode(code){
 if(!code)return toast("Enter a barcode first");
 $("#lookupStatus").textContent="Looking up product information...";
 try{
  const r=await fetch("https://world.openfoodfacts.org/api/v2/product/"+encodeURIComponent(code)+".json");
  const d=await r.json();
  if(!d.product||d.status===0){$("#lookupStatus").textContent="No public product record found. You can still add it manually.";openProductModal({id:code,name:"",category:"General",price:"",stock:0,image:""});return}
  const x=d.product;$("#lookupStatus").textContent="Product found. Review the details, then add your price and stock.";
  stopScanner();closeModal("scannerModal");
  openProductModal({id:code,name:x.product_name||x.product_name_en||"Scanned product",category:x.categories_tags?.[0]?.replace("en:","")||"General",price:"",stock:0,image:x.image_front_url||x.image_url||""});
 }catch(err){$("#lookupStatus").textContent="Lookup failed. Check internet access or add the product manually.";openProductModal({id:code,name:"Scanned product",category:"General",price:"",stock:0,image:""})}
}
let scannerStream=null,scannerTimer=null;
async function startScanner(){
 try{
  if(!("BarcodeDetector" in window)){ $("#lookupStatus").textContent="Live barcode scanning is not supported by this browser. Use the barcode field below.";return}
  const detector=new BarcodeDetector({formats:["qr_code","ean_13","ean_8","upc_a","upc_e","code_128","code_39","itf"]});
  scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});
  const v=$("#scannerVideo");v.srcObject=scannerStream;await v.play();
  scannerTimer=setInterval(async()=>{try{const codes=await detector.detect(v);if(codes.length&&codes[0].rawValue){$("#barcodeInput").value=codes[0].rawValue;lookupBarcode(codes[0].rawValue)}}catch{}},500);
 }catch{$("#lookupStatus").textContent="Camera access is unavailable. Enter the barcode manually."}
}
function stopScanner(){if(scannerTimer)clearInterval(scannerTimer);scannerTimer=null;if(scannerStream)scannerStream.getTracks().forEach(t=>t.stop());scannerStream=null}
function openModal(id){$("#"+id).classList.add("show")}
function closeModal(id){$("#"+id).classList.remove("show");if(id==="scannerModal")stopScanner()}
function renderProductsIfStore(){if(document.body.dataset.page==="store"){renderCategories();renderProducts()}}
function placeholder(){return"https://placehold.co/600x600/181818/ffffff?text=SHISHTI"}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
