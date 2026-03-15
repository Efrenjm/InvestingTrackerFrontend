# Investing Tracker: Frontend

Bienvenido al frontend de **Investing Tracker**, una Progressive Web App (PWA) moderna para la gestión inteligente de tus inversiones.

## Características Principales
- **Autenticación Segura**: Registro con verificación OTP (6 dígitos) y sesión persistente mediante cookies HttpOnly.
- **Experiencia Offline**: Acceso inmediato a tus datos mediante Service Workers e IndexedDB.
- **Diseño Moderno**: Interfaz minimalista construida con Tailwind CSS 4 y Angular Material.
- **Arquitectura Escalable**: Código modular siguiendo el patrón de Clean Architecture y Angular 21+.

## Documentación
Para entender cómo está construida la aplicación, consulta los siguientes documentos:

- **[Guía de Arquitectura](docs/ARCHITECTURE.md)**: Estructura general, tecnologías y decisiones de diseño.
- **[Feature: Autenticación](src/app/features/auth/docs/README.md)**: Detalles sobre el flujo de registro y login.

## Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar Storybook (documentación de componentes)
npm run storybook
```

### Construcción y PWA
```bash
# Construir para producción
npm run build
```

---
© 2026 InvestingTracker.
