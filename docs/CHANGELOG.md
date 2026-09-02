# Historial de Cambios — Valora Wallet Frontend

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.5.0] - 2026-09-02

### Added (Añadido)
- **Módulo de Múltiples Tarjetas (Cards):**
  - Integración completa con la API REST `/cards` del backend mediante `cardService.ts`.
  - Creación del componente `CreateCardModal` con vista previa en tiempo real y selección de niveles (`Platinum`, `Black`, `Gold`) y modalidades (`Virtual`, `Física`).
  - Soporte en `CardDisplay` para temas visuales por tier (`VALORA PLATINUM`, `VALORA BLACK`, `VALORA GOLD`), estados de congelamiento (`isFrozen`) y acciones de gestión (congelar/descongelar, dar de baja y desocultar credenciales).
  - Renovación interactiva de la vista `Tarjetas.tsx` con grilla dinámica de tarjetas y ranura de emisión con control de límite de 5 tarjetas por cuenta.
- **UX/UI y Responsive:**
  - `TransactionRow.module.css`: Ajuste de tamaño de fuente a 14px, `line-clamp: 2` y `overflow-wrap: break-word` para evitar colisiones de texto con el monto en paneles laterales estrechos.
  - `Dashboard.module.css`: Reorganización dinámica de la grilla de botones de operaciones rápidas (`repeat(2, 1fr)` en < 859px y `1fr` en < 340px) evitando el recorte de etiquetas en pantallas compactas.
- **Testing:** Suite de pruebas unitarias `cardService.test.ts` con Vitest cubriendo los 5 métodos del cliente de la API (8 suites / 54 tests en verde).
- **Documentación y Cuentas de Prueba:**
  - Inclusión de la tabla de credenciales de prueba (`demo.juan@valora.com`, `demo.maria@valora.com`, `demo.carlos@valora.com`) en el `README.md`.
  - Sección de recorrido visual con capturas y descripciones de flujos (incluyendo modal de compra/venta/depósito).

## [1.4.0] - 2026-09-01

### Changed (Modificado)
- **Diseño Auth y Responsividad:** Centrado simétrico del panel de marca (`brandPanelInner`) y mejoras de adaptación en resoluciones ultra-wide y mobile.
