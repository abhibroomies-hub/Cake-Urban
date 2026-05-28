# Security Specification for CakeUrban

## 1. Data Invariants
- An Order must have a valid total (>= 0).
- An Order must have items.
- Only Admins can modify product prices or stock.
- Users can only access their own orders and profile.
- A user cannot set themselves as an admin during registration.

## 2. The Dirty Dozen Payloads
1. **Admin Promotion**: User tries to update their profile with `role: 'admin'`.
2. **Price Manipulation**: User tries to create an order with a price lower than the product's actual price.
3. **Ghost Order**: User tries to create an order with items that don't exist in the products collection. (Using relational sync)
4. **Order Hijacking**: User tries to read an order belonging to another `userId`.
5. **PII Leak**: Authenticated user tries to list the `users` collection to scrape emails.
6. **Product Defacement**: Non-admin tries to update product descriptions.
7. **Negative Total**: System receives an order with `total: -500`.
8. **Shadow Field Injection**: User adds `isVerified: true` to an order to bypass checks.
9. **Identity Spoofing**: User A tries to create an order setting `userId: UserB_ID`.
10. **Immutable Violation**: User tries to change the `createdAt` timestamp of an existing order.
11. **Status Injection**: User tries to update an order status straight to `delivered`.
12. **Recursive Cost Attack**: Making deeply nested queries or huge ID poisoning.

## 3. Test Runner (Draft Logic)
Firestore rules will be tested using standard permissions checks in the rules themselves.
