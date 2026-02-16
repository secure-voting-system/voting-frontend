# Secure Voting System - Frontend

A modern, secure, and decentralized voting platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Decentralized Voting:** Secure and transparent voting mechanism.
- **Role-Based Access:** Distinct features for Administrators and Voters.
- **Real-time Analytics:** Interactive dashboards visualizing voting participation and node status.
- **Cyber Aesthetic UI:** High-contrast "Deep Black" and "Neon Cyan/Violet" theme for a premium, security-focused look.
- **Responsive Design:** Fully optimized for all device sizes.

## 🛠️ Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Custom CSS with CSS Variables (Theming), [Lucide React](https://lucide.dev/) for icons.
- **Charting:** [Chart.js](https://www.chartjs.org/) via `react-chartjs-2`.
- **Routing:** [React Router](https://reactrouter.com/)

## 📂 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/           # Authentication (Login, Register)
│   ├── admin/          # Admin Dashboard & Management
│   ├── voter/          # Voter Dashboard & Voting Interface
│   ├── voting/         # Core Voting Logic & Components
│   └── public/         # Landing Page & Public Routes
├── shared/             # Shared utilities and components
│   ├── components/     # Reusable UI components (Buttons, Inputs, etc.)
│   ├── context/        # React Context (Auth, Theme)
│   └── services/       # API services
└── index.css           # Global styles & Theme variables
```

## 🎨 Theme & Customization

The application uses a **Cyber Aesthetic** theme defined in `src/index.css` via CSS variables.

- **Primary Color:** Neon Cyan (`#06b6d4`)
- **Accent Color:** Violet (`#8b5cf6`)
- **Background:** Deep Black (`#000000`)

To customize the theme, edit the `:root` variables in `src/index.css`.

## 📦 Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/secure-voting-system/voting-frontend.git
    cd voting-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
