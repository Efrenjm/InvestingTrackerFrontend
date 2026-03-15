# Feature: Authentication

Esta funcionalidad gestiona el acceso de los usuarios a la aplicación a través de un sistema de registro con verificación por código (OTP) y gestión de sesiones mediante cookies HttpOnly.

## Flujos

### 1. Registro y Verificación
1. **Registro (`/auth/register`)**: El usuario proporciona sus datos básicos. El sistema responde con un `userId` y envía un código de 6 dígitos al correo.
2. **Verificación (`/auth/verify-code`)**: El usuario ingresa el código. Si es válido, el servidor settea la cookie de sesión y autentica al usuario.
3. **Reenvío de código**: Disponible después de 1 minuto de espera desde el último envío.

### 2. Inicio de Sesión
- Autenticación directa mediante email y contraseña en `/auth/login`.

### 3. Persistencia y Sesión
- La sesión se mantiene mediante un JWT en una **cookie HttpOnly** (no accesible por JS).
- El frontend recupera la sesión al cargar llamando a `/user`.
- Los metadatos básicos del usuario se guardan en **IndexedDB** para una carga inicial más rápida (UX optimista).

## Componentes Compartidos Utilizados
- `AuthLayoutComponent`: Estructura visual de las pantallas.
- `InputComponent`: Manejo estandarizado de campos de formulario.
- `ButtonComponent`: Botones con estados de carga.

## Seguridad
- **AuthInterceptor**: Añade `withCredentials: true` automáticamente a todas las peticiones a la API.
- **ErrorInterceptor**: Detecta respuestas 401/403 y redirige al login.
- **AuthGuard / GuestGuard**: Protegen las rutas internas y públicas respectivamente.
