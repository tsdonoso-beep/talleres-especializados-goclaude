// ═══════════════════════════════════════════
// TIPOS LMS
// ═══════════════════════════════════════════

export type TipoContenido = "PDF" | "VIDEO" | "INTERACTIVO" | "QUIZ" | "EN VIVO";

export interface ContenidoItem {
  id: string;
  moduloId: string;
  tipo: TipoContenido;
  titulo: string;
  descripcion: string;
  orden: number;
  url?: string;
  pages?: number;
  duracion?: string;
  vimeoId?: string;
  questions?: number;
  estimatedMinutes?: number;
  liveId?: string;
  durationMinutes?: number;
}

export interface SubSeccion {
  id: string;
  titulo: string;
  colorAccent: string; // hex
  areaBadge: string;
  contenidos: ContenidoItem[];
}

export interface Modulo {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
  icon: string; // emoji
  contenidos: ContenidoItem[];
  subSecciones?: SubSeccion[];
}

export interface LiveSession {
  id: string;
  moduloId: string;
  titulo: string;
  docente: string;
  status: "active" | "scheduled" | "recorded";
  scheduledAt: Date;
  durationMinutes: number;
  participants: number;
  vimeoId: string | null;
  agenda: { tiempo: string; tema: string }[];
  materialesPrevios: string[];
}

// ═══════════════════════════════════════════
// MÓDULO 1 — Estructura Rica (7 sub-secciones)
// Genera dinámicamente per-taller con bienes reales
// ═══════════════════════════════════════════

export function buildModulo1(tallerSlug: string): Modulo {
  const prefix = `${tallerSlug}-m1`;
  return {
    id: "1",
    nombre: "Conocimiento del Taller",
    descripcion: "Conoce la distribución, zonas, bienes y normativas del taller.",
    orden: 1,
    icon: "📦",
    contenidos: [], // sub-secciones instead
    subSecciones: [
      {
        id: `${prefix}-s1`,
        titulo: "1.1 — Arquitectura del Espacio",
        colorAccent: "#3B82F6",
        areaBadge: "ARQUITECTURA",
        contenidos: [
          {
            id: `${prefix}-s1-1`, moduloId: "1", tipo: "EN VIVO", orden: 1,
            titulo: "Introducción Arquitectónica del Taller",
            descripcion: "El arquitecto explica carga eléctrica, instalaciones sanitarias, salidas de emergencia y normativas de espacio.",
            durationMinutes: 60,
            liveId: `live-${tallerSlug}-arq`,
          },
          {
            id: `${prefix}-s1-2`, moduloId: "1", tipo: "VIDEO", orden: 2,
            titulo: "Recorrido Arquitectónico — Video MP4",
            descripcion: "Video pregrabado con explicación del espacio físico, distribución y requerimientos técnicos.",
            duracion: "45:00",
          },
        ],
      },
      {
        id: `${prefix}-s2`,
        titulo: "1.2 — Distribución y Zonas",
        colorAccent: "#8B5CF6",
        areaBadge: "ARQUITECTURA",
        contenidos: [
          {
            id: `${prefix}-s2-1`, moduloId: "1", tipo: "INTERACTIVO", orden: 1,
            titulo: "Planos Isométricos del Taller",
            descripcion: "Gallery interactiva con planos de Zona Investigación, Zona Innovación y Depósito.",
            estimatedMinutes: 20,
          },
          {
            id: `${prefix}-s2-2`, moduloId: "1", tipo: "INTERACTIVO", orden: 2,
            titulo: "Tour Virtual 360° por Zona",
            descripcion: "Vista panorámica 360° de cada zona del taller.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: `${prefix}-s3`,
        titulo: "1.3 — Catálogo Técnico de Equipos",
        colorAccent: "#EF4444",
        areaBadge: "TÉCNICO",
        contenidos: [
          {
            id: `${prefix}-s3-1`, moduloId: "1", tipo: "INTERACTIVO", orden: 1,
            titulo: "Explorador de Bienes con Visor 3D",
            descripcion: "Catálogo completo con fichas técnicas, ergonomía, materiales y consumibles.",
            estimatedMinutes: 30,
          },
          {
            id: `${prefix}-s3-2`, moduloId: "1", tipo: "EN VIVO", orden: 2,
            titulo: "Normativas para Selección de Equipos",
            descripcion: "Sesión técnica sobre criterios de selección y normativas vigentes.",
            durationMinutes: 90,
            liveId: `live-${tallerSlug}-tec`,
          },
        ],
      },
      {
        id: `${prefix}-s4`,
        titulo: "1.4 — Seguridad y Medidas",
        colorAccent: "#F59E0B",
        areaBadge: "SEGURIDAD",
        contenidos: [
          {
            id: `${prefix}-s4-1`, moduloId: "1", tipo: "PDF", orden: 1,
            titulo: "Normativas de Seguridad — Manual Oficial",
            descripcion: "Documento con normativas de seguridad aplicables al taller.",
            pages: 20,
          },
          {
            id: `${prefix}-s4-2`, moduloId: "1", tipo: "VIDEO", orden: 2,
            titulo: "Señalética y Rutas de Evacuación",
            descripcion: "Video explicativo de señalética y procedimientos de evacuación.",
            duracion: "15:00",
          },
          {
            id: `${prefix}-s4-3`, moduloId: "1", tipo: "INTERACTIVO", orden: 3,
            titulo: "Mapa de Seguridad Interactivo",
            descripcion: "Plano con overlay de salidas, extintores, botiquín y zonas de riesgo.",
            estimatedMinutes: 10,
          },
        ],
      },
      {
        id: `${prefix}-s5`,
        titulo: "1.5 — Programa Formativo",
        colorAccent: "#10B981",
        areaBadge: "PEDAGÓGICO",
        contenidos: [
          {
            id: `${prefix}-s5-1`, moduloId: "1", tipo: "PDF", orden: 1,
            titulo: "Programa Formativo — Competencias y Habilidades",
            descripcion: "Programa formativo con competencias esperadas por módulo.",
            pages: 25,
          },
          {
            id: `${prefix}-s5-2`, moduloId: "1", tipo: "INTERACTIVO", orden: 2,
            titulo: "Mapa de Competencias del Ciclo",
            descripcion: "Tabla visual con los 6 módulos y sus competencias asociadas.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: `${prefix}-s6`,
        titulo: "1.6 — Herramientas para el Ciclo Escolar",
        colorAccent: "#6366F1",
        areaBadge: "PEDAGÓGICO",
        contenidos: [
          {
            id: `${prefix}-s6-1`, moduloId: "1", tipo: "INTERACTIVO", orden: 1,
            titulo: "Guía de IAs para el Taller",
            descripcion: "Grid de herramientas IA: Gemini, ChatGPT, Claude, Miro, Canva, Notion.",
            estimatedMinutes: 20,
          },
          {
            id: `${prefix}-s6-2`, moduloId: "1", tipo: "PDF", orden: 2,
            titulo: "Toolkit de Softwares EPT",
            descripcion: "Grid de softwares por área: Diseño 3D, Fabricación, Investigación, Office, Programación.",
            pages: 15,
          },
        ],
      },
      {
        id: `${prefix}-s7`,
        titulo: "1.7 — Quiz Integral",
        colorAccent: "#00C16A",
        areaBadge: "EVALUACIÓN",
        contenidos: [
          {
            id: `${prefix}-s7-1`, moduloId: "1", tipo: "QUIZ", orden: 1,
            titulo: "Evaluación Integral — Módulo 1",
            descripcion: "30 preguntas: ARQUITECTURA ×10 · TÉCNICO ×10 · PEDAGÓGICO ×10. Bloqueado hasta 80% de progreso.",
            questions: 30,
          },
        ],
      },
    ],
  };
}

// ═══════════════════════════════════════════
// MÓDULOS 2-6 — Estructura básica
// ═══════════════════════════════════════════

export function buildModulo2(tallerSlug: string): Modulo {
  const p = `${tallerSlug}-m2`;
  return {
    id: "2", nombre: "Zona de Investigación", descripcion: "Fichas técnicas, videos y práctica de la Zona de Investigación.", orden: 2, icon: "🔬",
    contenidos: [
      { id: `${p}-1`, moduloId: "2", tipo: "PDF", orden: 1, titulo: "Fichas Técnicas — Zona Investigación", descripcion: "Fichas de los bienes de Zona Investigación del taller.", pages: 20 },
      { id: `${p}-2`, moduloId: "2", tipo: "VIDEO", orden: 2, titulo: "Videos de Operatividad — Zona Investigación", descripcion: "Videos demostrativos de uso de equipos.", duracion: "20:00" },
      { id: `${p}-3`, moduloId: "2", tipo: "INTERACTIVO", orden: 3, titulo: "Explorador de Bienes — Investigación", descripcion: "Catálogo filtrado por Zona Investigación.", estimatedMinutes: 15 },
      { id: `${p}-4`, moduloId: "2", tipo: "QUIZ", orden: 4, titulo: "Evaluación Zona de Investigación", descripcion: "Preguntas sobre equipos e insumos de investigación.", questions: 15 },
      { id: `${p}-5`, moduloId: "2", tipo: "EN VIVO", orden: 5, titulo: "Práctica Supervisada — Zona Investigación", descripcion: "Sesión sincrónica de práctica guiada.", durationMinutes: 90, liveId: `live-${tallerSlug}-m2` },
    ],
  };
}

export function buildModulo3(tallerSlug: string): Modulo {
  const p = `${tallerSlug}-m3`;
  return {
    id: "3", nombre: "Zona de Innovación", descripcion: "Fichas técnicas, simuladores y práctica de la Zona de Innovación.", orden: 3, icon: "💡",
    contenidos: [
      { id: `${p}-1`, moduloId: "3", tipo: "PDF", orden: 1, titulo: "Fichas Técnicas — Zona Innovación", descripcion: "Fichas de los bienes de Zona Innovación.", pages: 20 },
      { id: `${p}-2`, moduloId: "3", tipo: "VIDEO", orden: 2, titulo: "Videos de Operatividad — Zona Innovación", descripcion: "Videos demostrativos de equipos de innovación.", duracion: "25:00" },
      { id: `${p}-3`, moduloId: "3", tipo: "INTERACTIVO", orden: 3, titulo: "Explorador de Bienes — Innovación", descripcion: "Catálogo filtrado por Zona Innovación.", estimatedMinutes: 15 },
      { id: `${p}-4`, moduloId: "3", tipo: "INTERACTIVO", orden: 4, titulo: "Fábrica de Prototipos — Simulador", descripcion: "Simulador de prototipado con herramientas del taller.", estimatedMinutes: 20 },
      { id: `${p}-5`, moduloId: "3", tipo: "QUIZ", orden: 5, titulo: "Evaluación Zona de Innovación", descripcion: "Preguntas sobre fabricación digital e innovación.", questions: 15 },
      { id: `${p}-6`, moduloId: "3", tipo: "EN VIVO", orden: 6, titulo: "Práctica Supervisada — Zona Innovación", descripcion: "Sesión sincrónica de práctica guiada.", durationMinutes: 90, liveId: `live-${tallerSlug}-m3` },
    ],
  };
}

export function buildModulo4(tallerSlug: string): Modulo {
  const p = `${tallerSlug}-m4`;
  return {
    id: "4", nombre: "Zona de Almacén", descripcion: "IPERC, gestión de almacén y seguridad.", orden: 4, icon: "🏪",
    contenidos: [
      { id: `${p}-1`, moduloId: "4", tipo: "PDF", orden: 1, titulo: "Fichas IPERC Estándar", descripcion: "Formato oficial de identificación de peligros.", pages: 8 },
      { id: `${p}-2`, moduloId: "4", tipo: "PDF", orden: 2, titulo: "Manual de Almacén y Depósito", descripcion: "Guía de gestión de almacén y EPP.", pages: 15 },
      { id: `${p}-3`, moduloId: "4", tipo: "VIDEO", orden: 3, titulo: "Gestión del Almacén y EPP", descripcion: "Video demostrativo del manejo correcto del almacén.", duracion: "18:00" },
      { id: `${p}-4`, moduloId: "4", tipo: "INTERACTIVO", orden: 4, titulo: "Mapa de Seguridad — Zona Almacén", descripcion: "Plano interactivo con señalética de seguridad.", estimatedMinutes: 10 },
      { id: `${p}-5`, moduloId: "4", tipo: "QUIZ", orden: 5, titulo: "Evaluación: IPERC y Almacén", descripcion: "Preguntas sobre seguridad y gestión de almacén.", questions: 20 },
      { id: `${p}-6`, moduloId: "4", tipo: "EN VIVO", orden: 6, titulo: "Práctica IPERC — Sesión Sincrónica", descripcion: "Aplicación práctica de IPERC en tiempo real.", durationMinutes: 60, liveId: `live-${tallerSlug}-m4` },
    ],
  };
}

export function buildModulo5(tallerSlug: string): Modulo {
  const p = `${tallerSlug}-m5`;
  return {
    id: "5", nombre: "Pedagogía y Planificación", descripcion: "Estrategias pedagógicas y herramientas para el ciclo escolar.", orden: 5, icon: "📋",
    contenidos: [
      { id: `${p}-1`, moduloId: "5", tipo: "PDF", orden: 1, titulo: "Guía de Planificación Curricular EPT", descripcion: "Alineación con competencias del CNEB.", pages: 25 },
      { id: `${p}-2`, moduloId: "5", tipo: "INTERACTIVO", orden: 2, titulo: "Design Thinking Simulator — 5 fases", descripcion: "Simulador interactivo de Design Thinking.", estimatedMinutes: 20 },
      { id: `${p}-3`, moduloId: "5", tipo: "INTERACTIVO", orden: 3, titulo: "Toolkit Pedagógico — IAs y Herramientas", descripcion: "Grid de herramientas IA y softwares para el docente.", estimatedMinutes: 15 },
      { id: `${p}-4`, moduloId: "5", tipo: "VIDEO", orden: 4, titulo: "Metodologías Activas para EPT", descripcion: "Sesión modelo con proyecto integrador.", duracion: "25:00" },
      { id: `${p}-5`, moduloId: "5", tipo: "QUIZ", orden: 5, titulo: "Evaluación: Pedagogía y Planificación", descripcion: "Preguntas sobre planificación y metodología.", questions: 20 },
      { id: `${p}-6`, moduloId: "5", tipo: "EN VIVO", orden: 6, titulo: "Sesión Pedagógica con Docente", descripcion: "Sesión sincrónica de planificación pedagógica.", durationMinutes: 90, liveId: `live-${tallerSlug}-m5` },
    ],
  };
}

export function buildModulo6(tallerSlug: string): Modulo {
  const p = `${tallerSlug}-m6`;
  return {
    id: "6", nombre: "Proyecto Final", descripcion: "Diseña y presenta un proyecto integrador usando los recursos del taller.", orden: 6, icon: "🚀",
    contenidos: [
      { id: `${p}-1`, moduloId: "6", tipo: "PDF", orden: 1, titulo: "Guía del Proyecto Integrador Final", descripcion: "Lineamientos y entregables del proyecto final.", pages: 30 },
      { id: `${p}-2`, moduloId: "6", tipo: "PDF", orden: 2, titulo: "Rúbrica de Evaluación del Proyecto", descripcion: "Criterios de evaluación detallados.", pages: 6 },
      { id: `${p}-3`, moduloId: "6", tipo: "VIDEO", orden: 3, titulo: "Ejemplos de Proyectos Anteriores", descripcion: "Proyectos destacados de ciclos anteriores.", duracion: "30:00" },
      { id: `${p}-4`, moduloId: "6", tipo: "INTERACTIVO", orden: 4, titulo: "Canvas de Proyecto — Design Thinking", descripcion: "Herramienta visual para planificar el proyecto integrador.", estimatedMinutes: 20 },
      { id: `${p}-5`, moduloId: "6", tipo: "EN VIVO", orden: 5, titulo: "Presentación de Proyecto Final", descripcion: "Sesión de presentación y retroalimentación.", durationMinutes: 120, liveId: `live-${tallerSlug}-m6` },
      { id: `${p}-6`, moduloId: "6", tipo: "QUIZ", orden: 6, titulo: "Evaluación Final Integradora", descripcion: "Evaluación que abarca todos los módulos. Bloqueado hasta completar módulos 1-5.", questions: 30 },
    ],
  };
}

// ═══════════════════════════════════════════
// BUILD ALL MODULES FOR A TALLER
// ═══════════════════════════════════════════

export function buildModulosForTaller(tallerSlug: string): Modulo[] {
  return [
    buildModulo1(tallerSlug),
    buildModulo2(tallerSlug),
    buildModulo3(tallerSlug),
    buildModulo4(tallerSlug),
    buildModulo5(tallerSlug),
    buildModulo6(tallerSlug),
  ];
}

export function getModuloByNumber(tallerSlug: string, num: number): Modulo | undefined {
  const modulos = buildModulosForTaller(tallerSlug);
  return modulos.find(m => m.orden === num);
}

export function getAllContenidoIds(tallerSlug: string): string[] {
  const modulos = buildModulosForTaller(tallerSlug);
  return modulos.flatMap(m => {
    const subIds = m.subSecciones?.flatMap(s => s.contenidos.map(c => c.id)) || [];
    const directIds = m.contenidos.map(c => c.id);
    return [...subIds, ...directIds];
  });
}

// ═══════════════════════════════════════════
// LIVE SESSIONS — Mock data per taller
// ═══════════════════════════════════════════

const docentesPorTaller: Record<string, string> = {
  "mecanica-automotriz": "Ing. Carlos Huamán",
  "industria-vestido": "Prof. Ana Quispe",
  "cocina-reposteria": "Chef José Paredes",
  "ebanisteria": "Mtro. Luis Tapia",
  "computacion-informatica": "Ing. Rosa Mendoza",
  "electronica": "Ing. Pedro Salazar",
  "industria-alimentaria": "Ing. María Flores",
  "electricidad": "Ing. Juan Rojas",
  "construcciones-metalicas": "Ing. Roberto Castillo",
};

export function getLiveSessionsForTaller(tallerSlug: string): LiveSession[] {
  const docente = docentesPorTaller[tallerSlug] || "Prof. Docente";
  return [
    {
      id: `live-${tallerSlug}-arq`,
      moduloId: "1",
      titulo: "Introducción Arquitectónica del Taller",
      docente: `Arq. ${docente.split(" ").slice(1).join(" ")}`,
      status: "scheduled",
      scheduledAt: new Date("2026-03-15T15:00:00"),
      durationMinutes: 60,
      participants: 0,
      vimeoId: null,
      agenda: [
        { tiempo: "15 min", tema: "Carga eléctrica y sanitaria" },
        { tiempo: "20 min", tema: "Salidas de emergencia y señalética" },
        { tiempo: "15 min", tema: "Normativas de espacio EPT" },
        { tiempo: "10 min", tema: "Preguntas y cierre" },
      ],
      materialesPrevios: [],
    },
    {
      id: `live-${tallerSlug}-m2`,
      moduloId: "2",
      titulo: "Práctica Supervisada — Zona Investigación",
      docente,
      status: "scheduled",
      scheduledAt: new Date("2026-03-22T15:00:00"),
      durationMinutes: 90,
      participants: 0,
      vimeoId: null,
      agenda: [
        { tiempo: "15 min", tema: "Repaso teórico de la zona" },
        { tiempo: "30 min", tema: "Demostración de equipos" },
        { tiempo: "30 min", tema: "Práctica guiada" },
        { tiempo: "15 min", tema: "Preguntas y cierre" },
      ],
      materialesPrevios: [],
    },
  ];
}

export function getActiveLiveSession(tallerSlug: string): LiveSession | undefined {
  return getLiveSessionsForTaller(tallerSlug).find(s => s.status === "active");
}

export function getUpcomingLiveSession(tallerSlug: string): LiveSession | undefined {
  return getLiveSessionsForTaller(tallerSlug).find(s => s.status === "scheduled");
}

export function getLiveSession(tallerSlug: string, liveId: string): LiveSession | undefined {
  return getLiveSessionsForTaller(tallerSlug).find(s => s.id === liveId);
}
