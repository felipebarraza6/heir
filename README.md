# HEIR

> Plataforma de agenda, pagos y agente conversacional para profesionales de la salud en Chile — conectada a Yggdra.

---

## ¿Qué es HEIR?

**HEIR** es una plataforma todo-en-uno para profesionales que atienden con citas recurrentes —por ejemplo kinesiólogos, psicólogos, nutricionistas o cualquier consulta con pacientes semanales— que necesitan:

- Una agenda online.
- Un agente que responda consultas de precios y horarios automáticamente.
- Recordatorios de asistencia.
- Un registro de pagos conectado a cada paciente y sesión.
- Control multi-sucursal.

---

## Funciones principales

| Función | Descripción |
| --- | --- |
| **Agente de reservas** | El paciente conversa con un asistente, ve horarios disponibles y confirma la reserva sin intervención manual. |
| **Consultas de valores** | El agente responde precios y procedimientos usando la lista configurada por el profesional. |
| **Recordatorios automáticos** | Envía recordatorios 24 h antes y pide confirmación de asistencia. |
| **Billetera digital** | Registra pagos online, transferencias y efectivo, vinculados a cada sesión. |
| **Multi-sucursal** | Agenda e ingresos separados o consolidados según la sede. |
| **Agenda semanal recurrente** | Horarios fijos de pacientes habituales protegidos y re-agendados automáticamente. |

---

## Pre-producción: conexión real a Yggdra

El prototipo consume la API Yggdra con el mismo contrato que frig y nxord:

- **Auth:** `POST /api/accounts/users/login_complete/` → `Authorization: Token <key>`
- **Multi-tenant:** header `X-Branch-ID` en cada request (aislamiento por sucursal)
- **Finanzas:** `/api/finance/revenues/`, `/api/finance/expenses/`, `/api/finance/profitability-reports/summary/`, `/api/finance/revenues/by_date_range/`
- **Sucursales:** `/api/branches/branches/` (vista superadmin)

### Roles y rutas

| Rol | Cómo se resuelve | Ruta |
| --- | --- | --- |
| Superadmin | `is_superuser` o `type_user === 'ADM'` | `/admin` (consolidado multi-sucursal) |
| Profesional | tiene `branch_assignments` | `/panel` (resumen, ingresos, gastos) |
| Paciente | sin asignaciones | `/paciente` (app de paciente) |

Rutas demo conservadas: `/demo/pro` y `/demo/paciente`.

### Configuración

```bash
cp .env.example .env   # VITE_YGGDRA_API_BASE=http://localhost:8000/api
npm install && npm run dev
```

Credenciales demo de Yggdra: `admin@example.com` / `admin123` (superadmin).

---

## Stack tecnológico

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS 3.4**
- **shadcn/ui** (componentes base)
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **Recharts** (gráficos en el panel profesional)

---

## Estructura del proyecto

```
heir/
├── src/
│   ├── lib/
│   │   ├── api/          # client.ts (apiFetch Token + X-Branch-ID), auth.ts, finance.ts, branches.ts, types.ts
│   │   └── session.tsx   # Sesión, roles y sucursal activa (persistida en localStorage)
│   ├── pages/            # Login.tsx, Dashboard.tsx (profesional), Admin.tsx (superadmin)
│   ├── sections/
│   │   ├── landing/      # Landing page con demo de agente
│   │   ├── pro/          # Demo: panel del profesional (agenda, pacientes, pagos)
│   │   └── patient/      # Demo: vista del paciente
│   ├── components/ui/    # Componentes de shadcn/ui
│   ├── data/demo.ts      # Datos simulados para las vistas demo
│   ├── App.tsx           # Rutas y guards por rol
│   └── main.tsx          # Punto de entrada
├── .env.example
├── index.html
└── package.json
```

---

## Próximos pasos ideales

1. Cablear agenda al módulo `scheduling` de Yggdra y pacientes a `customers`/CRM.
2. Integrar API de WhatsApp para recordatorios y reservas (módulo `ai_agents`).
3. Implementar pasarela de pagos real (flow/khipu/webpay según mercado chileno).
4. Agregar tests unitarios y de integración.
