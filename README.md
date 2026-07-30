# Valora Wallet — Frontend

Dashboard web de **Valora Wallet**, billetera digital multi-moneda para freelancers y trabajadores remotos en LATAM. Desarrollado por **Nexo Tech Solutions**.

> Plataforma de gestión financiera que permite a profesionales independientes centralizar cobros internacionales en múltiples monedas (USD, EUR, ARS), realizar conversiones en tiempo real para sus gastos locales y contar con un asistente de IA para optimizar la gestión de sus ingresos.

## Stack

- **Framework:** React + TypeScript (.tsx)
- **Build tool:** Vite
- **Estilos:** CSS Modules — cada componente lleva su `.module.css` al lado. Se evaluó Tailwind (más veloz para dashboards, dark mode nativo), pero se optó por CSS Modules porque el equipo ya lo domina de proyectos anteriores y, combinado con `shared/components` + design tokens centralizados, se logra la misma consistencia sin sumar una herramienta nueva.
- **Despliegue:** Vercel

## Requisitos

- Node.js 20+
- El backend corriendo (local o la URL de Railway). **Nota:** frontend y backend son dos repositorios separados, no un monorepo.

## Instalación y setup local

```bash
git clone https://github.com/<org-o-usuario>/valora-wallet-frontend.git
cd valora-wallet-frontend
npm install
cp .env.example .env.local   # completar con la URL del backend
npm run dev                   # levanta el servidor en modo desarrollo
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend (local: `http://localhost:3000`, producción: URL de Railway) |

## Estructura del proyecto

Screaming Architecture: se organiza por dominio, no por tipo técnico.

```
src/
  shared/
    components/       # Button, Card, Input, Modal, NotificationModal — reutilizables, sin lógica de negocio
    styles/
      variables.css    # design tokens: paleta de colores, tipografía, espaciados
  layouts/
    DashboardLayout/   # header con espacio para usuario logueado (avatar/email, dropdown de logout)
  pages/
    Dashboard/
    Login/
  features/
    transactions/       # compra/venta/intercambio
    history/             # historial de transacciones
    chatbot/              # asistente Gemini
```

Cada componente sigue el patrón `Componente.tsx` + `Componente.module.css` al lado.

## Diseño

- **Tema por defecto:** modo oscuro (dark theme fintech), con toggle a modo claro.
- **Paleta base:**

```css
:root {
  --bg-base: #262624;        /* gris oscuro cálido, base de toda la app */
  --bg-surface: #2f2f2d;     /* cards, superficies elevadas */
  --accent: #f0b429;         /* dorado/ámbar — color de marca de Valora */
  --accent-hover: #d69a1f;
  --success: #2ecc8f;
  --danger: #e5484d;
  --text-primary: #f5f5f4;
  --text-secondary: #a3a39e;
  --border: #3a3a38;
}
```

- El dorado se usa como acento (CTAs, montos destacados, estados activos), no como color de fondo masivo.
- Ningún color hardcodeado dentro de un módulo: siempre se consumen los tokens de `shared/styles/variables.css`.
- Lineamientos de UX/UI a cargo de Analía; estructura/layout a cargo de Gerardo.

## Flujo de trabajo con Git

**Ramas:**
- `main` y `dev` son ramas protegidas.
- Cada integrante trabaja sobre su propia rama personal fija (ej. `gerardo`, `analia`), acumulando ahí sus cambios en vez de abrir una rama nueva por feature.

**Flujo de merge:** `personal → dev → main` (dos Pull Requests).

**Aprobación:**
- `main` requiere 2 aprobaciones.
- `dev` requiere 1 aprobación.
- No hay codeowner fijo — cualquier integrante del equipo puede revisar y aprobar (nadie aprueba su propio PR).

**Checklist antes de abrir cualquier PR:**
- Correr `npx tsc --noEmit` y confirmar que compila sin errores.
- Confirmar que no rompe nada existente.
- Verificar que la rama base esté actualizada.

**Buenas prácticas de PR:**
- PRs chicos, enfocados en una sola cosa.
- Si el PR se abre para conversar antes de estar listo, prefijar el título con `WIP: ` y sacarlo cuando esté feature-complete y testeado.
- Una vez aprobado, lo mergea el autor del PR.

**Commits:**
- En español, primera persona, humanizados — no generados por bot. Decisión consensuada por el equipo.
- Línea única por commit, sin body ni co-author tags.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`) — el prefijo indica el tipo de cambio dentro del mensaje del commit, ej. `feat(historial): agregar filtro por moneda`.
- Revisar el diff antes de cada commit.

## Scripts disponibles

```bash
npm run dev        # desarrollo con hot-reload
npm run build      # build de producción
npm run preview    # previsualiza el build de producción
npm run test         # (si aplica) tests de componentes
```

## Despliegue

Conectado a Vercel: cada push a `main` dispara un deploy automático. La variable `VITE_API_URL` se configura en el dashboard de Vercel apuntando a la URL pública del backend en Railway.

## Equipo

- **Gerardo Acosta** — Full Stack, orientación frontend. Setup del proyecto, routing, layout, vistas principales e historial de transacciones.
- **Analía Pérez Juliá** — Full Stack, orientación frontend + integraciones. UX/UI del dashboard, AWS SES, documentación y coordinación del equipo.
- **Daniel Sardinas** — Full Stack, AI Integrations & Core Logic. Chatbot Gemini, formularios de transacciones, validaciones anti-prompt injection.
- **Santiago Ezequiel Chavez** — Full Stack, Backend & Infrastructure Lead (colaborador en este repo). Base de datos PostgreSQL, API REST Express, caching y testing.
