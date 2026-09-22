const seedProducts = [
  {id:"1001",name:"Premium Coffee",category:"Coffee",price:120,stock:18,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80"},
  {id:"1002",name:"Classic Burger",category:"Food",price:185,stock:12,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80"},
  {id:"1003",name:"Fresh Juice",category:"Drinks",price:90,stock:25,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&q=80"},
  {id:"1004",name:"Chocolate Cake",category:"Desserts",price:150,stock:7,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80"}
];

const $ = s => document.querySelector(s);
const page = document.body.dataset.page;
const placeholder = () => "https://placehold.co/700x700/171717/ffffff?text=SHISHTI";
const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const money = n => "EGP " + Number(n||0).toLocaleString("en-EG",{maximumFractionDigits:0});
const toast = m => { const t=$("#toast"); if(!t)return; t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); };

function getProducts(){
  const raw=localStorage.getItem("shishti_products");
  if(raw===null){ localStorage.setItem("shishti_products",JSON.stringify(seedProducts)); return [...seedProducts]; }
  try{return JSON.parse(raw)||[]}catch{return []}
}
function saveProducts(p){localStorage.setItem("shishti_products",JSON.stringify(p));}
function getOrders(){try{return JSON.parse(localStorage.getItem("shishti_orders")||"[]")}catch{return []}}
function getUsers(){try{return JSON.parse(localStorage.getItem("shishti_users")||"[]")}catch{return []}}
function saveUsers(u){localStorage.setItem("shishti_users",JSON.stringify(u));}
function currentUser(){const id=localStorage.getItem("shishti_current_user");return getUsers().find(u=>u.id===id)||null;}

const LANG={
 en:{
  navShop:"Shop",navAbout:"About",online:"SHISHTI ONLINE",heroTitle:"Everything you want.<br><span>One place.</span>",heroText:"Discover the SHISHTI collection, add what you need to your cart and place your order in a few simple steps.",explore:"Explore products",createAccount:"Create account",fast:"Fast ordering",customerAccount:"Customer account",liveStock:"Live stock",collection:"COLLECTION",shopProducts:"Shop products",search:"Search products...",yourAccount:"YOUR SHISHTI ACCOUNT",orderFaster:"Order faster next time.",accountText:"Save your details, view your demo orders and keep your shopping experience in one place.",openAccount:"Open account",yourBag:"YOUR BAG",shoppingCart:"Shopping cart",total:"Total",checkout:"Continue to checkout",account:"SHISHTI ACCOUNT",signIn:"Sign in",fullName:"Full name",email:"Email",password:"Password",demoStorage:"Demo only: account data is stored in this browser's localStorage.",myAccount:"MY ACCOUNT",viewOrders:"View my orders",signOut:"Sign out",completeOrder:"Complete your order",phone:"Phone number",address:"Delivery address",payment:"Payment method",cod:"Cash on delivery",onlineDemo:"Online payment (demo)",placeOrder:"Place order",controlCenter:"STORE CONTROL CENTER",adminDashboard:"ADMIN DASHBOARD",runStore:"Run your store.",adminText:"Manage inventory, scan products, review orders and keep the online store synchronized.",scanAdd:"＋ Scan & add product",products:"PRODUCTS",liveInStore:"Live in store",orders:"ORDERS",allOrders:"All customer orders",pending:"PENDING",needAttention:"Need attention",sales:"SALES",demoSales:"Demo order value",inventory:"INVENTORY",addManually:"＋ Add manually",product:"Product",category:"Category",price:"Price",stock:"Stock",status:"Status",customerActivity:"CUSTOMER ACTIVITY",recentOrders:"Recent orders",scanner:"INVENTORY SCANNER",scanProduct:"Scan a product",scannerText:"Scan the barcode or QR code on the package. We will try to find public product information, then you add your own price and quantity.",barcode:"Enter barcode manually",lookup:"Lookup",productName:"Product name",yourPrice:"Your price (EGP)",quantity:"Quantity in stock",imageUrl:"Image URL",saveProduct:"Save product"
 },
 ar:{
  navShop:"المتجر",navAbout:"عن شِشتي",online:"متجر شِشتي",heroTitle:"كل ما تحتاجه.<br><span>في مكان واحد.</span>",heroText:"اكتشف منتجات شِشتي، أضف ما تحتاجه إلى السلة ونفّذ طلبك في خطوات بسيطة.",explore:"استعرض المنتجات",createAccount:"إنشاء حساب",fast:"طلب سريع",customerAccount:"حساب عميل",liveStock:"مخزون محدث",collection:"المجموعة",shopProducts:"تصفح المنتجات",search:"ابحث عن منتج...",yourAccount:"حساب شِشتي",orderFaster:"اطلب أسرع في المرة القادمة.",accountText:"احفظ بياناتك وشاهد طلباتك واجعل تجربة التسوق كلها في مكان واحد.",openAccount:"فتح الحساب",yourBag:"سلتك",shoppingCart:"سلة التسوق",total:"الإجمالي",checkout:"متابعة الدفع",account:"حساب شِشتي",signIn:"تسجيل الدخول",fullName:"الاسم الكامل",email:"البريد الإلكتروني",password:"كلمة المرور",demoStorage:"نسخة تجريبية: بيانات الحساب محفوظة في localStorage على هذا المتصفح.",myAccount:"حسابي",viewOrders:"عرض طلباتي",signOut:"تسجيل الخروج",completeOrder:"إكمال الطلب",phone:"رقم الهاتف",address:"عنوان التوصيل",payment:"طريقة الدفع",cod:"الدفع عند الاستلام",onlineDemo:"الدفع الإلكتروني (تجريبي)",placeOrder:"تأكيد الطلب",controlCenter:"مركز تحكم المتجر",adminDashboard:"لوحة تحكم الإدارة",runStore:"أدر متجرك.",adminText:"أدر المخزون، امسح المنتجات، راجع الطلبات وحافظ على تزامن المتجر الإلكتروني.",scanAdd:"＋ مسح وإضافة منتج",products:"المنتجات",liveInStore:"المنتجات المعروضة",orders:"الطلبات",allOrders:"كل طلبات العملاء",pending:"قيد الانتظار",needAttention:"تحتاج متابعة",sales:"المبيعات",demoSales:"قيمة الطلبات التجريبية",inventory:"المخزون",addManually:"＋ إضافة يدويًا",product:"المنتج",category:"التصنيف",price:"السعر",stock:"المخزون",status:"الحالة",customerActivity:"نشاط العملاء",recentOrders:"أحدث الطلبات",scanner:"ماسح المخزون",scanProduct:"مسح منتج",scannerText:"امسح الباركود أو QR على العبوة. سنحاول جلب بيانات المنتج ثم تضيف السعر والكمية.",barcode:"أدخل الباركود يدويًا",lookup:"بحث",productName:"اسم المنتج",yourPrice:"السعر (جنيه)",quantity:"الكمية المتوفرة",imageUrl:"رابط الصورة",saveProduct:"حفظ المنتج"
 }
};

let currentLang=localStorage.getItem("shishti_lang")||"en";
let activeCategory="__ALL__";
let authMode="login";
let cart=(()=>{try{return JSON.parse(localStorage.getItem("shishti_cart")||"[]")}catch{return []}})();
let scannerStream=null,scannerTimer=null;

function applyLanguage(){
  const d=LANG[currentLang];
  document.documentElement.lang=currentLang;
  document.documentElement.dir=currentLang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(d[k]!=null)el.textContent=d[k]});
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{const k=el.dataset.i18nHtml;if(d[k]!=null)el.innerHTML=d[k]});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{const k=el.dataset.i18nPlaceholder;if(d[k]!=null)el.placeholder=d[k]});
  const b=$("#langBtn"); if(b)b.textContent=currentLang==="en"?"العربية":"English";
  document.title=page==="admin"?(currentLang==="ar"?"شِشتي | لوحة التحكم":"SHISHTI | Admin Dashboard"):(currentLang==="ar"?"شِشتي | المتجر":"SHISHTI | Online Store");
}
function toggleLanguage(){
  currentLang=currentLang==="en"?"ar":"en";
  localStorage.setItem("shishti_lang",currentLang);
  applyLanguage();
  if(page==="store"){renderCategories();renderProducts();updateAccountButton();}
  else {renderInventory();renderOrders();updateStats();}
}

function openModal(id){const el=$("#"+id);if(el)el.classList.add("show")}
function closeModal(id){const el=$("#"+id);if(el)el.classList.remove("show");if(id==="scannerModal")stopScanner()}

function initStore(){
  applyLanguage();
  $("#langBtn")?.addEventListener("click",toggleLanguage);
  $("#checkoutForm")?.addEventListener("submit",placeOrder);
  $("#search")?.addEventListener("input",renderProducts);
  $("#cartBtn")?.addEventListener("click",openCart);
  $("#closeCart")?.addEventListener("click",closeCart);
  $("#overlay")?.addEventListener("click",closeCart);
  $("#checkoutBtn")?.addEventListener("click",()=>{
    if(!cart.length)return toast(currentLang==="ar"?"السلة فارغة":"Your cart is empty");
    if(!currentUser()){openAccount("login");return toast(currentLang==="ar"?"سجّل الدخول أولاً لإكمال الطلب":"Sign in before checkout")}
    openCheckout();
  });
  $("#accountBtn")?.addEventListener("click",()=>openAccount());
  $("#heroAccount")?.addEventListener("click",()=>openAccount("register"));
  $("#stripAccount")?.addEventListener("click",()=>openAccount());
  $("#loginTab")?.addEventListener("click",()=>setAuthMode("login"));
  $("#registerTab")?.addEventListener("click",()=>setAuthMode("register"));
  $("#authForm")?.addEventListener("submit",handleAuth);
  $("#logoutBtn")?.addEventListener("click",logout);
  $("#ordersBtn")?.addEventListener("click",renderAccountOrders);
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  renderCategories();renderProducts();updateCartCount();updateAccountButton();
  window.addEventListener("storage",syncStore);
}
function syncStore(e){
  if(["shishti_products","shishti_orders","shishti_current_user","shishti_users"].includes(e.key)){
    renderCategories();renderProducts();updateAccountButton();
    if($("#accountModal")?.classList.contains("show"))refreshAccountView();
  }
}
function renderCategories(){
  const cats=getProducts().map(p=>p.category).filter(Boolean);
  const unique=[...new Set(cats)];
  $("#categories").innerHTML=[{label:currentLang==="ar"?"الكل":"All",value:"__ALL__"},...unique.map(c=>({label:c,value:c}))]
    .map(c=>'<button class="chip '+(activeCategory===c.value?"active":"")+'" data-cat="'+escapeHtml(c.value)+'">'+escapeHtml(c.label)+"</button>").join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.cat;renderCategories();renderProducts()}));
}
function renderProducts(){
  const q=(($("#search")?.value)||"").toLowerCase();
  const ps=getProducts().filter(p=>(activeCategory==="__ALL__"||p.category===activeCategory)&&String(p.name).toLowerCase().includes(q));
  $("#productGrid").innerHTML=ps.map(p=>`
    <article class="product-card">
      <div class="product-img"><img src="${escapeHtml(p.image||placeholder())}" alt="${escapeHtml(p.name)}" onerror="this.src='${placeholder()}'"></div>
      <div class="product-info"><small>${escapeHtml(p.category||"General")}</small><h3>${escapeHtml(p.name)}</h3>
      <div class="price-row"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${escapeHtml(p.id)}">+</button></div></div>
    </article>`).join("")||'<div class="empty">'+(currentLang==="ar"?"لا توجد منتجات.":"No products found.")+"</div>";
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add)));
}
function addToCart(id){
  const p=getProducts().find(x=>x.id===id); if(!p||p.stock<1)return toast(currentLang==="ar"?"المنتج غير متوفر":"Product is out of stock");
  const x=cart.find(i=>i.id===id);
  if(x){if(x.qty>=p.stock)return toast(currentLang==="ar"?"لا توجد كمية إضافية متاحة":"No more stock available");x.qty++}else cart.push({id,qty:1});
  saveCart();updateCartCount();toast(currentLang==="ar"?"تمت إضافة المنتج للسلة":"Added to cart");
}
function saveCart(){localStorage.setItem("shishti_cart",JSON.stringify(cart))}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0)}
function openCart(){renderCart();$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
function renderCart(){
  const products=getProducts();let total=0;
  $("#cartItems").innerHTML=cart.map(i=>{
    const p=products.find(x=>x.id===i.id);if(!p)return "";
    total+=p.price*i.qty;
    return `<div class="cart-row"><img src="${escapeHtml(p.image||placeholder())}"><div><strong>${escapeHtml(p.name)}</strong><div class="qty"><button data-minus="${p.id}">−</button>${i.qty}<button data-plus="${p.id}">+</button></div></div><b>${money(p.price*i.qty)}</b></div>`;
  }).join("")||'<div class="empty" style="margin-top:20px">'+(currentLang==="ar"?"السلة فارغة.":"Your cart is empty.")+"</div>";
  $("#cartTotal").textContent=money(total);
  document.querySelectorAll("[data-minus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.minus,-1)));
  document.querySelectorAll("[data-plus]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.plus,1)));
}
function changeQty(id,d){
  const p=getProducts().find(x=>x.id===id),i=cart.find(x=>x.id===id);if(!i)return;
  i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);if(p&&i.qty>p.stock)i.qty=p.stock;
  saveCart();updateCartCount();renderCart();
}
function openCheckout(){const u=currentUser();$("#checkoutName").value=u?.name||"";openModal("checkoutModal")}
function placeOrder(e){
  e.preventDefault();const u=currentUser();if(!u)return openAccount("login");
  const f=new FormData(e.target),products=getProducts();
  const items=cart.map(i=>{const p=products.find(x=>x.id===i.id);return p?{id:p.id,name:p.name,qty:i.qty,price:p.price}:null}).filter(Boolean);
  if(!items.length)return toast(currentLang==="ar"?"السلة فارغة":"Your cart is empty");
  const total=items.reduce((a,i)=>a+i.price*i.qty,0),orders=getOrders();
  orders.unshift({id:"S-"+Date.now().toString().slice(-6),userId:u.id,customer:f.get("name"),email:u.email,phone:f.get("phone"),address:f.get("address"),payment:f.get("payment"),items,total,status:"Pending",date:new Date().toLocaleString()});
  localStorage.setItem("shishti_orders",JSON.stringify(orders));
  saveProducts(products.map(p=>{const i=cart.find(x=>x.id===p.id);return i?{...p,stock:Math.max(0,p.stock-i.qty)}:p}));
  cart=[];saveCart();updateCartCount();e.target.reset();closeModal("checkoutModal");closeCart();
  toast(currentLang==="ar"?"تم إرسال الطلب بنجاح":"Order placed successfully");
}
function openAccount(mode){if(mode)setAuthMode(mode);refreshAccountView();openModal("accountModal")}
function refreshAccountView(){
  const u=currentUser();$("#authView").classList.toggle("hidden",!!u);$("#profileView").classList.toggle("hidden",!u);
  if(u){$("#profileName").textContent=u.name;$("#profileEmail").textContent=u.email;renderAccountOrders()}
}
function updateAccountButton(){const u=currentUser();$("#accountBtn").textContent=u?u.name.split(" ")[0]:(currentLang==="ar"?"الحساب":"Account")}
function setAuthMode(mode){
  authMode=mode;$("#loginTab").classList.toggle("active",mode==="login");$("#registerTab").classList.toggle("active",mode==="register");
  $("#nameField").classList.toggle("hidden",mode!=="register");$("#nameField input").required=mode==="register";$("#authTitle").textContent=mode==="register"?(currentLang==="ar"?"إنشاء حساب":"Create your account"):(currentLang==="ar"?"مرحباً بعودتك":"Welcome back");
  $("#authSubtitle").textContent=mode==="register"?(currentLang==="ar"?"أنشئ حساباً تجريبياً محلياً لحفظ بياناتك.":"Create a local demo account to save your shopping details."):(currentLang==="ar"?"سجّل الدخول لحفظ بياناتك ومشاهدة طلباتك.":"Sign in to save your details and view your orders.");
  $("#authSubmit").textContent=mode==="register"?LANG[currentLang].createAccount:LANG[currentLang].signIn;
  $("#authForm").reset();
}
function handleAuth(e){
  e.preventDefault();const f=new FormData(e.target),email=String(f.get("email")||"").trim().toLowerCase(),password=String(f.get("password")||"");
  if(!email||!password)return toast(currentLang==="ar"?"أدخل البريد وكلمة المرور":"Enter email and password");
  const users=getUsers();
  if(authMode==="register"){
    const name=String(f.get("name")||"").trim();if(!name)return toast(currentLang==="ar"?"أدخل الاسم الكامل":"Enter your full name");
    if(users.some(u=>u.email===email))return toast(currentLang==="ar"?"هذا البريد مسجل بالفعل":"An account with this email already exists");
    const u={id:"U-"+Date.now(),name,email,password};users.push(u);saveUsers(users);localStorage.setItem("shishti_current_user",u.id);refreshAccountView();updateAccountButton();toast(currentLang==="ar"?"تم إنشاء الحساب":"Account created");
  }else{
    const u=users.find(x=>x.email===email&&x.password===password);if(!u)return toast(currentLang==="ar"?"البريد أو كلمة المرور غير صحيحة":"Email or password is incorrect");
    localStorage.setItem("shishti_current_user",u.id);refreshAccountView();updateAccountButton();toast(currentLang==="ar"?"تم تسجيل الدخول":"Signed in");
  }
}
function logout(){localStorage.removeItem("shishti_current_user");refreshAccountView();updateAccountButton();toast(currentLang==="ar"?"تم تسجيل الخروج":"Signed out")}
function renderAccountOrders(){
  const u=currentUser();if(!u)return;const orders=getOrders().filter(o=>o.userId===u.id);
  $("#accountOrders").innerHTML=orders.length?orders.map(o=>`<div class="mini-order"><b>${o.id} · ${money(o.total)}</b><span>${escapeHtml(o.status)} · ${escapeHtml(o.date)}</span></div>`).join(""):'<div class="mini-order">'+(currentLang==="ar"?"لا توجد طلبات بعد.":"No orders yet.")+"</div>";
}

function initAdmin(){
  applyLanguage();$("#langBtn")?.addEventListener("click",toggleLanguage);
  $("#addManual")?.addEventListener("click",()=>openProductModal());
  $("#openScanner")?.addEventListener("click",()=>{openModal("scannerModal");startScanner()});
  $("#lookupBarcode")?.addEventListener("click",()=>lookupBarcode($("#barcodeInput").value.trim()));
  $("#productForm")?.addEventListener("submit",saveProduct);
  $("#adminLogout")?.addEventListener("click",()=>toast(currentLang==="ar"?"تم إغلاق جلسة العرض":"Demo session closed"));
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  renderInventory();renderOrders();updateStats();
  window.addEventListener("storage",syncAdmin);
}
function syncAdmin(e){if(["shishti_products","shishti_orders"].includes(e.key)){renderInventory();renderOrders();updateStats()}}
function renderInventory(){
  const p=getProducts();
  $("#inventory").innerHTML=p.map(x=>`<tr><td><div class="table-product"><img src="${escapeHtml(x.image||placeholder())}"><div><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.id)}</small></div></div></td><td>${escapeHtml(x.category||"General")}</td><td>${money(x.price)}</td><td>${x.stock}</td><td><span class="status ${x.stock<5?"low":""}">${x.stock<5?(currentLang==="ar"?"مخزون منخفض":"Low stock"):(currentLang==="ar"?"متوفر":"In stock")}</span></td><td><button class="action-btn" data-edit="${escapeHtml(x.id)}">${currentLang==="ar"?"تعديل":"Edit"}</button></td></tr>`).join("");
  document.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editProduct(b.dataset.edit)));
}
function renderOrders(){
  const o=getOrders();
  $("#orders").innerHTML=o.length?o.slice(0,10).map(x=>`<div class="order"><div><strong>${escapeHtml(x.id)} · ${escapeHtml(x.customer)}</strong><p>${x.items.map(i=>`${i.qty}× ${escapeHtml(i.name)}`).join(", ")}</p><p>${escapeHtml(x.address)} · ${escapeHtml(x.phone)}</p></div><div style="text-align:right"><b>${money(x.total)}</b><p>${escapeHtml(x.status)}</p></div></div>`).join(""):'<div class="empty">'+(currentLang==="ar"?"لا توجد طلبات بعد. الطلبات من المتجر ستظهر هنا تلقائياً.":"No orders yet. Orders placed from the store appear here automatically.")+"</div>";
}
function updateStats(){
  const p=getProducts(),o=getOrders();$("#statProducts").textContent=p.length;$("#statOrders").textContent=o.length;$("#statPending").textContent=o.filter(x=>x.status==="Pending").length;$("#statSales").textContent=money(o.reduce((a,x)=>a+Number(x.total||0),0));
}
function openProductModal(product){
  const f=$("#productForm");f.reset();const exists=!!product&&getProducts().some(x=>x.id===product.id);
  $("#productModalTitle").textContent=exists?(currentLang==="ar"?"تعديل المنتج":"Edit product"):(currentLang==="ar"?"إضافة منتج":"Add product");
  f.elements.id.value=product?.id||"";f.elements.name.value=product?.name||"";f.elements.category.value=product?.category||"";f.elements.price.value=product?.price??"";f.elements.stock.value=product?.stock??"";f.elements.image.value=product?.image||"";
  $("#previewName").textContent=product?.name||(currentLang==="ar"?"منتج جديد":"New product");$("#previewImage").src=product?.image||placeholder();$("#previewSource").textContent=product?.source||(currentLang==="ar"?"إضافة يدوية":"Manual product");
  openModal("productModal");
}
function editProduct(id){const p=getProducts().find(x=>x.id===id);if(p)openProductModal(p)}
function saveProduct(e){
  e.preventDefault();
  const f=new FormData(e.target),products=getProducts(),id=String(f.get("id")||"P-"+Date.now()),name=String(f.get("name")||"").trim(),category=String(f.get("category")||"General").trim()||"General",price=Number(f.get("price")),stock=Number(f.get("stock")),image=String(f.get("image")||"").trim();
  if(!name||!Number.isFinite(price)||price<0||!Number.isFinite(stock)||stock<0)return toast(currentLang==="ar"?"أكمل بيانات المنتج بشكل صحيح":"Complete the product details correctly");
  const item={id,name,category,price,stock,image:image||placeholder()};const idx=products.findIndex(p=>p.id===id);
  if(idx>=0)products[idx]=item;else products.unshift(item);
  saveProducts(products);closeModal("productModal");renderInventory();updateStats();toast(currentLang==="ar"?"تم حفظ المنتج وسيظهر في المتجر":"Product saved and published to the store");
}
async function lookupBarcode(code){
  if(!code)return toast(currentLang==="ar"?"أدخل الباركود أولاً":"Enter a barcode first");
  $("#lookupStatus").textContent=currentLang==="ar"?"جاري البحث...":"Searching public product data...";
  try{
    const r=await fetch("https://world.openfoodfacts.org/api/v2/product/"+encodeURIComponent(code)+".json"),d=await r.json();
    if(!d.product||d.status===0){stopScanner();closeModal("scannerModal");return openProductModal({id:code,name:"",category:"General",price:"",stock:0,image:"",source:"Barcode scanned"});}
    const x=d.product;stopScanner();closeModal("scannerModal");
    openProductModal({id:code,name:x.product_name||x.product_name_en||"Scanned product",category:x.categories_tags?.[0]?.replace("en:","")||"General",price:"",stock:0,image:x.image_front_url||x.image_url||"",source:"Barcode scanned · public product data"});
  }catch{stopScanner();closeModal("scannerModal");openProductModal({id:code,name:"Scanned product",category:"General",price:"",stock:0,image:"",source:"Barcode scanned"});}
}
async function startScanner(){
  try{
    if(!("BarcodeDetector" in window)){ $("#lookupStatus").textContent=currentLang==="ar"?"المسح المباشر غير مدعوم في هذا المتصفح. استخدم الإدخال اليدوي.":"Live scanning is not supported in this browser. Use the field below.";return; }
    const detector=new BarcodeDetector({formats:["qr_code","ean_13","ean_8","upc_a","upc_e","code_128","code_39","itf"]});
    scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});
    const v=$("#scannerVideo");v.srcObject=scannerStream;await v.play();
    scannerTimer=setInterval(async()=>{try{const codes=await detector.detect(v);if(codes.length&&codes[0].rawValue){$("#barcodeInput").value=codes[0].rawValue;lookupBarcode(codes[0].rawValue)}}catch{}},500);
  }catch{$("#lookupStatus").textContent=currentLang==="ar"?"تعذر الوصول للكاميرا. أدخل الباركود يدوياً.":"Camera access is unavailable. Enter the barcode manually."}
}
function stopScanner(){if(scannerTimer)clearInterval(scannerTimer);scannerTimer=null;if(scannerStream)scannerStream.getTracks().forEach(t=>t.stop());scannerStream=null}

if(page==="store")initStore();
if(page==="admin")initAdmin();
