# Memory: index.md
Updated: now

# Talleres EPT - Project Memory

## Design System (Brand Guide GRAMA 2024)
- **Primary Colors**: Verde Oscuro #043941, Verde Cerceta #045f6c, Verde Claro #00c16e, Verde Claro 1 #d2ffe1, Verde Claro 2 #e3f8fb
- **Secondary**: Verde Menta #02d47e
- **Accent/Acompañamiento**: Lila #d4c4fc, Lila Claro #e3d8fe, Amarillo #f8ee91, Amarillo Claro #fdf8da
- **Font**: Manrope (ExtraLight–ExtraBold) + DM Mono
- Logo: src/assets/logo-grama.png
- primary-foreground changed to white (for contrast on green)

## Architecture
- 9 talleres EPT with 6 LMS modules each
- Modules: 1.Conocimiento 2.Investigación 3.Innovación 4.Almacén 5.Pedagogía 6.ProyectoFinal
- Module 1 has 7 sub-secciones with rich content
- Data: talleresConfig.ts (config) + bienesData.ts (bienes) + modulosConfig.ts (LMS modules)
- Progress: ProgressContext with localStorage (no Supabase yet)
- Routes: / (Hub) → /taller/:slug → /taller/:slug/modulo/:num → /taller/:slug/repositorio

## Decisions
- No auth for now (Hub + LMS structure first)
- Fase 1 complete: Sidebar + Routes + Módulo 1 rico
- All video/3D/360 frames are placeholders with TODO comments
