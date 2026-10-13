# DukaanMitra Database Schema

This document provides a human-readable overview of the Firestore database schema, derived from `docs/backend.json`.

## Root Collections

### `/users/{userId}`

Stores public user profile information. The document ID matches the Firebase Auth UID.

-   **Entity**: `UserProfile`
-   **Key Properties**:
    -   `uid`: string (User's unique ID)
    -   `email`: string
    -   `role`: enum (`user`, `admin`, `super_admin`)
    -   `status`: enum (`active`, `pending`, `suspended`)
    -   `shopId`: string (ID of the shop this user owns/belongs to)

### `/shops/{shopId}`

Stores information about an individual Kirana store.

-   **Entity**: `Shop`
-   **Key Properties**:
    -   `id`: string (Unique ID for the shop)
    -   `owner_id`: string (UID of the user who owns the shop)
    -   `name`: string
    -   `phone`: string
    -   `whatsapp`: string (The connected business WhatsApp number)
    -   `plan`: enum (`free`, `basic`, `pro`)
    -   `status`: enum (`active`, `trial`, `suspended`)

### `/posts/{postId}`

Stores blog post content.

-   **Entity**: `Post`
-   **Key Properties**:
    -   `slug`: string (URL-friendly identifier)
    -   `title`: string
    -   `content`: string
    -   `category`: string

### `/comments/{commentId}`

Stores comments for blog posts.

-   **Entity**: `Comment`
-   **Key Properties**:
    -   `postSlug`: string (Used to query comments for a specific post)
    -   `name`: string
    -   `message`: string

### `/contactFormSubmissions/{submissionId}`

Stores submissions from the website's contact form for record-keeping.

-   **Entity**: `ContactFormSubmission`
-   **Key Properties**:
    -   `name`: string
    -   `email`: string
    -   `message`: string
    -   `submittedAt`: timestamp

## Sub-collections

### `/shops/{shopId}/customers/{customerPhone}`

Stores customers for a specific shop. The document ID is the customer's 10-digit phone number.

-   **Entity**: `Customer`
-   **Key Properties**:
    -   `shop_id`: string (Parent shop ID)
    -   `phone`: string (Customer's phone number)
    -   `name`: string
    -   `totalUdhaar`: number (Total outstanding credit)
    -   `last_visit`: timestamp

### `/shops/{shopId}/ledger/{ledgerId}`

Stores individual credit/payment transactions for a shop.

-   **Entity**: `LedgerEntry`
-   **Key Properties**:
    -   `id`: string (Unique ID for the ledger entry)
    -   `shop_id`: string (Parent shop ID)
    -   `customerPhone`: string (The customer this entry belongs to)
    -   `amount`: number
    -   `type`: enum (`credit`, `payment`)
    -   `source`: enum (`whatsapp`, `app`, `manual`, `app-ai`)
    -   `createdAt`: timestamp
