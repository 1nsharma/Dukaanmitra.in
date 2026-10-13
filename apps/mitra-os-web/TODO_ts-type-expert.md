# TypeScript Type Expert Tasks

## Context
- **Files affected**: `types.ts`, `services/geminiService.ts`, `services/storeService.ts`, `components/WhatsAppSimulation.tsx`.
- **Current State**: The project uses TypeScript but has some loose types, out-of-sync interfaces (e.g., `Transaction` in `types.ts` vs what is actually saved in Firestore), and uses `any` in service functions.
- **Goal**: Introduce discriminated unions, remove `any`, and align types with the actual data model to make illegal states unrepresentable.

## Type Plan

- [ ] **TS-PLAN-1.1 [Domain Model Types]**:
  - **Scope**: `types.ts` and Firestore data models.
  - **Approach**: Define accurate interfaces for `StoreTransaction` and `StoreCustomer` that match the data written by `storeService.ts`.
  - **Impact**: Ensures consistency between the frontend and the database schema.

- [ ] **TS-PLAN-1.2 [Service Layer Types]**:
  - **Scope**: `services/geminiService.ts` and `services/storeService.ts`.
  - **Approach**: Convert `ParsedTransaction` into a discriminated union to enforce required fields based on the transaction type. Remove `any[]` from `history`.
  - **Impact**: Prevents runtime errors where `customerName` might be missing for `udhaar` or `payment` transactions.

- [ ] **TS-PLAN-1.3 [Component State Types]**:
  - **Scope**: `components/WhatsAppSimulation.tsx`.
  - **Approach**: Use a discriminated union for the `Message` state to separate user messages (which have delivery status) from bot messages (which have parsed data).
  - **Impact**: Makes illegal message states unrepresentable.

## Type Items

### Basic Type Definitions & Advanced Generics

- [ ] **TS-ITEM-1.1 [Accurate Firestore Types]**:
  - **Definition**: Create `StoreTransaction` and `StoreCustomer` in `types.ts`.
  - **Rationale**: The existing `Transaction` type does not match the fields saved in `storeService.ts` (e.g., `transId`, `items`, `phone` are not used, while `customerId`, `type`, `description` are).
  - **Proposed Code Changes**:
    ```typescript
    // In types.ts
    import { FieldValue, Timestamp } from 'firebase/firestore';

    export interface StoreCustomer {
      id?: string;
      storeId: string;
      name: string;
      balance: number;
      lastTransactionAt: Timestamp | FieldValue;
    }

    export interface StoreTransaction {
      id?: string;
      storeId: string;
      customerId: string;
      type: 'sale' | 'udhaar' | 'payment';
      amount: number;
      description: string;
      timestamp: Timestamp | FieldValue;
    }
    ```

### Type Safety Patterns

- [ ] **TS-ITEM-1.2 [Discriminated Union for ParsedTransaction]**:
  - **Definition**: Update `ParsedTransaction` in `geminiService.ts`.
  - **Rationale**: A "sale" transaction doesn't strictly need a customer name, but "udhaar" and "payment" do. A discriminated union enforces this at compile time.
  - **Proposed Code Changes**:
    ```typescript
    // In services/geminiService.ts
    export type ParsedTransaction =
      | { type: "sale"; amount: number; customerName?: string; description?: string }
      | { type: "udhaar"; amount: number; customerName: string; description?: string }
      | { type: "payment"; amount: number; customerName: string; description?: string };
    ```

- [ ] **TS-ITEM-1.3 [Remove `any` from Chat History]**:
  - **Definition**: Define a type for the `history` parameter in `generateAssistantResponse`.
  - **Rationale**: Using `any[]` defeats type checking and hides potential bugs.
  - **Proposed Code Changes**:
    ```typescript
    // In services/geminiService.ts
    export interface ChatHistoryMessage {
      role: 'user' | 'model';
      parts: { text: string }[];
    }

    export async function generateAssistantResponse(query: string, role: string, history: ChatHistoryMessage[]) {
      // ...
    }
    ```

- [ ] **TS-ITEM-1.4 [Discriminated Union for WhatsApp Messages]**:
  - **Definition**: Update the `Message` interface in `WhatsAppSimulation.tsx`.
  - **Rationale**: User messages have a `status` (sent/delivered/read), while bot messages have `parsed` data. Combining them into a single interface with optional fields allows invalid states (e.g., a user message with parsed data).
  - **Proposed Code Changes**:
    ```typescript
    // In components/WhatsAppSimulation.tsx
    type Message =
      | {
          id: string;
          text: string;
          sender: 'user';
          timestamp: Date;
          status: 'sent' | 'delivered' | 'read';
        }
      | {
          id: string;
          text: string;
          sender: 'bot';
          timestamp: Date;
          status?: 'read';
          parsed?: ParsedTransaction;
        };
    ```

## Quality Assurance Task Checklist
- [ ] All `any` usage is eliminated or explicitly justified with a comment.
- [ ] Generic constraints are tested with both valid and invalid type arguments.
- [ ] Discriminated unions have exhaustive handling verified with never checks.
- [ ] Existing valid usage patterns compile without changes after type additions.
- [ ] Invalid usage patterns produce clear, actionable compile-time errors.
- [ ] IDE autocomplete and hover information are accurate and helpful.
- [ ] Compilation time is acceptable with the new type definitions.
