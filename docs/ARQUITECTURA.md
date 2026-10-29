# Arquitectura — HEIR

SPA Vite. La landing explica el producto. El panel y el admin leen finanzas de la API. Las secciones `pro` y `patient` siguen con datos de `src/data/demo.ts` en las rutas `/demo/*`.

## Estructura

```
src/pages        Home, Login, Dashboard del profesional, Admin
src/sections     landing, demo del profesional, demo del paciente
src/lib/api      client Token + X-Branch-ID, auth, finance, branches
src/lib/session.tsx   rol y sucursal activa en localStorage
src/components   UI y la demo del chat
```

## Flujo de sesión

```mermaid
flowchart TD
  login[login_complete] --> rol{Rol}
  rol -->|superadmin| admin[/admin consolidado]
  rol -->|profesional| panel[/panel ingresos y gastos]
  rol -->|paciente| paciente[/paciente]
  demo[/demo/pro y /demo/paciente] --> fixtures[data/demo.ts]
  admin --> api[API finance y branches]
  panel --> api
```

La sucursal activa viaja en `X-Branch-ID`. El admin de superadmin lista sucursales para cambiar el contexto. El agente de reservas de la landing es una demo de interfaz: el módulo `ai_agents` todavía no está conectado en este cliente.
