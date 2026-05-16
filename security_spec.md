# Security Specification for Feria Tehuipango 2026

## 1. Data Invariants
- Events must have a title, date, location, and category.
- Only authorized admins can create or modify any data.
- Public can read all collections.
- Timestamps for creation/update must be server-synced.

## 2. The "Dirty Dozen" Payloads
1. **Unauthorized Create**: An unauthenticated user tries to add an event.
2. **Anonymous Admin**: A user with no email verification tries to delete an event.
3. **Ghost Fields**: Adding a field like `isAdmin: true` to an event document.
4. **Invalid Date**: Setting an event date in the year 1900.
5. **ID Poisoning**: Using a 2KB string as a document ID.
6. **Self-Promotion**: A user tries to mark themselves as an admin in a hypothetical `users` collection.
7. **Malformed Category**: Creating a category without a name.
8. **Owner Spoofing**: Setting `authorId` to a different user's UID.
9. **Update Gap**: Modifying a field that should be immutable (e.g. `createdAt`).
10. **Resource Exhaustion**: Sending a 1MB string in the `description` field.
11. **PII Leak**: Publicly reading user email if we had a users collection (we'll split PII if we add it).
12. **State Jumper**: Changing `isFeatured` without admin permissions.

## 3. Test Runner (Draft)
A simple test logic to ensure `PERMISSION_DENIED` for the above.
