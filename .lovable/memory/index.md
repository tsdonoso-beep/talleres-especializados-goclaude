# Memory: index.md
Updated: now

# Talleres EPT - Project Memory

## Design System
- Primary: HSL 152 100% 38% (green GRAMA)
- Sidebar dark: HSL 150 35% 8%
- Logo: src/assets/logo-grama.png
- Font: Plus Jakarta Sans + DM Mono

## Architecture
- 9 talleres EPT with 6 LMS modules each
- Modules: 1.Conocimiento 2.Investigación 3.Innovación 4.Almacén 5.Pedagogía 6.ProyectoFinal
- Module 1 has 7 sub-secciones with rich content (from PROMPT_INTEGRACION_FINAL.md)
- Data: talleresConfig.ts (config) + bienesData.ts (bienes) + modulosConfig.ts (LMS modules)
- Progress: ProgressContext with localStorage (no Supabase yet)
- Routes: / (Hub) → /taller/:slug → /taller/:slug/modulo/:num → /taller/:slug/repositorio

## Components ported from EPT v2 (a2e97961)
- ContenidoCard, VimeoPlaceholder, CountdownTimer, TiempoEstimadoBadge
- LiveSessionBanner, LiveSessionPage, ModuloPage, SubSeccionCard
- ProgressContext (adapted to localStorage)

## Decisions
- No auth for now (Hub + LMS structure first)
- Fase 1 complete: Sidebar + Routes + Módulo 1 rico
- Home page minimal changes only (progress bar + "6 módulos · 150h")
- All video/3D/360 frames are placeholders with TODO comments
