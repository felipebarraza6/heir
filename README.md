# HEIR

> Demo de una plataforma de agenda, pagos y agente conversacional para profesionales de la salud en Chile.

---

## ¿Qué es HEIR?

**HEIR** es una plataforma todo-en-uno para profesionales que atienden con citas recurrentes —por ejemplo kinesiólogos, psicólogos, nutricionistas o cualquier consulta con pacientes semanales— que necesitan:

- Una agenda online.
- Un agente que responda consultas de precios y horarios automáticamente.
- Recordatorios de asistencia.
- Un registro de pagos conectado a cada paciente y sesión.
- Control multi-sucursal.

La demo incluye dos vistas:

- **Vista del profesional**: panel de control, agenda semanal, pacientes, pagos y recordatorios.
- **Vista del paciente**: próximas citas, confirmación de asistencia y pagos simulados.

El objetivo es reemplazar la combinación de apps separadas (agenda + WhatsApp + planilla + bot genérico) por una sola herramienta donde el agente conoce los valores, horarios y sucursales del profesional.

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

## Stack tecnológico

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS 3.4**
- **shadcn/ui** (componentes base)
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **Zod** + **React Hook Form** (validaciones de formularios)
- **Recharts** (gráficos en el panel profesional)

---

## Estructura del proyecto

```
heir/
├── src/
│   ├── sections/
│   │   ├── landing/        # Landing page con demo de agente
│   │   ├── pro/            # Vista del profesional (panel, agenda, pacientes, pagos, recordatorios)
│   │   └── patient/        # Vista del paciente
│   ├── components/ui/      # Componentes de shadcn/ui
│   ├── components/         # Componentes propios (chat demo, reveal, etc.)
│   ├── data/demo.ts        # Datos simulados para la demo
│   ├── lib/utils.ts        # Utilidades
│   ├── App.tsx             # Navegación entre vistas
│   └── main.tsx            # Punto de entrada
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Cómo correr el proyecto

Requisitos:

- Node.js 20 o superior
- npm (se incluye `package-lock.json`)

```bash
npm install
npm run dev
```

Para compilar:

```bash
npm run build
```

Para revisar estilos:

```bash
npm run lint
```

---

## Datos de la demo

La demo usa datos simulados de un kinesiólogo ficticio llamado **Felipe Ulloa**, con pacientes, horarios, pagos y recordatorios generados para la semana del 10 al 14 de agosto de 2026.

> Esta es una **demonstración visual**. El agente, WhatsApp, pagos reales y base de datos aún no están conectados a servicios externos.

---

## Próximos pasos ideales

1. Definir modelo de datos real (pacientes, citas, pagos, sucursales).
2. Conectar backend con base de datos y autenticación.
3. Integrar API de WhatsApp para recordatorios y reservas.
4. Implementar pasarela de pagos real (flow/khipu/webpay según mercado chileno).
5. Agregar tests unitarios y de integración.
