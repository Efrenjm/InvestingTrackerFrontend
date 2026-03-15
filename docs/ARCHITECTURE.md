# Arquitectura del Frontend: Investing Tracker

Este documento describe la estructura y las decisiones técnicas tomadas para el frontend de Investing Tracker.

## Principios de Diseño
- **Clean Architecture**: Separación clara entre capas de infraestructura (HTTP), dominio (Estado) y presentación (UI).
- **Angular Moderno**: Uso de Angular 21+, Signals para el estado, Standalone Components y Functional Interceptors.
- **PWA-First**: Cacheo de assets, funcionamiento offline y persistencia local con IndexedDB.
- **CSS-First**: Uso de Tailwind CSS 4 para el diseño responsivo y Angular Material para componentes UI complejos.

## Estructura de Carpetas

### `src/app/core/`
Singletons y lógica global de la aplicación.
- **`services/`**: Servicios de comunicación y persistencia.
  - `auth-http.service.ts`: Cliente HTTP para autenticación.
  - `auth-store.service.ts`: Estado global (Signals).
  - `indexed-db.service.ts`: Persistencia local.
- **`interceptors/`**: Intercepción de peticiones HTTP.
- **`guards/`**: Protección de rutas.
- **`models/`**: Definición de interfaces TypeScript.

### `src/app/shared/`
Componentes e infraestructura visual reutilizable entre múltiples funcionalidades.
- **`components/`**: Inputs, Botones, etc. (Documentados con Storybook).
- **`layouts/`**: Estructuras de página (ej. Auth Layout).

### `src/app/features/`
Módulos de funcionalidades específicas de negocio.
- **`auth/`**: [Ver documentación de Auth](../src/app/features/auth/docs/README.md)
  - Login, Registro y Verificación OTP.

## Tecnologías Utilizadas
- **Angular 21**: Framework base.
- **Tailwind CSS 4**: Diseño visual.
- **Angular Material**: Componentes de formulario y utilidades.
- **Storybook**: Documentación y desarrollo aislado de componentes.
- **IndexedDB**: Persistencia local robusta.
- **The Noun Project**: Iconografía profesional.

---
Para más detalles sobre una funcionalidad específica, navega al directorio `docs/` dentro de su carpeta en `features/`.
