# SHISHTI Demo

Professional two-page e-commerce prototype for SHISHTI.

## Pages
- index.html - customer storefront
- admin.html - separate store administration dashboard

Both pages are intentionally separated but share the same browser localStorage.

## Shared localStorage
- shishti_products - inventory shared between Admin and Store
- shishti_orders - customer orders shared between pages
- shishti_users - demo customer accounts
- shishti_current_user - signed-in customer
- shishti_cart - current cart

## Demo flow
1. Create a customer account on the Store page.
2. Add products and place an order.
3. Open admin.html separately. The order appears there.
4. Add or scan a product in Admin, set price and stock, and save it.
5. The product appears on the Store page automatically because both pages use the same localStorage data.

## Important
This is a browser-only demo. Passwords, inventory and orders are not secure and are not suitable for production. A real launch should move authentication, inventory, orders and payments to a secure backend/database.

Product scanning supports QR/barcode formats where the browser provides BarcodeDetector and uses Open Food Facts for public product information, with manual fallback.
