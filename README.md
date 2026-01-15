# 🐾 Pet Profile Drawer

A responsive, accessible Pet Management UI built with **React + TypeScript + React Query**.  
It allows staff to view and manage pet profiles, including details, photos, vaccinations, grooming history, and bookings.

This project demonstrates:

- Component-driven architecture  
- Optimistic UI updates with rollback  
- Accessible tab navigation  
- Inline editing with validation  
- Search with highlighting  
- Mock API integration using `json-server`  
- Unit and E2E testing  

---

## 🚀 Setup

Install dependencies:

```bash
npm install
npm run dev
npx json-server --watch db.json --port 4000
http://localhost:5173
http://localhost:4000
```

🧱 Architecture

- LeftPanel
    - Lists clients and pets
    - Search with debounce
    - Highlights matched substrings
    - Filters inactive pets
    - Keyboard accessible
- PetDrawer
    - Shows selected pet
    - Contains Actions (Edit, Deactivate)
    - Displays risk banner for Escaper

- PetTabs
   - Tab controller (ARIA compliant)
   - Renders individual tab components

- Tabs (Separated Components)
    - PetDetails
    - PhotosTab
    - VaccinationsTab
    - GroomingTab
    - BookingsTab

Each tab is isolated for:
- Maintainability
- Testability
- Clear separation of concerns