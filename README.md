# Voting Frontend

React-based frontend application for the Secure & Transparent Electronic Voting System.

## Features

- User authentication (login/register)
- Voter dashboard
- Vote casting interface
- Results viewing
- Protected routes with role-based access

## Tech Stack

- **React** 18.2
- **React Router** for navigation
- **Axios** for API communication
- **Vite** for build tooling
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── pages/          # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── CastVote.jsx
│   └── Results.jsx
├── components/     # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Docker

Build and run with Docker:

```bash
docker build -t voting-frontend .
docker run -p 3000:3000 voting-frontend
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
