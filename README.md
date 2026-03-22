# GatherUp Premium Admin Panel 🚀

A modern, highly responsive, and premium web administration dashboard built specifically for managing the **GatherUp** platform. It provides real-time community moderation, institutional domain governance, and system-wide health monitoring.

![GatherUp Admin Panel](https://via.placeholder.com/1200x600.png?text=GatherUp+Admin+Dashboard)

## 📌 Features

- **Premium Dark/Light Theme:** Fully integrated Tailwind CSS semantic dark mode (`#1A1A24` base) with glowing purple and indigo accents.
- **Main Overview Dashboard:** Real-time data visualization using Recharts (Pie & Bar charts) for monitoring signups, active events, and user growth.
- **Advanced Moderation Panel:** A borderless, card-based interface allowing administrators to audit reported content and ban/suspend users natively via Supabase RPC integration.
- **Governance Control:** Split-view dynamic panels to manage allowed institutional registration domains (e.g., `mit.edu`) and audit all registered users within that domain.
- **System Health Monitor:** Real-time tracking of Supabase database capacity blocks with reactive color-coded gradient progress bars.

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/BaaS:** Supabase (Database, Auth, RPC)
- **Icons:** Lucide React
- **Charts:** Recharts

---

## 🚀 Getting Started

Follow these instructions to run the GatherUp Admin Panel locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- npm or yarn package manager
- A Supabase Project (Database & API)

### 1. Clone the Repository

```bash
git clone https://github.com/LordOfTheStringss/GatherUp_Web.git
cd GatherUp_Web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

The project requires Supabase credentials to function securely. Create a new file named `.env` in the root directory (where `package.json` is located) and add your keys:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: The `.env` file is completely excluded from Git tracking for security reasons).*

### 4. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will typically start and be accessible at:
👉 **[http://localhost:5173](http://localhost:5173)**

## 📦 Building for Production

When you are ready to deploy (e.g., to Vercel, Netlify, or an NGINX server), generate the optimized build block:

```bash
npm run build
```

The output will be compiled down into the `/dist` directory. You can preview it locally using:

```bash
npm run preview
```

---
*Built securely for the GatherUp Ecosystem under the comprehensive architecture rules.*
