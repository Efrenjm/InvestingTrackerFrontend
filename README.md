# Investing Tracker: Frontend

Welcome to the frontend of **Investing Tracker**, a modern Progressive Web App (PWA) for the intelligent management of your investments.

## Main Features
- **Secure Authentication**: Registration with OTP verification (6 digits) and persistent sessions using HttpOnly cookies.
- **Offline Experience**: Immediate access to your data through Service Workers and IndexedDB.
- **Modern Design**: Minimalist interface built with Tailwind CSS 4 and Angular Material.
- **Scalable Architecture**: Modular code following the Clean Architecture pattern and Angular 21+.

## Documentation
To understand how the application is built, consult the following documents:

- **[Architecture Guide](docs/ARCHITECTURE.md)**: General structure, technologies, and design decisions.
- **[Feature: Authentication](src/app/features/auth/docs/README.md)**: Details about the registration and login flow.

## Useful Commands

### Development
```bash
# Start development server
npm start

# Start Storybook (component documentation)
npm run storybook
```

### Build and PWA
```bash
# Build for production
npm run build
```

---
© 2026 InvestingTracker.
