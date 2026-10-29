# HEIR

## Qué es

HEIR es el cliente de Ginnung para profesionales de la salud que atienden con hora: agenda, pagos y un agente de reservas. Hoy está en pre-producción: parte de la UI sigue en demo y las finanzas ya leen la API Yggdra.

## A quién sirve

Profesionales con consulta recurrente (kinesiología, psicología, nutrición y oficios parecidos), quien administra varias sedes y el paciente que mira su lado de la app. Las rutas demo `/demo/pro` y `/demo/paciente` siguen en el código para mostrar el producto sin API.

## Stack

React 19, TypeScript, Vite 7, Tailwind CSS 3, shadcn/ui, Framer Motion, Recharts. npm y `package-lock.json`. No hay CI.

## Cómo correr en local

```bash
cp .env.example .env
npm install
npm run dev
```

Vite sirve el dev server. La API local de ejemplo es `http://localhost:8000/api`. El usuario demo de desarrollo de Yggdra sirve para entrar como superadmin en local. Es una credencial de la demo del backend, no de producción.


## Variables de entorno

Solo nombres. Copia el ejemplo a un archivo local y completa los valores ahí. No los commitees ni los pegues en un issue.

| Nombre | Uso |
|--------|-----|
| `VITE_YGGDRA_API_BASE` | Base de la API, con `/api` |

El ejemplo versionado apunta a `http://localhost:8000/api`.


## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Vite |
| `npm run build` | `tsc -b` y build de Vite |
| `npm run lint` | ESLint |
| `npm run preview` | Previsualiza `dist/` |

No hay tests en `package.json`.


## Deploy (como está hoy)

No hay workflow de deploy. `docs/CONSUMERS.yaml` marca `deploy.how: unknown`, sin dominios, estado activo. No hay sitio de producción declarado en el inventario ni en el repo.


Este PR de documentación no cambia workflows, secretos ni el destino del deploy.

## Relación con la API Ginnung

Auth `Authorization: Token` vía `POST /api/accounts/users/login_complete/` y header `X-Branch-ID`.

El README de producto ya cablea finanzas: `/api/finance/revenues/`, `/api/finance/expenses/`, `/api/finance/profitability-reports/summary/`, `/api/finance/revenues/by_date_range/` y sucursales en `/api/branches/branches/`. El inventario resume el consumo como fetch manual a finance, accounts y branches.

Roles que resuelve el cliente hoy:

| Rol | Cómo se resuelve | Ruta |
|-----|------------------|------|
| Superadmin | `is_superuser` o `type_user === ADM` | `/admin` |
| Profesional | tiene `branch_assignments` | `/panel` |
| Paciente | sin asignaciones de sucursal | `/paciente` |

Ese criterio de `ADM` es el que el backend marca en el comportamiento `type_user_ADM_for_superadmin`: el acceso global real es `is_superuser` o ADM con `is_staff`. Conviene no tratar todo `ADM` como superadmin cuando se cierre el contrato.

Agenda, pacientes y recordatorios siguen como próximo cableado (scheduling, customers, ai_agents). El cliente llama `forgot_password` y no tiene ruta `/reset-password`. El inventario lo marca obligatorio.

No hay `sync-contract` ni `contract.yml`.

Id de consumidor y etiqueta de issues de backend: `front:heir`.


El chequeo reutilizable está en [docs/CONTRACT_CHECK.md](https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md) y en `.github/workflows/contract-check.yml` de `yggdra_infra`. Corre en el runner del VPS, compara el `schema_sha256` de `https://api.yggdra.cl/api/schema/contract/` con el sha commiteado en el front, regenera tipos desde el freeze de `api/schema/openapi.yaml` y exige `tsc --noEmit`.

En la rama por defecto de este repo **no hay** un workflow `contract.yml` que llame ese chequeo. El inventario `docs/CONSUMERS.yaml` del backend describe el estilo de consumo de cada app.

## Enlaces

- Arquitectura: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)
- Notas de producto: [info.md](info.md)
- API Ginnung: https://github.com/felipebarraza6/yggdra_infra
- Chequeo de contrato: https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONTRACT_CHECK.md
- Consumidores: https://github.com/felipebarraza6/yggdra_infra/blob/main/docs/CONSUMERS.md
