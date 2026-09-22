# SHISHTI Demo

First visual/functional prototype for the SHISHTI online store.

## Demo pages
- `index.html`: customer-facing store
- `admin.html`: store management dashboard

## Barcode flow
1. Admin opens **Add product by barcode**.
2. The browser attempts to scan a product barcode using the camera.
3. The barcode is sent to the public Open Food Facts API for product information.
4. The returned name/category/image are shown in the product form.
5. The store owner enters their own **price** and **stock quantity**.
6. Saving the product adds it to the demo inventory.

A manual barcode field is included as a fallback.

## Important prototype note
This is a front-end demo. Data is stored in the browser's localStorage and the public product lookup is not a production backend.

For the real SHISHTI system, the next version should use a secure backend/database, authenticated admin accounts, real order storage, image storage, stock locking, and a proper payment gateway if online payments are required.

The barcode lookup will not know every product sold by every shop. For products missing from the public database, the admin can add the product manually.
