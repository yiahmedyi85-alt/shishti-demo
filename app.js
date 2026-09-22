
const seedProducts=[
{id:"1001",name:"Premium Coffee",category:"Coffee",price:120,stock:18,image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80"},
{id:"1002",name:"Classic Burger",category:"Food",price:185,stock:12,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80"},
{id:"1003",name:"Fresh Juice",category:"Drinks",price:90,stock:25,image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&q=80"},
{id:"1004",name:"Chocolate Cake",category:"Desserts",price:150,stock:7,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80"}];

var $=function(s){return document.querySelector(s)};
var getProducts=function(){var x=localStorage.getItem("shishti_products");if(x===null){localStorage.setItem("shishti_products",JSON.stringify(seedProducts));return seedProducts}try{return JSON.parse(x)||[]}catch(e){return[]}};
var saveProducts=function(p){localStorage.setItem("shishti_products",JSON.stringify(p))};
var getOrders=function(){try{return JSON.parse(localStorage.getItem("shishti_orders")||"[]")}catch(e){return[]}};
var getUsers=function(){try{return JSON.parse(localStorage.getItem("shishti_users")||"[]")}catch(e){return[]}};
var saveUsers=function(u){localStorage.setItem("shishti_users",JSON.stringify(u))};
var currentUser=function(){var id=localStorage.getItem("shishti_current_user");return getUsers().find(function(u){return u.id===id})||null};
var money=function(n){return "EGP "+Number(n||0).toLocaleString("en-EG",{maximumFractionDigits:0})};
var placeholder=function(){return "https://placehold.co/700x700/171717/ffffff?text=SHISHTI"};
var escapeHtml=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})};
var toast=function(m){var t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");setTimeout(function(){t.classList.remove("show")},2200)};
var cart=JSON.parse(localStorage.getItem("shishti_cart")||"[]");
var activeCategory="All",authMode="login",scannerStream=null,scannerTimer=null;

if(document.body.dataset.page==="store")initStore();
if(document.body.dataset.page==="admin")initAdmin();

function initStore(){
 renderCategories();renderProducts();updateCartCount();updateAccountButton();
 $("#search").addEventListener("input",renderProducts);
 $("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;
 $("#checkoutBtn").onclick=function(){if(!cart.length)return toast("Your cart is empty");if(!currentUser()){openAccount("login");return toast("Sign in before checkout")}openCheckout()};
 $("#accountBtn").onclick=function(){openAccount()};
 $("#heroAccount").onclick=function(){openAccount("register")};
 $("#stripAccount").onclick=function(){openAccount()};
 $("#loginTab").onclick=function(){setAuthMode("login")};$("#registerTab").onclick=function(){setAuthMode("register")};
 $("#authForm").onsubmit=handleAuth;$("#logoutBtn").onclick=logout;$("#ordersBtn").onclick=renderAccountOrders;
 document.querySelectorAll("[data-close]").forEach(function(b){b.onclick=function(){closeModal(b.dataset.close)}});
 window.addEventListener("storage",syncStore);
}
function syncStore(e){if(["shishti_products","shishti_orders","shishti_current_user","shishti_users"].indexOf(e.key)>=0){renderCategories();renderProducts();updateAccountButton();if($("#accountModal").classList.contains("show"))refreshAccountView()}}
function renderCategories(){var cats=["All"].concat(Array.from(new Set(getProducts().map(function(p){return p.category}).filter(Boolean))));$("#categories").innerHTML=cats.map(function(c){return '<button class="chip '+(c===activeCategory?"active":"")+'" data-cat="'+escapeHtml(c)+'">'+escapeHtml(c)+"</button>"}).join("");document.querySelectorAll("[data-cat]").forEach(function(b){b.onclick=function(){activeCategory=b.dataset.cat;renderCategories();renderProducts()}})}
function renderProducts(){var q=(($("#search")&&$("#search").value)||"").toLowerCase();var ps=getProducts().filter(function(p){return(activeCategory==="All"||p.category===activeCategory)&&p.name.toLowerCase().indexOf(q)>=0});$("#productGrid").innerHTML=ps.map(function(p){return '<article class="product-card"><div class="product-img"><img src="'+(p.image||placeholder())+'" alt="'+escapeHtml(p.name)+'" onerror="this.src=\\''+placeholder()+'\\'"></div><div class="product-info"><small>'+escapeHtml(p.category||"General")+'</small><h3>'+escapeHtml(p.name)+'</h3><div class="price-row"><span class="price">'+money(p.price)+'</span><button class="add-btn" onclick="addToCart(\\''+p.id+'\\')">+</button></div></div></article>'}).join("")||'<div class="empty">No products found.</div>'}
function addToCart(id){var p=getProducts().find(function(x){return x.id===id});if(!p||p.stock<1)return toast("Product is out of stock");var x=cart.find(function(i){return i.id===id});if(x){if(x.qty>=p.stock)return toast("No more stock available");x.qty++}else cart.push({id:id,qty:1});saveCart();updateCartCount();toast("Added to cart")}
function saveCart(){localStorage.setItem("shishti_cart",JSON.stringify(cart))}
function updateCartCount(){$("#cartCount").textContent=cart.reduce(function(a,b){return a+b.qty},0)}
function openCart(){renderCart();$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}
function renderCart(){var ps=getProducts(),total=0;$("#cartItems").innerHTML=cart.map(function(i){var p=ps.find(function(x){return x.id===i.id});if(!p)return"";total+=p.price*i.qty;return '<div class="cart-row"><img src="'+(p.image||placeholder())+'"><div><strong>'+escapeHtml(p.name)+'</strong><div class="qty"><button onclick="changeQty(\\''+p.id+'\\',-1)">−</button>'+i.qty+'<button onclick="changeQty(\\''+p.id+'\\',1)">+</button></div></div><b>'+money(p.price*i.qty)+'</b></div>'}).join("")||'<div class="empty" style="margin-top:20px">Your cart is empty.</div>';$("#cartTotal").textContent=money(total)}
function changeQty(id,d){var p=getProducts().find(function(x){return x.id===id}),i=cart.find(function(x){return x.id===id});if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(function(x){return x.id!==id});if(p&&i.qty>p.stock)i.qty=p.stock;saveCart();updateCartCount();renderCart()}
function openCheckout(){var u=currentUser();$("#checkoutName").value=u?u.name:"";openModal("checkoutModal")}
function placeOrder(e){e.preventDefault();var u=currentUser();if(!u)return openAccount("login");var f=new FormData(e.target),products=getProducts();var items=cart.map(function(i){var p=products.find(function(x){return x.id===i.id});return{id:p.id,name:p.name,qty:i.qty,price:p.price}});var total=items.reduce(function(a,i){return a+i.price*i.qty},0);var orders=getOrders();orders.unshift({id:"S-"+Date.now().toString().slice(-6),userId:u.id,customer:f.get("name"),email:u.email,phone:f.get("phone"),address:f.get("address"),payment:f.get("payment"),items:items,total:total,status:"Pending",date:new Date().toLocaleString()});localStorage.setItem("shishti_orders",JSON.stringify(orders));saveProducts(products.map(function(p){var i=cart.find(function(x){return x.id===p.id});return i?Object.assign({},p,{stock:Math.max(0,p.stock-i.qty)}):p}));cart=[];saveCart();updateCartCount();e.target.reset();closeModal("checkoutModal");closeCart();toast("Order placed successfully")}
function openAccount(mode){if(mode)setAuthMode(mode);refreshAccountView();openModal("accountModal")}
function refreshAccountView(){var u=currentUser();$("#authView").classList.toggle("hidden",!!u);$("#profileView").classList.toggle("hidden",!u);if(u){$("#profileName").textContent=u.name;$("#profileEmail").textContent=u.email;renderAccountOrders()}}
function updateAccountButton(){var u=currentUser();$("#accountBtn").textContent=u?u.name.split(" ")[0]:"Account"}
function setAuthMode(mode){authMode=mode;$("#loginTab").classList.toggle("active",mode==="login");$("#registerTab").classList.toggle("active",mode==="register");$("#nameField").classList.toggle("hidden",mode!=="register");$("#nameField input").required=mode==="register";$("#authTitle").textContent=mode==="register"?"Create your account":"Welcome back";$("#authSubtitle").textContent=mode==="register"?"Create a local demo account to save your shopping details.":"Sign in to save your details and view your orders.";$("#authSubmit").textContent=mode==="register"?"Create account":"Sign in";$("#authForm").reset()}
function handleAuth(e){e.preventDefault();var f=new FormData(e.target),email=String(f.get("email")).trim().toLowerCase(),password=String(f.get("password"));var users=getUsers();if(authMode==="register"){if(users.some(function(u){return u.email===email}))return toast("An account with this email already exists");var u={id:"U-"+Date.now(),name:String(f.get("name")).trim(),email:email,password:password};users.push(u);saveUsers(users);localStorage.setItem("shishti_current_user",u.id);refreshAccountView();updateAccountButton();toast("Account created")}else{var u2=users.find(function(x){return x.email===email&&x.password===password});if(!u2)return toast("Email or password is incorrect");localStorage.setItem("shishti_current_user",u2.id);refreshAccountView();updateAccountButton();toast("Signed in")}}
function logout(){localStorage.removeItem("shishti_current_user");refreshAccountView();updateAccountButton();toast("Signed out")}
function renderAccountOrders(){var u=currentUser();if(!u)return;var orders=getOrders().filter(function(o){return o.userId===u.id});$("#accountOrders").innerHTML=orders.length?orders.map(function(o){return '<div class="mini-order"><b>'+o.id+" · "+money(o.total)+'</b><span>'+o.status+" · "+o.date+"</span></div>"}).join(""):'<div class="mini-order">No orders yet.</div>'}

function initAdmin(){
 renderInventory();renderOrders();updateStats();
 $("#addManual").onclick=function(){openProductModal()};
 $("#openScanner").onclick=function(){openModal("scannerModal");startScanner()};
 $("#lookupBarcode").onclick=function(){lookupBarcode($("#barcodeInput").value.trim())};
 $("#adminLogout").onclick=function(){toast("Admin demo session closed")};
 $("#productForm").onsubmit=saveProduct;
 document.querySelectorAll("[data-close]").forEach(function(b){b.onclick=function(){closeModal(b.dataset.close)}});
 window.addEventListener("storage",syncAdmin);
}
function syncAdmin(e){if(["shishti_products","shishti_orders"].indexOf(e.key)>=0){renderInventory();renderOrders();updateStats()}}
function renderInventory(){var p=getProducts();$("#inventory").innerHTML=p.map(function(x){return '<tr><td><div class="table-product"><img src="'+(x.image||placeholder())+'"><div><strong>'+escapeHtml(x.name)+'</strong><small>'+escapeHtml(x.id)+'</small></div></div></td><td>'+escapeHtml(x.category||"General")+'</td><td>'+money(x.price)+'</td><td>'+x.stock+'</td><td><span class="status '+(x.stock<5?"low":"")+'">'+(x.stock<5?"Low stock":"In stock")+'</span></td><td><button class="action-btn" onclick="editProduct(\\''+x.id+'\\')">Edit</button></td></tr>'}).join("")}
function renderOrders(){var o=getOrders();$("#orders").innerHTML=o.length?o.slice(0,10).map(function(x){return '<div class="order"><div><strong>'+x.id+" · "+escapeHtml(x.customer)+'</strong><p>'+x.items.map(function(i){return i.qty+"× "+escapeHtml(i.name)}).join(", ")+'</p><p>'+escapeHtml(x.address)+" · "+escapeHtml(x.phone)+'</p></div><div style="text-align:right"><b>'+money(x.total)+'</b><p>'+escapeHtml(x.status)+"</p></div></div>"}).join(""):'<div class="empty">No orders yet. Orders placed from the store appear here automatically.</div>'}
function updateStats(){var p=getProducts(),o=getOrders();$("#statProducts").textContent=p.length;$("#statOrders").textContent=o.length;$("#statPending").textContent=o.filter(function(x){return x.status==="Pending"}).length;$("#statSales").textContent=money(o.reduce(function(a,x){return a+x.total},0))}
function openProductModal(product){var exists=product&&getProducts().some(function(x){return x.id===product.id});$("#productModalTitle").textContent=exists?"Edit product":"Add product";var f=$("#productForm");f.reset();f.elements.id.value=product&&product.id||"";f.elements.name.value=product&&product.name||"";f.elements.category.value=product&&product.category||"";f.elements.price.value=product&&product.price||"";f.elements.stock.value=product&&product.stock||"";f.elements.image.value=product&&product.image||"";$("#previewName").textContent=product&&product.name||"New product";$("#previewImage").src=product&&product.image||placeholder();$("#previewSource").textContent=product&&product.source||"Manual product";openModal("productModal")}
function editProduct(id){openProductModal(getProducts().find(function(p){return p.id===id}))}
function saveProduct(e){e.preventDefault();var f=new FormData(e.target),p=getProducts(),id=f.get("id")||"P-"+Date.now();var item={id:id,name:String(f.get("name")).trim(),category:f.get("category")||"General",price:Number(f.get("price")),stock:Number(f.get("stock")),image:f.get("image")||placeholder()};var idx=p.findIndex(function(x){return x.id===id});if(idx>=0)p[idx]=item;else p.unshift(item);saveProducts(p);closeModal("productModal");renderInventory();updateStats();toast("Product saved and published to the store")}
async function lookupBarcode(code){if(!code)return toast("Enter a barcode first");$("#lookupStatus").textContent="Searching public product data...";try{var r=await fetch("https://world.openfoodfacts.org/api/v2/product/"+encodeURIComponent(code)+".json");var d=await r.json();if(!d.product||d.status===0){$("#lookupStatus").textContent="No public record found. You can still enter the product manually.";stopScanner();closeModal("scannerModal");return openProductModal({id:code,name:"",category:"General",price:"",stock:0,image:"",source:"Barcode scanned · manual details"})}var x=d.product;$("#lookupStatus").textContent="Product found. Add your SHISHTI price and stock.";stopScanner();closeModal("scannerModal");openProductModal({id:code,name:x.product_name||x.product_name_en||"Scanned product",category:x.categories_tags&&x.categories_tags[0]?x.categories_tags[0].replace("en:",""):"General",price:"",stock:0,image:x.image_front_url||x.image_url||"",source:"Barcode scanned · public product data"})}catch(e){$("#lookupStatus").textContent="Lookup failed. You can add the product manually.";stopScanner();closeModal("scannerModal");openProductModal({id:code,name:"Scanned product",category:"General",price:"",stock:0,image:"",source:"Barcode scanned · manual details"})}}
async function startScanner(){try{if(!("BarcodeDetector" in window)){$("#lookupStatus").textContent="Live scanning is not supported in this browser. Use the field below.";return}var detector=new BarcodeDetector({formats:["qr_code","ean_13","ean_8","upc_a","upc_e","code_128","code_39","itf"]});scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});var v=$("#scannerVideo");v.srcObject=scannerStream;await v.play();scannerTimer=setInterval(async function(){try{var codes=await detector.detect(v);if(codes.length&&codes[0].rawValue){$("#barcodeInput").value=codes[0].rawValue;lookupBarcode(codes[0].rawValue)}}catch(e){}},500)}catch(e){$("#lookupStatus").textContent="Camera access is unavailable. Enter the barcode manually."}}
function stopScanner(){if(scannerTimer)clearInterval(scannerTimer);scannerTimer=null;if(scannerStream)scannerStream.getTracks().forEach(function(t){t.stop()});scannerStream=null}
function openModal(id){$("#"+id).classList.add("show")}
function closeModal(id){$("#"+id).classList.remove("show");if(id==="scannerModal")stopScanner()}
