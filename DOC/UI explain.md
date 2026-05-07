# Operations Portal UI System Report

This document provides a detailed breakdown of the Operations Portal's user interface, architecture, and functional logic.

## 1. Core Architecture
- **Framework**: React 18+ with TypeScript for type-safe development.
- **Styling**: Tailwind CSS (Utility-first approach) ensuring a highly responsive and performant UI.
- **Animations**: Framer Motion (`motion/react`) for smooth route transitions, modal appearances, and interactive feedback.
- **Routing**: `react-router-dom` v6 for SPA (Single Page Application) navigation.
- **Persistence**: `localStorage` is used to maintain "Persistent Sessions", preventing logouts on page refresh.

---

## 2. Authentication & Access Control
### **Login Page (`/src/pages/Login.tsx`)**
- **Purpose**: Secure entry point for the "Operations Portal".
- **Visuals**: Modern, high-contrast dark theme for the button, clean white form card with backdrop blur.
- **Logic**:
  - Validates user credentials (mock).
  - "Persistent Session" checkbox: If checked, it uses `localStorage` to keep the user logged in.
  - Federated Entry placeholders for future Single Sign-On (SSO) integrations.

---

## 3. Global Framework
### **AppShell (`/src/components/AppShell.tsx`)**
The `AppShell` is a persistent wrapper that hosts the global navigational elements.
- **Sidebar**:
  - **Brand Selection**: Dropdown at the top to toggle between corporate brands (The American Patch, Eagle UK, etc.).
  - **Navigation**: Links to all 15+ operational modules with active-state highlighting.
  - **Collapsible State**: The sidebar can be collapsed to maximize screen real estate for data-heavy tables.
- **Top Navbar**: 
  - Displays the current module name.
  - Currency selector (USD, GBP, etc.) for localized financial views.
  - Profile summary for "Ikhlaque A. (CEO)".
- **Logout**: Clears `localStorage` and triggers a clean redirect to the login screen.

---

## 4. Module & Page Breakdowns

### **Dashboard (`Dashboard.tsx`)**
- **KPI Summary**: Real-time stats for Gross Volume, Lead Conv., and Active Design Batches.
- **Charts**: Interactive line graphs for revenue trends and pie charts for volume distribution across brands (American Patch, Eagle UK).
- **Live Activity**: A "Stream" view showing recent SDR successes and system alerts.

### **Leads Management (`Leads.tsx`)**
- **CRM Interface**: A high-density table for managing incoming leads.
- **Assignment Logic**: Shows assigned SDRs (**Hammad, Faiq, Sufyan, or Wahid**).
- **SLA Tracking**: Visual "Time to Respond" indicators (Critical, Warning, Normal).
- **Source Filtering**: Tracks leads from Web Forms, Instagram, RingCentral, etc.

### **Shared Inbox (`SharedInbox.tsx`)**
- **Unified Feed**: Combines Email, Facebook, and Instagram messages into one view.
- **Thread View**: Allows SDRs to chat with clients, see metadata (Net Rev, Lifetime value), and view file attachments directly.

### **Invoice Wizard (`InvoiceWizard.tsx`)**
- **Multi-step Flow**: A guided wizard for creating financial documents.
- **Line Items**: Dynamic addition of patches, pricing, and tax calculation.
- **Status Integration**: Hooks into the billing cycle to update Order statuses automatically.

### **Production Board (`ProductionBoard.tsx`)**
- **Batch Management**: Tracks the physical manufacturing of patch batches.
- **Workflow**: Moves items through "In Queue", "Embroidering", "Finishing", and "Ready".

### **Design Board (`DesignBoard.tsx`)**
- **Artwork Approval**: A specialized view for checking mockups against client requirements.
- **Chat/Revisions**: Contextual chat sidebar for Designers and SDRs to discuss thread colors or sizing tweaks.
- **Version Control**: Tracking v1, v2, v3 of files.

### **QA & Inspection (`QA.tsx`)**
- **Validation Checkpoints**: A checklist-based interface where inspectors verify stitch density, backing type, and color accuracy before shipping.

### **Call Assistant (`CallAssistant.tsx`)**
- **AI Outreach**: A tool designed to assist SDRs during discovery calls.
- **Script Engine**: Shows a dynamic script (e.g., "Hi, I'm [Hammad] from The American Patch...").
- **Notes & Logs**: Quick buttons to log call results (No answer, Busy, Call Back).

### **Reports & Analytics (`Reports.tsx`)**
- **Performance Layer**: Aggregated data across all months.
- **Leaderboard**: Tracks revenue and closing rates for Hammad, Faiq, Sufyan, and Wahid.
- **Brand Yield**: Shows which brands are most profitable.

### **Logistics & Inventory (`Orders.tsx`, `ShippingDashboard.tsx`, `Vendors.tsx`)**
- **Orders**: Tracks the full lifecycle of a customer transaction from tap to package.
- **Shipping**: Integrates with dhl and other carriers for real-time tracking numbers and delivery statuses.
- **Vendors**: Manages the upstream supply chain for fabric, thread, and specialized machinery.

---

## 5. Global Utilities
### **Command Palette (`App.tsx`)**
- **Trigger**: `CMD/CTRL + K`
- **Function**: A "Spotlight" style modal that allows jumping to any page or searching for specific order numbers/leads without using the sidebar.

### **Activity Log (`ActivityLog.tsx`)**
- **Audit Trail**: A central pane showing every major action across the system (e.g., "Hammad approved Artwork v4", "Ikhlaque A. released Batch PJ-991").

---

## 6. Mock Data Implementation
The system is populated with realistic datasets tailored to the business:
- **Client Records**: 500+ records of companies like Acme Corp, Stark Ind.
- **Employee Names**: Fully customized to include **Hammad, Faiq, Sufyan, and Wahid**.
- **Financials**: Dynamic calculations of revenue and totals across different global currencies.
