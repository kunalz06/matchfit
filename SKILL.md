# Matchfit Application Enhancement Specification (SKILL.md)

This document outlines the required UI/UX and functional updates for the Matchfit Tailoring & Order Management system based on the finalized wireframes.

## 1. Global UI & Experience
- **Unified Branding**: Every functional page (Dashboards, Login, Tracking) must include the "Matchfit Tailoring LLC" header at the top of the card/container.
- **Status Color Palette**:
  - `Delivered`: Emerald Green (`#276749` text on `#f0fff4` bg)
  - `Completed`: Goldenrod/Yellow (`#856404` text on `#fff3cd` bg)
  - `In Progress`: Rust/Red-Orange (`#c53030` text on `#fff5f5` bg)
- **Responsive Navigation**: All dashboards should have a clear "🏠 Home" or "🔙 Back" button to prevent dead-ends.

## 2. Multilingual Support
- **Onboarding/Login**: Implement language switching for the Tailor Login page.
- **Target Languages**: 
  - English (Default)
  - Malayalam (തയ്യൽക്കാരൻ ലോഗിൻ)
  - Hindi (दर्जी लॉगिन)

## 3. Customer Portal (Track Order)
- **Three-Step Flow**:
  1. **Landing**: Simple welcome screen with a "Track Here" call-to-action.
  2. **Search**: Dedicated input field for `Order No`.
  3. **Results**: High-visibility status badge with the specific color coding mentioned above.

## 4. Admin Dashboard Enhancements
- **View Toggling**: Separate the "Order List" (CRUD) from the "Status Overview" (Analytics/Summary Table).
- **Confirmation Modals**: Implement a "Confirm Deletion" overlay/modal that shows the Order ID and Tailor name before finalizing a delete action.
- **Improved Forms**: Restyled "Add Order" and "Edit Order" cards focused on `Order No`, `Type`, `Tailor`, `Due Date`, and `Status`.

## 5. Tailor Dashboard Refinement
- **Worklist View**: Keep a clean table of "My Orders".
- **Status Update Page**: Instead of just inline editing, provide a focused "Status Update" view for individual orders to reduce accidental changes.

## 6. Backend Requirements
- **Validation**: Ensure `orderNo` uniqueness is enforced.
- **Schema**: Maintain support for `type` and `dueDate` even if simplified in the UI.
