# Feature: Authentication

This feature manages user access to the application through a registration system with code verification (OTP) and session management using HttpOnly cookies.

## Flows

### 1. Registration and Verification
1. **Registration (`/auth/register`)**: The user provides basic information. The system responds with a `userId` and sends a 6-digit code to their email.
2. **Verification (`/auth/verify-code`)**: The user enters the code. If valid, the server sets the session cookie and authenticates the user.
3. **Code Resend**: Available after a 1-minute wait from the last send.

### 2. Sign In
- Direct authentication using email and password at `/auth/login`.

### 3. Persistence and Session
- The session is maintained via a JWT in an **HttpOnly cookie** (not accessible by JS).
- The frontend retrieves the session upon loading by calling `/user`.
- Basic user metadata is stored in **IndexedDB** for faster initial loading (optimistic UX).

## Reusable Components Used
- `AuthLayoutComponent`: Visual structure of the screens.
- `InputComponent`: Standardized form field handling.
- `ButtonComponent`: Buttons with loading states.

## Security
- **AuthInterceptor**: Automatically adds `withCredentials: true` to all API requests.
- **ErrorInterceptor**: Detects 401/403 responses and redirects to login.
- **AuthGuard / GuestGuard**: Protect internal and public routes respectively.
