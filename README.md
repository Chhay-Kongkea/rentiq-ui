# Rentiq — Frontend

This is the frontend client for **Rentiq**, a peer-to-peer rental marketplace connecting **Users, Vendors, and Admins**.

**Branch for this submission:** `Y2S2-PP-MIDTERM`

---

# 1. Overview

The Rentiq frontend delivers the interface for three main roles:

| Role | Description |
|---|---|
| User | Search and browse rentals, post item requests, manage bookings, favorites, reviews, ratings, notifications, and profile information |
| Vendor | Manage listings, respond to requests with offers, handle bookings, QR verification, and wallet management |
| Admin | Moderate users/vendors/listings, resolve disputes, manage payments, and generate reports |

---

# 2. Tech Stack

The Rentiq frontend is built using **Next.js and TypeScript**, providing a modern, type-safe, and scalable web application architecture.

| Category | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| State Management | React Context API |
| Styling | Tailwind CSS |
| HTTP Client | Axios / Fetch API |
| Routing | Next.js App Router |

## Core Technologies

| Technology | Purpose |
|---|---|
| Next.js | React-based framework for building the Rentiq web application |
| TypeScript | Provides static typing and improves code reliability |
| Next.js App Router | Handles application routing and page navigation |
| React Context API | Manages global and shared application state |
| Tailwind CSS | Provides responsive and consistent UI styling |
| Axios / Fetch API | Handles communication with the Rentiq REST API |

---

# 3. Screens / Pages by Module

**Status Definition**

| Status | Meaning |
|---|---|
| Done | Feature/page completed |
| In Progress | Currently being developed |
| Not Started | Planned but not implemented yet |

| Module | Screens / Features | Status |
|---|---|---|
| Authentication | Register, Login, Forgot/Reset Password, Email Verification | In Progress |
| User Profile | View/Edit Profile, Avatar Upload, Addresses, Notification Preferences | Done |
| KYC / Verification | KYC Submission Form, KYC Status | Not Started |
| Search & Discovery | Search Results, Filters (Price/Location/Rating), Sort | In Progress |
| Nearby Rentals | Map View, Nearby List, Distance Filter | Not Started |
| Item Requests (User) | Create Request, My Requests, View Offers, Accept/Reject Offer | Not Started |
| Offers (Vendor) | Nearby Requests, Send Offer, Track Sent Offers | Not Started |
| Listings (Vendor) | Item List, Create/Edit Item, Image Upload, Availability Toggle | In Progress |
| Item Details (Public) | Item Detail Page, Reviews, Availability Calendar | In Progress |
| Bookings | Create Booking, Booking Detail, Status Timeline, QR Code Display/Scan | Not Started |
| Booking History | Past Bookings List, Receipt/Invoice Download | Not Started |
| Inspections | Check-in/Check-out Photo Capture, Notes | Not Started |
| Disputes | Open Dispute, Dispute Detail/Thread | Not Started |
| Favorites | Saved Items List, Save/Remove Toggle | Done |
| Reviews & Ratings | Write Review, Edit Review, Vendor Reply | In Progress |
| Notifications | Notification Center, Unread Badge | Done |
| Reports & Moderation | Report a User/Item/Review | Not Started |
| Vendor Wallet | Balance View, Transaction History, Top-Up, Bank Accounts | Not Started |
| Vendor Performance | Acceptance/Cancellation Rate Dashboard | Not Started |
| Admin Dashboard | User/Vendor Management, Listing Approval, Category Management | Not Started |
| Admin Finance | Payments, Payouts, Commission, Revenue Reports | Not Started |
| Advertisements & Promotions | Ad Purchase, Promotion/Boost | Not Started |
| Multi-language | Language Switcher (KM/EN) | Not Started |

---

# 4. Completion Status — Midterm Submission

| Area | Completion | Notes |
|---|---:|---|
| Frontend (Pages & Components Built) | 50% | Main pages and reusable components have been implemented |
| UX (Flows & Wireframes Finalized) | 80% | Main user flows and wireframes have been completed |
| UI (High-Fidelity Styling Applied) | 90% | High-fidelity UI styling has been applied to completed screens |
| API Integration (Connected to Backend) | 50% | Some screens are connected to backend endpoints, remaining screens use mock/static data |

---

# 5. Folder Structure

| Folder | Description |
|---|---|
| `app/` | Next.js App Router pages, layouts, and routes |
| `components/` | Reusable UI components |
| `features/` | Feature-based modules and business logic |
| `services/` | API calls and backend communication |
| `store/` | State management |
| `routes/` | Application route configuration |
| `hooks/` | Custom React hooks |
| `utils/` | Helper functions and utilities |
| `assets/` | Images, icons, and static resources |

Project Structure:

```text
src/
│
├── app/
├── components/
├── features/
├── services/
├── store/
├── routes/
├── hooks/
├── utils/
└── assets/
```

---

# 6. Getting Started

## Clone Repository

```bash
git clone <repo-url>
```

## Navigate to Project

```bash
cd rentiq-frontend
```

## Checkout Submission Branch

```bash
git checkout Y2S2-PP-MIDTERM
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

## Environment Variables (.env)

```env
API_BASE_URL=http://localhost:PORT/api/v1
```

---

# 7. Backend API

This frontend consumes the **Rentiq REST API** at base path:

```text
/api/v1
```

| Item | Details |
|---|---|
| API Type | REST API |
| Base Path | `/api/v1` |
| HTTP Client | Axios / Fetch API |
| Documentation | Backend README.md / API Reference Documentation |

---

# 8. Team / Contributors

| Name | Role |
|---|---|
| Sam Sreynich | Frontend Developer |
| Chanthat | Frontend Developer |
| Leanghom | Frontend Developer |
| Pathminea | Frontend Developer |
| Sitha | Frontend Developer |

---

# 9. Submission Information

| Item | Details |
|---|---|
| Project | Rentiq Frontend |
| Submission Type | Midterm Submission |
| Branch | `Y2S2-PP-MIDTERM` |
| Framework | Next.js |
| Language | TypeScript |