# Leaderboard Frontend

A React TypeScript frontend application for the Leaderboard system with authentication and user management features.

## Features

- **Authentication System**

  - User registration and login
  - Password reset functionality
  - JWT token management
  - Protected routes

- **User Management**

  - User profile viewing and editing
  - Password change functionality
  - User statistics display

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Loading states and error handling
  - Form validation

## Tech Stack

- **React 19** with TypeScript
- **CSS3** with modern styling
- **Local Storage** for token persistence
- **Fetch API** for HTTP requests

## Project Structure

```
src/
├── components/
│   └── common/           # Reusable UI components
│       ├── Button.tsx
│       ├── Button.css
│       ├── Input.tsx
│       ├── Input.css
│       └── index.ts
├── screens/
│   ├── auth/            # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── AuthScreen.css
│   └── dashboard/       # Main application screens
│       ├── DashboardScreen.tsx
│       └── DashboardScreen.css
├── services/
│   ├── api.ts          # API service for backend communication
│   └── authService.ts  # Authentication service
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   └── validation.ts   # Form validation utilities
├── hooks/
│   └── useAuth.ts      # Custom authentication hook
├── context/
│   └── AuthContext.tsx # React context for auth state
├── App.tsx
├── App.css
├── index.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (default: http://localhost:3001/api)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd leaderboard-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

4. Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## API Endpoints

The frontend expects the following backend endpoints:

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code
- `POST /api/auth/change-password` - Change password (authenticated)

### User Management

- `GET /api/user/profile` - Get user profile (authenticated)
- `PUT /api/user/profile` - Update user profile (authenticated)
- `GET /api/auth/confirmation-code` - Get confirmation code (authenticated)

## Development

### Adding New Components

1. Create the component file in the appropriate directory
2. Add TypeScript interfaces for props
3. Include CSS file if needed
4. Export from index files for easy importing

### Styling

The project uses CSS modules and follows a component-based styling approach. Each component has its own CSS file for maintainability.

### State Management

Authentication state is managed through React Context and custom hooks, providing a clean API for components to access user data and authentication methods.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
