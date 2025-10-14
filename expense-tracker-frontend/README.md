# Expense Tracker Frontend

A React frontend for the ExpenseTracker Spring Boot application.

## Features

- **Authentication**: Login and registration
- **Dashboard**: Summary with charts and analytics
- **Expense Management**: Add, edit, delete expenses
- **Income Management**: Add, edit, delete income entries
- **Data Import/Export**: CSV import and export functionality
- **Messages**: View today's reminders and notifications
- **Reminders**: Full CRUD operations for reminders
- **Budgets**: Create and manage budgets for categories
- **Category Management**: Add and manage expense/income categories
- **Settings**: User profile information

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- ExpenseTracker backend running on http://localhost:8080

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Backend Configuration

Make sure your ExpenseTracker Spring Boot application is running on port 8080. The frontend is configured to connect to:
- API Base URL: `http://localhost:8080/api/v1`

## Usage

1. **Authentication**: Start by registering a new account or logging in with existing credentials
2. **Summary**: View your financial overview with charts and top expenses
3. **Expenses**: Manage your expense entries with full CRUD operations
4. **Earnings**: Manage your income entries  
5. **Messages**: View today's reminders and notifications
6. **Reminders**: Create, edit, and manage all reminders
7. **Budgets**: Set spending limits and track budget usage
8. **Categories**: Manage expense and income categories
9. **Settings**: View your profile information

## API Integration

The frontend integrates with the following backend endpoints:

- `/api/v1/auth/*` - Authentication
- `/api/v1/expenses/*` - Expense management
- `/api/v1/analytics/*` - Analytics and reports
- `/api/v1/categories/*` - Category management
- `/api/v1/reminders/*` - Reminder management
- `/api/v1/budgets/*` - Budget management
- `/api/v1/csv/*` - Data import/export

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Troubleshooting

If you encounter issues with the development server:

1. Delete `node_modules` and reinstall:
```bash
rmdir /s /q node_modules
npm install
```

2. Try running with npx:
```bash
npx vite
```

3. Ensure your backend is running and accessible at http://localhost:8080