# Big Bang Cali · Landing Funnel 400%

Landing de un solo objetivo: que el visitante complete el quiz interactivo
que alimenta el embudo de GoHighLevel. Toda decisión visual y de copy sirve
ese fin.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript estricto**
- **Tailwind CSS v4** con tokens custom de marca (`globals.css`)
- **Framer Motion v11** para animaciones y `AnimatePresence`
- **Radix UI** (Dialog, Accordion, Radio Group, Label, Slot) — sin dependencia de `shadcn/ui` CLI
- **react-hook-form + zod** para el formulario mayorista
- **balloons-js** para efecto wow al ingresar y al completar quiz
- **lucide-react** para iconografía (stroke 2.0 uniforme)
- **Nunito** (`next/font`) en pesos 400/700/800/900

> Nota: la spec original pedía Next.js 15. `create-next-app` instaló 16.2.6, que es retrocompatible con el App Router y todas las APIs usadas. Si necesitan downgradear, cambien `next` y `eslint-config-next` en `package.json` a `^15.0.0` y reinstalen.

## Cómo correr

```bash
npm install
cp .env.example .env.local   # luego completar con los valores reales
npm run dev                  # http://localhost:3000
npm run build                # build de producción
npm run start                # corre el build
```

## Variables de entorno

| Variable | Dónde | Rol |
|---|---|---|
| `GHL_WEBHOOK_URL` | server only | Webhook del workflow "01 - Captura Lead Quiz Landing" |
| `GHL_WEBHOOK_MAYORISTA_URL` | server only | Webhook B2B (vacío hasta que Sebas lo cree → activa modo fallback) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | client | Para el FAB y links wa.me |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `FACEBOOK_URL` / `TIKTOK_URL` | client | Footer |
| `NEXT_PUBLIC_SITE_URL` | client | Canonical + OG |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | client | Tracking (vacíos = no se cargan scripts) |

`.env.local` está en `.gitignore`. `.env.example` SÍ se commitea.

## Arquitectura

```
app/
├── layout.tsx              # Nunito font, metadata, GA/Pixel condicionales
├── page.tsx                # Composición de 13 secciones + Quiz + FAB
├── globals.css             # Tokens de marca, keyframes, utilidades bento
├── gracias/page.tsx        # Página post-form (noindex)
└── api/
    ├── lead/route.ts       # Proxy hacia GHL minorista
    └── mayorista/route.ts  # Proxy mayorista con fallback 503

components/
├── BigBangLogo.tsx         # SVG wordmark, 3 variants (default/footer/compact)
├── WhatsAppFAB.tsx         # FAB flotante con hint a los 30s
├── ui/                     # Primitives (Button, Dialog, Accordion, etc.)
├── quiz/
│   ├── QuizProvider.tsx    # Context global. useQuiz().open(codigo?)
│   └── QuizModal.tsx       # 2 caminos × 7 pasos + welcome + success
└── sections/               # Las 13 secciones de la landing

lib/
├── codigos-dec.ts          # Catálogo de 50 códigos DEC + bento pattern
├── ghl.ts                  # Cliente del proxy
├── analytics.ts            # GA + Meta Pixel stubs
└── utils.ts                # cn(), waLink(), unsplashUrl()
```

## El embudo

```
Hero (CTA) ──┐
Espejo  ─────┤
Stats  ──────┤
Galería ─────┤──► QuizModal (welcome → A/B × 7 pasos) ──► /api/lead ──► GHL Workflow "01"
Conexión ────┤                                                              │
Cómo  ───────┤                                                              ▼
Personali. ──┤                                          Pipeline "Base de Datos" / Nuevo Lead
Testimonios ─┤
Escasez ─────┤
Mayoristas ──┴──► /api/mayorista ──► 503 + fallback WhatsApp (hasta que exista webhook B2B)
FAQ
CTA Final (con globos antes de abrir el quiz) ──┘
Footer + Schema.org LocalBusiness JSON-LD
WhatsAppFAB (siempre visible + hint a los 30s)
```

## Detalles que conviene recordar

- **Persistencia del quiz**: estado guardado en `localStorage` (`bb-quiz-state-v1`). Si el visitante cierra y vuelve, retoma donde dejó.
- **Tracking parcial**: si llega al paso 3+ y queda 60s inactivo con teléfono cargado, se dispara un POST con `tipo_envio: "parcial"` para que Sebas pueda hacer remarketing.
- **Balloons**: dispara una vez al cargar (flag `bb-greeted` en localStorage), una vez al click del CTA final, y una vez al éxito del quiz. No spam.
- **Fallback mayorista**: si `GHL_WEBHOOK_MAYORISTA_URL` está vacío, el endpoint devuelve `503` con `{ fallback: true, whatsapp_url, message }`. `<Mayoristas>` lo detecta y muestra un card WhatsApp en lugar de "error".
- **Cupos de escasez**: props `cuposOcupados` y `cuposTotal` en `<Escasez />` (default 2/3). Se editan cada lunes desde `app/page.tsx`.
- **Imágenes**: placeholders Unsplash con `unoptimized` (next/image no las procesa). Cuando el cliente entregue fotografía real, reemplazar los IDs en `lib/codigos-dec.ts → POOL` y los arrays `HERO_IMGS` / `PHOTOS` de `Hero.tsx` y `PersonalizacionInfinita.tsx`.
- **Logo**: `public/logo-big-bang.svg` + componente `<BigBangLogo />` reproducen el wordmark. Cuando llegue el PNG/SVG oficial reemplazá el archivo en `public/` (y opcionalmente simplificá el componente a un `<Image>`).

## Lado GoHighLevel (Sebas)

Ya activo:
- Custom fields: `Tipo de Evento`, `Para Quien`, `Tiene Tematica`, `Tematica Detalle`, `Fecha Evento`, `Presupuesto`, `Resumen Quiz`
- Workflows: `01 - Captura Lead Quiz Landing`, `02 - No contesto`, `03 - Confirmacion al agendar`, `04 - Recordatorios condicionales`

Falta y queda documentado para que se complete:
- Crear webhook trigger para mayoristas y poner la URL en `GHL_WEBHOOK_MAYORISTA_URL`
- Agregar tag `Lead Decoraciones` al workflow 01
- Cuando WhatsApp Business esté conectado, cambiar SMS por WhatsApp en workflows 2/3/4 (no afecta este frontend)

## Deploy a Vercel

1. Pushear a un repo de GitHub
2. Importar el repo en Vercel
3. Pegar las env vars en el panel (especialmente `GHL_WEBHOOK_URL`)
4. Apuntar el dominio real cuando se compre y actualizar `NEXT_PUBLIC_SITE_URL`

## Checklist pre-launch

- [ ] Reemplazar `logo-big-bang.svg` por el PNG oficial cuando llegue
- [ ] Reemplazar fotos placeholder por fotografía real de montajes
- [ ] Verificar que llega contacto a GHL desde producción (mirar el pipeline)
- [ ] Cargar `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID` cuando el cliente los provea
- [ ] Comprar dominio y actualizar `NEXT_PUBLIC_SITE_URL`
- [ ] Lighthouse desktop ≥ 95, mobile ≥ 90
