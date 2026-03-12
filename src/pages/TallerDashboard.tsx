// ─────────────────────────────────────────────────────────────────────────────
// tallerDashboardData.ts
// Datos independientes por taller para TallerDashboard.tsx
// Importar con: import { getTallerDashboardData } from "@/data/tallerDashboardData";
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryZone {
  icon: string;
  name: string;
  desc: string;
  count: number;
}

export interface SesionCard {
  status: "active" | "scheduled" | "recorded";
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface PerfilEgreso {
  icon: string;
  text: string;
}

export interface Curiosidad {
  icon: string;
  title: string;
  text: string;
}

export interface TallerDashboardData {
  /** Emoji o símbolo para el hero visual */
  heroIcon: string;
  /** Texto del placeholder de imagen */
  heroImageCaption: string;
  /** Color del acento del taller (para stripe, dot, botón quiz) */
  tallerAccent: string;
  /** Tercera línea del h1 en el hero */
  heroSubtitle: string;
  /** Texto introductorio de la sección "Sobre este espacio" */
  presentacion: string;
  /** Nivel de egreso (CNOF) */
  nivelEgreso: string;
  /** Total de horas de formación */
  horasFormacion: string;
  /** Perfil de egreso — 3 competencias clave (para el card de perfil) */
  perfilEgreso: PerfilEgreso[];
  /** 5 unidades de competencia reales del programa MINEDU */
  unidadesCompetencia: string[];
  /** Zonas del inventario físico */
  inventoryZones: InventoryZone[];
  /** 4 sesiones en vivo */
  sesiones: SesionCard[];
  /** 3 curiosidades / datos del sector */
  curiosidades: Curiosidad[];
  /** Título de la card del quiz */
  quizTitle: string;
  /** Descripción de la card del quiz */
  quizDesc: string;
  /** Color del botón del quiz */
  quizBtnBg: string;
}

// ─── Helper de sesión ─────────────────────────────────────────────────────────
const sesionActiva  = (title: string, desc: string, tags: string[]): SesionCard => ({ status: "active",    badge: "🔴 En vivo", badgeBg: "rgba(239,68,68,0.15)",    badgeBorder: "rgba(239,68,68,0.3)",    badgeColor: "#f87171", title, desc, tags });
const sesionProxima = (title: string, desc: string, tags: string[]): SesionCard => ({ status: "scheduled", badge: "🟡 Próxima",  badgeBg: "rgba(249,115,22,0.15)",   badgeBorder: "rgba(249,115,22,0.3)",   badgeColor: "#fdba74", title, desc, tags });
const sesionGrabada = (title: string, desc: string, tags: string[]): SesionCard => ({ status: "recorded",  badge: "⚪ Grabada",  badgeBg: "rgba(100,116,139,0.15)",  badgeBorder: "rgba(100,116,139,0.3)",  badgeColor: "#94a3b8", title, desc, tags });

// ─────────────────────────────────────────────────────────────────────────────
// DATA POR TALLER
// ─────────────────────────────────────────────────────────────────────────────

const DATA: Record<string, TallerDashboardData> = {

  // ── T1: MECÁNICA AUTOMOTRIZ ─────────────────────────────────────────────────
  "mecanica-automotriz": {
    heroIcon: "🔧",
    heroImageCaption: "Foto del taller en acción",
    tallerAccent: "#F97316",
    heroSubtitle: "en Acción",
    presentacion: "Este es tu espacio como docente: un entorno diseñado para que puedas planificar, enseñar y evaluar con todos los recursos del taller automotriz al alcance. Desde fichas técnicas hasta proyectos de estudiantes — todo en un solo lugar.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🔧", text: "Mantenimiento preventivo: ruedas, chasis, fluidos y sistemas eléctricos básicos" },
      { icon: "⚙️", text: "Sistemas de control: dirección, suspensión, frenos convencionales y con asistencia ABS" },
      { icon: "🚗", text: "Diagnóstico con escáner, vehículos híbridos/eléctricos y gestión de motores Otto y Diésel" },
    ],
    unidadesCompetencia: [
      "Mantenimiento preventivo: ruedas, chasis, fluidos y sistemas eléctricos básicos",
      "Sistemas de control: dirección, suspensión y frenos (convencionales y con asistencia electrónica/ABS)",
      "Tren motriz: transmisión de potencia, cajas manuales/automáticas, diferenciales y ejes",
      "Electrónica y Confort: diagnóstico con escáner, climatización y mantenimiento de vehículos híbridos/eléctricos",
      "Motores: gestión de motores Otto y Diésel, inyección electrónica y control de emisiones",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación, Gestión y Diseño", desc: "Cámaras, grabadoras, equipos de documentación y gestión de proyectos", count: 52 },
      { icon: "⚙️", name: "Área de Mecánica", desc: "Elevadores hidráulicos, compresoras, bancos de trabajo y equipos de servicio", count: 11 },
      { icon: "🧰", name: "Depósito / Almacén", desc: "Gatos hidráulicos, juego de llaves, extractores, herramientas de mano y kits", count: 76 },
      { icon: "🖥️", name: "Área de Simulación", desc: "Módulos educativos: suspensión/frenos ABS, transmisión, sistema eléctrico y motor V8", count: 14 },
    ],
    sesiones: [
      sesionActiva(  "Diagnóstico OBD2 en tiempo real",         "Demostración práctica de lectura de códigos de falla con escáner profesional. Incluye resolución de dudas.",                                  ["Hoy 6:00 PM", "Nivel Básico", "+42 inscritos"]),
      sesionProxima( "Sistemas de frenos ABS: teoría y práctica","Exploraremos el funcionamiento del sistema ABS y su mantenimiento correctivo con vehículos del taller.",                                     ["Jue 26 — 7:00 PM", "Nivel Intermedio"]),
      sesionProxima( "Vehículos eléctricos: introducción docente","Sesión especial para docentes sobre cómo incorporar vehículos eléctricos en el currículo técnico.",                                          ["Sáb 28 — 10:00 AM", "Docentes"]),
      sesionGrabada( "Mantenimiento preventivo del motor",        "Sesión grabada: procedimientos completos de mantenimiento de los 10,000 km. Disponible en el repositorio.",                                   ["Grabada", "1h 20min", "+180 vistas"]),
    ],
    curiosidades: [
      { icon: "⚡", title: "El futuro es eléctrico",   text: "Para 2035, más del 40% de los vehículos nuevos en Latinoamérica serán eléctricos o híbridos. ¿Está tu taller preparado?" },
      { icon: "🛠️", title: "Más de 30,000 piezas",    text: "Un automóvil moderno tiene más de 30,000 piezas individuales. La mecánica automotriz es una de las especialidades técnicas más complejas." },
      { icon: "📡", title: "Diagnóstico digital",      text: "Los autos modernos tienen más de 100 sensores. El diagnóstico computarizado es la habilidad más demandada del sector." },
    ],
    quizTitle: "Mini Quiz Automotriz",
    quizDesc: "Pon a prueba tus conocimientos con curiosidades del sector. ¡Ideal para motivar a tus estudiantes al inicio de clase!",
    quizBtnBg: "#F97316",
  },

  // ── T2: INDUSTRIA DEL VESTIDO ───────────────────────────────────────────────
  "industria-vestido": {
    heroIcon: "✂️",
    heroImageCaption: "Foto del taller de confección",
    tallerAccent: "#ec4899",
    heroSubtitle: "con Estilo",
    presentacion: "Tu espacio como docente de confección: recursos para planificar sesiones de patronaje, costura industrial y diseño de moda. Todo lo que necesitas para transformar el aprendizaje técnico en creación real.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "✂️", text: "Costura industrial: operatividad de máquinas recta, remalladora y recubridora" },
      { icon: "👗", text: "Confección de camisas, pantalones, polos y ropa deportiva en tejido plano y de punto" },
      { icon: "🎨", text: "Diseño de modas: gestión de colecciones, escalado industrial y costos de producción" },
    ],
    unidadesCompetencia: [
      "Costura Industrial: operatividad de máquinas (recta, remalladora, recubridora)",
      "Prendas de Vestir: confección de camisas, pantalones y faldas en tejido plano",
      "Tejido de Punto: patronaje y confección de polos, poleras y ropa deportiva",
      "Sastrería: elaboración de sacos, abrigos y técnicas de alta costura",
      "Diseño de Modas: gestión de colecciones, escalado industrial y costos de producción",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación, Gestión y Diseño", desc: "Maniquís, mesas de diseño, equipos de fotografía y documentación de patrones", count: 48 },
      { icon: "🧵", name: "Área de Confección Industrial", desc: "Máquinas de coser industriales, recubridoras, ojaladoras y plancha industrial", count: 22 },
      { icon: "🧰", name: "Depósito / Almacén de Insumos", desc: "Telas, hilos, agujas, cierres, botones, entretelas y materiales de acabado", count: 65 },
      { icon: "📐", name: "Área de Patronaje y Corte", desc: "Mesas de corte, reglas de patronaje, trazo digital y planimetría textil", count: 18 },
    ],
    sesiones: [
      sesionActiva(  "Patronaje básico: blusa clásica paso a paso",     "Demostración en vivo de cómo trazar y escalar un patrón base de blusa. Incluye tips para adaptar a tallaje real.",            ["Hoy 5:00 PM", "Nivel Básico", "+38 inscritas"]),
      sesionProxima( "Costura industrial: pespunte y acabados finos",    "Aprenderemos las principales costuras industriales y cómo lograr acabados de calidad exportación en tus clases.",            ["Mié 25 — 6:00 PM", "Nivel Intermedio"]),
      sesionProxima( "Diseño de colección para educación técnica",        "Sesión pedagógica: cómo guiar a tus estudiantes en la creación de una mini-colección de 3 prendas coordinadas.",              ["Sáb 28 — 9:00 AM", "Docentes"]),
      sesionGrabada( "Trazado de molde de pantalón base",                 "Sesión grabada completa. Construcción del molde base de pantalón adulto con variaciones de tiro.",                              ["Grabada", "1h 10min", "+155 vistas"]),
    ],
    curiosidades: [
      { icon: "🌍", title: "La industria del fast fashion", text: "La industria textil es la segunda más contaminante del mundo. Enseñar confección responsable prepara para el futuro." },
      { icon: "🤖", title: "Moda + tecnología",             text: "Las impresoras 3D ya producen telas y accesorios. El técnico del futuro combinará costura con diseño digital." },
      { icon: "📈", title: "Mercado en crecimiento",        text: "El mercado de moda en Perú mueve más de S/ 3,000 millones al año. Un técnico calificado tiene alta empleabilidad." },
    ],
    quizTitle: "Quiz de Moda y Confección",
    quizDesc: "¿Conoces los tipos de tela, las costuras y el patronaje? Pon a prueba tus saberes y compártelos con tus estudiantes.",
    quizBtnBg: "#ec4899",
  },

  // ── T3: COCINA Y REPOSTERÍA ─────────────────────────────────────────────────
  "cocina-reposteria": {
    heroIcon: "👨‍🍳",
    heroImageCaption: "Foto del taller de cocina",
    tallerAccent: "#f97316",
    heroSubtitle: "al Fuego",
    presentacion: "Tu espacio como docente de gastronomía: planificaciones, fichas técnicas de recetas, guías de higiene alimentaria y proyectos culinarios para que tus estudiantes desarrollen competencias de nivel profesional.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🍳", text: "Culinaria básica: técnicas de corte (mise en place), fondos, salsas y cocciones" },
      { icon: "🎂", text: "Panadería y pastelería: masas fermentadas, decoración de tortas y postres comerciales" },
      { icon: "🍽️", text: "Alta cocina y gestión gastronómica: costeo de recetas, bar, coctelería y servicio al cliente" },
    ],
    unidadesCompetencia: [
      "Culinaria Básica: técnicas de corte (mise en place), fondos, salsas y cocciones iniciales",
      "Panadería y Pastelería: masas fermentadas, decoración de tortas y postres comerciales",
      "Cocina Regional: platos típicos peruanos y gestión de insumos locales",
      "Alta Cocina: menús internacionales, buffet y catering para eventos",
      "Gestión Gastronómica: costeo de recetas, bar, coctelería y servicio al cliente",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Diseño Gastronómico", desc: "Equipos de fotografía culinaria, libros técnicos, balanzas de precisión y área de mise en place", count: 35 },
      { icon: "🍳", name: "Área de Cocina Caliente y Fría", desc: "Cocinas industriales, hornos de convección, freidoras, baño maría y equipos de refrigeración", count: 28 },
      { icon: "🧁", name: "Área de Repostería y Panadería", desc: "Amasadoras, batidoras industriales, hornos pasteleros, moldes y utensilios de decoración", count: 42 },
      { icon: "🧰", name: "Depósito / Almacén de Insumos", desc: "Vajilla, utensilios de cocina, equipos de seguridad e insumos básicos de almacén", count: 58 },
    ],
    sesiones: [
      sesionActiva(  "Técnica del roux y salsas madres en vivo",        "Demostración en tiempo real: preparación de bechamel, velouté y española. Fundamentos para cualquier curso de cocina.",   ["Hoy 4:00 PM", "Nivel Básico", "+45 inscritos"]),
      sesionProxima( "Repostería peruana: picarones y alfajores",         "Elaboración paso a paso de dos íconos de la dulcería peruana. Técnica, historia y posibilidades de negocio.",              ["Jue 26 — 5:00 PM", "Nivel Intermedio"]),
      sesionProxima( "Gestión de costos y carta para el taller",          "Sesión docente: cómo enseñar a tus estudiantes a costear recetas y diseñar cartas reales de restaurante.",                  ["Vie 27 — 7:00 PM", "Docentes"]),
      sesionGrabada( "Masas laminadas: hojaldre y croissant",             "Sesión grabada completa de técnica de laminado. Perfecta para repasar con tus estudiantes antes de la práctica.",          ["Grabada", "1h 35min", "+210 vistas"]),
    ],
    curiosidades: [
      { icon: "🌮", title: "Gastronomía peruana, patrimonio mundial", text: "Perú tiene 3 restaurantes entre los 50 mejores del mundo. La cocina peruana es la más premiada de América Latina." },
      { icon: "🤖", title: "IA en la cocina",                         text: "Los chefs modernos usan IA para crear recetas, controlar inventarios y predecir demanda. El técnico del futuro es también digital." },
      { icon: "💰", title: "Sector en expansión",                      text: "La gastronomía representa el 3.8% del PBI peruano. Un técnico calificado puede emplearse o emprender en un sector de alta demanda." },
    ],
    quizTitle: "Quiz de Cocina y Sabores",
    quizDesc: "Ingredientes, técnicas y recetas icónicas. Pon a prueba tus conocimientos y genera curiosidad en tus estudiantes.",
    quizBtnBg: "#f97316",
  },

  // ── T4: EBANISTERÍA ─────────────────────────────────────────────────────────
  "ebanisteria": {
    heroIcon: "🪵",
    heroImageCaption: "Foto del taller de madera",
    tallerAccent: "#b45309",
    heroSubtitle: "con Madera",
    presentacion: "Tu espacio como docente de ebanistería: recursos para enseñar diseño de muebles, técnicas de ensamble, acabados y emprendimiento en carpintería fina. Del boceto al producto terminado.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🪵", text: "Carpintería básica y mueblería: diseño y fabricación de mesas, sillas y estantes para el hogar" },
      { icon: "🔨", text: "Técnicas artísticas: torneado, tallado ornamental y marquetería en maderas nobles" },
      { icon: "🖥️", text: "Acabados y diseño avanzado: barnices, lacas, tapicería y software CAD para producción seriada" },
    ],
    unidadesCompetencia: [
      "Carpintería Básica: tecnología de la madera y construcción de estructuras simples",
      "Mueblería: diseño y fabricación de muebles para el hogar (mesas, sillas, estantes)",
      "Técnicas Artísticas: torneado de madera, tallado ornamental y marquetería",
      "Acabados: aplicación de barnices, lacas, poliuretano y técnicas de tapicería",
      "Diseño Avanzado: uso de software CAD para muebles y producción industrial seriada",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación, Diseño y Medición", desc: "Mesas de dibujo técnico, calibradores, escuadras y equipos de medición de humedad de madera", count: 40 },
      { icon: "🪚", name: "Área de Máquinas y Herramientas", desc: "Sierra circular, cepilladora, lijadora de banda, taladro de banco, torno y caladora", count: 18 },
      { icon: "🧰", name: "Depósito / Almacén de Maderas e Insumos", desc: "Maderas macizas, tableros MDF/MDP, pegamentos, clavos, bisagras y ferretería en general", count: 72 },
      { icon: "🖌️", name: "Área de Acabados y Pintura", desc: "Pistolas de pintura, esponjas, lijas, selladores, barnices y cámara de secado", count: 22 },
    ],
    sesiones: [
      sesionActiva(  "Ensamble de mortaja y espiga en vivo",            "Demostración del ensamble más resistente en carpintería. Técnica, herramientas y errores comunes en clase.",              ["Hoy 5:30 PM", "Nivel Básico", "+29 inscritos"]),
      sesionProxima( "Acabados con barniz y laca: técnica y práctica",   "Aprenderemos a preparar superficies y aplicar acabados profesionales en diferentes tipos de madera.",                     ["Jue 26 — 6:00 PM", "Nivel Intermedio"]),
      sesionProxima( "Diseño de mueble con SketchUp Free para docentes", "Sesión pedagógica: cómo incorporar el diseño digital 3D en el taller de ebanistería sin costo.",                          ["Sáb 28 — 10:00 AM", "Docentes"]),
      sesionGrabada( "Torno de madera: técnica básica de torneado",      "Sesión grabada: postura, velocidad y herramientas de corte para tornear piezas cilíndricas.",                              ["Grabada", "58 min", "+128 vistas"]),
    ],
    curiosidades: [
      { icon: "🌳", title: "Madera: el material milenario",  text: "Los muebles de madera bien conservados pueden durar más de 200 años. Enseñar ebanistería es transmitir un oficio con historia." },
      { icon: "🤖", title: "CNC y carpintería digital",      text: "Las máquinas CNC ya cortan y tallan madera con precisión milimétrica. El ebanista moderno combina artesanía con tecnología." },
      { icon: "💡", title: "Madera en la arquitectura",     text: "Las construcciones en madera son hasta 30% más rápidas de edificar y tienen huella de carbono negativa. El futuro construye con madera." },
    ],
    quizTitle: "Quiz de Ebanistería y Madera",
    quizDesc: "Tipos de madera, ensambles y acabados. ¡Demuestra tu conocimiento y desafía a tus estudiantes!",
    quizBtnBg: "#b45309",
  },

  // ── T5: COMPUTACIÓN E INFORMÁTICA ───────────────────────────────────────────
  "computacion-informatica": {
    heroIcon: "💻",
    heroImageCaption: "Foto del laboratorio de cómputo",
    tallerAccent: "#0891b2",
    heroSubtitle: "en Red",
    presentacion: "Tu espacio como docente de informática: guías, proyectos y recursos para enseñar programación, ofimática, redes y soporte técnico. Forma ciudadanos digitales con competencias para el siglo XXI.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "💻", text: "Soporte técnico: arquitectura de computadoras, instalación de software y mantenimiento preventivo" },
      { icon: "🌐", text: "Conectividad y diseño digital: redes LAN, edición multimedia y programación de aplicaciones" },
      { icon: "📱", text: "Sistemas Web: diseño UX/UI, bases de datos relacionales y despliegue web" },
    ],
    unidadesCompetencia: [
      "Soporte Técnico: arquitectura de computadoras, instalación de software y mantenimiento preventivo",
      "Conectividad: diseño e instalación de redes LAN (cableado estructurado y configuración inalámbrica)",
      "Diseño Digital: creación de piezas gráficas, pre-prensa y edición multimedia",
      "Programación: desarrollo de lógica de programación y creación de aplicaciones de escritorio/móviles",
      "Sistemas Web: diseño de interfaces UX/UI, gestión de bases de datos relacionales y despliegue web",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Documentación", desc: "Estaciones de trabajo para investigación, diseño y documentación de proyectos digitales", count: 30 },
      { icon: "🖥️", name: "Laboratorio de Cómputo", desc: "Computadoras de escritorio, laptops, proyectores, pizarras digitales y equipos de conectividad", count: 35 },
      { icon: "🔌", name: "Área de Hardware y Redes", desc: "Componentes internos, kits de ensamblaje, switches, routers y cableado estructurado", count: 48 },
      { icon: "🧰", name: "Depósito / Almacén de Insumos", desc: "Cables, memorias USB, herramientas de diagnóstico y periféricos de repuesto", count: 40 },
    ],
    sesiones: [
      sesionActiva(  "Programación con Python: variables y bucles en vivo", "Sesión introductoria en vivo. Escribimos código desde cero. Ideal para docentes que quieren incorporar programación.",  ["Hoy 6:00 PM", "Nivel Básico", "+52 inscritos"]),
      sesionProxima( "Redes Wi-Fi: configuración básica para el aula",       "Aprenderemos a configurar routers, asignar IPs y resolver problemas de conectividad comunes en el taller.",           ["Jue 26 — 7:00 PM", "Nivel Intermedio"]),
      sesionProxima( "IA generativa en educación técnica",                    "Sesión para docentes: cómo usar ChatGPT, Gemini y Copilot como herramientas pedagógicas en clase.",                   ["Sáb 28 — 9:00 AM", "Docentes"]),
      sesionGrabada( "Ensamblaje de PC paso a paso",                          "Sesión grabada completa: desde abrir el gabinete hasta instalar Windows. Perfecta para repasar con estudiantes.",     ["Grabada", "1h 45min", "+320 vistas"]),
    ],
    curiosidades: [
      { icon: "🤖", title: "La IA ya está en el aula",      text: "El 65% de los trabajos que existirán en 2035 aún no existen. Enseñar pensamiento computacional prepara para lo desconocido." },
      { icon: "🌐", title: "Conectividad como derecho",     text: "En Perú, solo el 52% de hogares tiene internet. Formar técnicos en redes es clave para la inclusión digital del país." },
      { icon: "💼", title: "Empleabilidad garantizada",    text: "El sector TI crece 12% anual en Perú. Un técnico en informática tiene las tasas de empleabilidad más altas entre los egresados técnicos." },
    ],
    quizTitle: "Quiz de Informática y Redes",
    quizDesc: "Hardware, software, redes y programación. ¡Pon a prueba tus conocimientos digitales!",
    quizBtnBg: "#0891b2",
  },

  // ── T6: ELECTRÓNICA ─────────────────────────────────────────────────────────
  "electronica": {
    heroIcon: "⚡",
    heroImageCaption: "Foto del laboratorio de electrónica",
    tallerAccent: "#2563eb",
    heroSubtitle: "en Circuito",
    presentacion: "Tu espacio como docente de electrónica: recursos para enseñar circuitos, automatización y microcontroladores. Forma técnicos que entienden y construyen la tecnología del presente.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "⚡", text: "Electrónica analógica y digital: componentes pasivos, semiconductores y compuertas lógicas" },
      { icon: "🤖", text: "Sistemas embebidos: programación de placas Arduino/Raspberry y sensores inteligentes" },
      { icon: "📡", text: "Telecomunicaciones, robótica e IoT: sistemas autónomos y conectividad industrial" },
    ],
    unidadesCompetencia: [
      "Analógica: componentes pasivos, semiconductores (diodos, transistores) y fuentes de poder",
      "Digital: compuertas lógicas, microcontroladores y sistemas de visualización",
      "Sistemas Embebidos: programación de placas (Arduino/Raspberry) y sensores inteligentes",
      "Telecomunicaciones: mantenimiento de equipos de audio, video y sistemas de transmisión",
      "Robótica e IoT: diseño de sistemas autónomos y conectividad industrial (Internet de las Cosas)",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Diseño de Circuitos", desc: "Osciloscopios, generadores de señal, computadoras para simulación y protoboards de diseño", count: 38 },
      { icon: "⚡", name: "Área de Electrónica Analógica y Digital", desc: "Fuentes de alimentación, multímetros, estaciones de soldadura y componentes electrónicos", count: 45 },
      { icon: "🤖", name: "Área de Automatización y Microcontroladores", desc: "Kits Arduino, sensores, motores, módulos Wi-Fi y pantallas para proyectos de automatización", count: 32 },
      { icon: "🧰", name: "Depósito / Almacén de Componentes", desc: "Resistencias, capacitores, transistores, integrados, cables y materiales de montaje", count: 85 },
    ],
    sesiones: [
      sesionActiva(  "Circuito RC: carga y descarga en el osciloscopio",  "Demostración en vivo de comportamiento de circuitos RC con osciloscopio. Fundamentos de electrónica analógica.",       ["Hoy 6:00 PM", "Nivel Básico", "+33 inscritos"]),
      sesionProxima( "Arduino: control de servomotores con código",         "Aprenderemos a programar Arduino UNO para controlar la posición de servomotores. Proyecto aplicado.",                    ["Mié 25 — 7:00 PM", "Nivel Intermedio"]),
      sesionProxima( "Domótica básica para el aula: luces y sensores",      "Sesión para docentes: cómo montar un sistema domótico simple como proyecto integrador con tus estudiantes.",            ["Sáb 28 — 9:00 AM", "Docentes"]),
      sesionGrabada( "Soldadura SMD: técnica y herramientas",               "Sesión grabada de soldadura de componentes de montaje superficial. Técnica profesional adaptada al aula-taller.",       ["Grabada", "1h 05min", "+145 vistas"]),
    ],
    curiosidades: [
      { icon: "🌐", title: "El Internet de las Cosas",    text: "Para 2030 habrá más de 25,000 millones de dispositivos conectados. Los electrónicos son los técnicos que los construyen y reparan." },
      { icon: "🚗", title: "Electrónica en los autos",   text: "Un automóvil moderno tiene más de 150 circuitos electrónicos. La electrónica y la mecánica convergen en el técnico del futuro." },
      { icon: "💡", title: "Inventores a edad temprana", text: "Philo Farnsworth inventó la televisión a los 21 años. La electrónica es la especialidad de los que quieren cambiar el mundo." },
    ],
    quizTitle: "Quiz de Electrónica y Circuitos",
    quizDesc: "Componentes, leyes de Ohm y microcontroladores. ¿Cuánto sabes de electrónica? ¡Desafía a tus estudiantes!",
    quizBtnBg: "#2563eb",
  },

  // ── T7: INDUSTRIA ALIMENTARIA ───────────────────────────────────────────────
  "industria-alimentaria": {
    heroIcon: "🏭",
    heroImageCaption: "Foto de la planta de procesamiento",
    tallerAccent: "#ca8a04",
    heroSubtitle: "con Inocuidad",
    presentacion: "Tu espacio como docente de industria alimentaria: recursos para enseñar procesamiento, conservación y control de calidad de alimentos con estándares de inocuidad y buenas prácticas de manufactura.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🏭", text: "Inocuidad: aplicación de normas HACCP, BPM y procesamiento de frutas, hortalizas y lácteos" },
      { icon: "🥩", text: "Procesamiento de cárnicos, embutidos y productos de panificación con granos andinos" },
      { icon: "🔬", text: "Control de calidad: análisis bromatológico, sensorial y gestión de bebidas" },
    ],
    unidadesCompetencia: [
      "Inocuidad: aplicación de normas HACCP, BPM y procesamiento de frutas/hortalizas",
      "Lácteos: elaboración de quesos, yogures y derivados bajo estándares sanitarios",
      "Cárnicos: procesamiento de embutidos, cortes industriales y conservación de carnes",
      "Panificación: elaboración de productos de panadería, cereales y granos andinos",
      "Control de Calidad: análisis bromatológico, sensorial y gestión de bebidas alcohólicas/no alcohólicas",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Control de Calidad", desc: "Laboratorio de análisis sensorial, balanzas analíticas, pH-metros y equipos de control", count: 42 },
      { icon: "🏭", name: "Área de Procesamiento de Alimentos", desc: "Marmitas, pasteurizadoras, deshidratadoras, envasadoras al vacío y mezcladoras industriales", count: 25 },
      { icon: "❄️", name: "Área de Frío y Conservación", desc: "Cámaras frigoríficas, congeladores industriales, abatidores de temperatura y equipos de cadena de frío", count: 18 },
      { icon: "🧰", name: "Depósito / Almacén de Insumos y EPP", desc: "Insumos de procesamiento, envases, etiquetas, equipos de protección personal y materiales de higiene", count: 55 },
    ],
    sesiones: [
      sesionActiva(  "BPM en la planta: recorrido práctico en vivo",      "Recorrido en tiempo real por las áreas de la planta aplicando Buenas Prácticas de Manufactura. Checklist incluido.",  ["Hoy 5:00 PM", "Nivel Básico", "+27 inscritos"]),
      sesionProxima( "Conservas al vacío: técnica y normativa",            "Aprenderemos el proceso completo de envasado al vacío, esterilización y etiquetado según normas peruanas.",            ["Mié 25 — 6:00 PM", "Nivel Intermedio"]),
      sesionProxima( "HACCP para docentes: diseño del plan en el aula",    "Sesión docente: cómo enseñar a tus estudiantes a diseñar un plan HACCP para un producto real.",                        ["Vie 27 — 7:00 PM", "Docentes"]),
      sesionGrabada( "Fermentación: yogurt y productos lácteos",           "Sesión grabada completa del proceso de elaboración de yogurt desde la leche pasteurizada.",                             ["Grabada", "1h 25min", "+198 vistas"]),
    ],
    curiosidades: [
      { icon: "🌱", title: "Perú, despensa del mundo",         text: "Perú exporta más de 400 productos agroindustriales. La industria alimentaria es uno de los sectores de mayor crecimiento." },
      { icon: "🔬", title: "Ciencia en cada bocado",           text: "El control de calidad alimentario usa microbiología, química y física. Es una de las especialidades técnicas más científicas." },
      { icon: "🏢", title: "Alta empleabilidad",               text: "Las empresas de alimentos son las que más empleo formal generan en el Perú. Un técnico en inocuidad siempre tiene trabajo." },
    ],
    quizTitle: "Quiz de Industria Alimentaria",
    quizDesc: "BPM, HACCP, conservación y procesamiento. ¡Demuestra tus saberes técnicos del sector alimentario!",
    quizBtnBg: "#ca8a04",
  },

  // ── T8: ELECTRICIDAD ────────────────────────────────────────────────────────
  "electricidad": {
    heroIcon: "🔌",
    heroImageCaption: "Foto del taller de instalaciones eléctricas",
    tallerAccent: "#eab308",
    heroSubtitle: "con Voltaje",
    presentacion: "Tu espacio como docente de electricidad: recursos para enseñar instalaciones eléctricas residenciales e industriales, tableros de distribución y normativa de seguridad eléctrica vigente.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🔌", text: "Circuitos e instalaciones residenciales: cableado, tableros de distribución y protecciones" },
      { icon: "⚡", text: "Máquinas eléctricas: mantenimiento de motores, transformadores y generadores" },
      { icon: "☀️", text: "Energías limpias y control industrial: sistemas fotovoltaicos y automatización con PLC" },
    ],
    unidadesCompetencia: [
      "Circuitos: montaje de circuitos eléctricos básicos y medición de magnitudes",
      "Instalaciones Residenciales: cableado, tableros de distribución y sistemas de protección",
      "Máquinas Eléctricas: mantenimiento de motores, transformadores y generadores",
      "Energías Limpias: instalación de sistemas solares fotovoltaicos y redes de baja tensión",
      "Control Industrial: automatización mediante contactores y lógica programable (PLC)",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Diseño Eléctrico", desc: "Software de simulación eléctrica, planos, computadoras y equipos de medición de parámetros", count: 35 },
      { icon: "🔌", name: "Área de Instalaciones y Tableros", desc: "Paneles de práctica, tableros monofásicos y trifásicos, interruptores termomagnéticos y diferencial", count: 30 },
      { icon: "🛠️", name: "Área de Herramientas y Medición", desc: "Multímetros, pinzas amperimétricas, detectores de tensión, taladros y herramientas aisladas", count: 48 },
      { icon: "🧰", name: "Depósito / Almacén de Materiales", desc: "Cables de diferentes secciones, conduit, cajas de paso, conectores, EPP dieléctrico y materiales de instalación", count: 70 },
    ],
    sesiones: [
      sesionActiva(  "Instalación de tomacorrientes e interruptores en vivo", "Montaje en tiempo real de un circuito básico residencial con derivaciones y protecciones.",                           ["Hoy 5:00 PM", "Nivel Básico", "+36 inscritos"]),
      sesionProxima( "Tableros de distribución: montaje y protecciones",       "Aprenderemos a dimensionar y montar un tablero monofásico con interruptores termomagnéticos y diferencial.",          ["Jue 26 — 6:30 PM", "Nivel Intermedio"]),
      sesionProxima( "CNE y normativa eléctrica para el aula",                  "Sesión docente: cómo enseñar el Código Nacional de Electricidad de forma práctica y aplicada.",                       ["Sáb 28 — 9:00 AM", "Docentes"]),
      sesionGrabada( "Puesta a tierra: diseño e instalación",                   "Sesión grabada: fundamentos, cálculo de resistencia del electrodo y proceso de instalación completo.",               ["Grabada", "1h 15min", "+162 vistas"]),
    ],
    curiosidades: [
      { icon: "🌞", title: "La energía solar llega al Perú",  text: "El Perú tiene uno de los mayores índices de radiación solar del mundo. Los electricistas del futuro instalan paneles fotovoltaicos." },
      { icon: "🏘️", title: "Millones sin electricidad",       text: "Más de 1.5 millones de peruanos aún no tienen acceso a electricidad. Los técnicos electricistas son clave para la electrificación rural." },
      { icon: "💡", title: "Eficiencia energética",           text: "Cambiar a LED y automatizar el hogar puede reducir el consumo eléctrico en un 70%. El electricista moderno también es asesor de ahorro." },
    ],
    quizTitle: "Quiz de Electricidad e Instalaciones",
    quizDesc: "Circuitos, tableros, normativa y seguridad eléctrica. ¡Pon a prueba tus conocimientos del voltaje!",
    quizBtnBg: "#eab308",
  },

  // ── T9: CONSTRUCCIONES METÁLICAS ────────────────────────────────────────────
  "construcciones-metalicas": {
    heroIcon: "🔩",
    heroImageCaption: "Foto del taller de soldadura",
    tallerAccent: "#dc2626",
    heroSubtitle: "en Acero",
    presentacion: "Tu espacio como docente de metalmecánica: recursos para enseñar soldadura, corte y fabricación de estructuras metálicas. Forma técnicos que construyen la infraestructura del país.",
    nivelEgreso: "Auxiliar Técnico",
    horasFormacion: "1,440",
    perfilEgreso: [
      { icon: "🔩", text: "Soldadura SMAW: procesos de unión por arco eléctrico en diversas posiciones (1G, 2G)" },
      { icon: "⚙️", text: "Soldadura especial MIG/MAG y TIG para aceros y aluminios, corte mecánico y conformado" },
      { icon: "📐", text: "Fabricación y montaje: construcción de estructuras, lectura de planos y gestión de obra" },
    ],
    unidadesCompetencia: [
      "Fundamentos: trazado, corte mecánico y conformado de perfiles metálicos",
      "Soldadura SMAW: procesos de unión por arco eléctrico en diversas posiciones (1G, 2G)",
      "Soldadura Especial: procesos avanzados (MIG/MAG y TIG) para aceros y aluminios",
      "Fabricación: construcción de ductos, estructuras pesadas y carpintería metálica industrial",
      "Montaje: lectura de planos mecánicos y gestión de montajes en obra",
    ],
    inventoryZones: [
      { icon: "🔬", name: "Zona de Investigación y Diseño Metalmecánico", desc: "Mesas de diseño, software CAD, equipos de medición de dureza y metalografía básica", count: 32 },
      { icon: "🔥", name: "Área de Soldadura y Corte", desc: "Máquinas de soldadura SMAW/MIG, equipos de oxicorte, plasma y amoladora industrial", count: 24 },
      { icon: "⚙️", name: "Área de Máquinas y Conformado", desc: "Taladro de columna, torno paralelo, dobladora de tubo, cizalla y prensa hidráulica", count: 20 },
      { icon: "🧰", name: "Depósito / Almacén de Materiales y EPP", desc: "Perfiles, planchas, tubos, electrodos, disco de corte, EPP de soldador y materiales de taller", count: 68 },
    ],
    sesiones: [
      sesionActiva(  "Soldadura SMAW: inicio del arco y posición plana", "Demostración en vivo de encendido y control del arco eléctrico. Técnica para docentes con poca experiencia en soldadura.", ["Hoy 4:00 PM", "Nivel Básico", "+24 inscritos"]),
      sesionProxima( "Soldadura MIG: ventajas y configuración del equipo", "Aprenderemos a configurar la velocidad de hilo, voltaje y gas protector para diferentes espesores.",                    ["Jue 26 — 5:30 PM", "Nivel Intermedio"]),
      sesionProxima( "Lectura de planos estructurales para el aula",       "Sesión docente: simbología de soldadura, vistas, cortes y cotas en planos metalmecánicos reales.",                       ["Sáb 28 — 9:00 AM", "Docentes"]),
      sesionGrabada( "Construcción de estructura metálica básica",          "Sesión grabada: de los planos a la estructura terminada. Proceso completo de una ventana metálica.",                      ["Grabada", "1h 40min", "+143 vistas"]),
    ],
    curiosidades: [
      { icon: "🏗️", title: "El acero mueve al Perú",          text: "El sector construcción metálica crece más del 8% anual en Perú. Desde puentes hasta naves industriales — todo es metalmecánica." },
      { icon: "🤖", title: "Robots soldadores en la industria", text: "El 70% de la soldadura industrial ya se hace con robots. Pero alguien tiene que programarlos, supervisarlos y repararlos." },
      { icon: "🔥", title: "Una habilidad para toda la vida",  text: "Un soldador certificado puede trabajar en 60+ países. La soldadura es una de las habilidades técnicas más universales del mundo." },
    ],
    quizTitle: "Quiz de Metalmecánica y Soldadura",
    quizDesc: "Procesos de soldadura, materiales y lectura de planos. ¡Demuestra tu dominio del acero!",
    quizBtnBg: "#dc2626",
  },
};

// ─── Datos por defecto (fallback) ─────────────────────────────────────────────
const DEFAULT_DATA: TallerDashboardData = {
  heroIcon: "🏫",
  heroImageCaption: "Foto del taller",
  tallerAccent: "#02d47e",
  heroSubtitle: "en Acción",
  presentacion: "Tu espacio como docente: recursos, planificaciones y materiales para transformar la enseñanza técnica.",
  nivelEgreso: "Auxiliar Técnico",
  horasFormacion: "1,440",
  perfilEgreso: [
    { icon: "📚", text: "Dominio de los conceptos técnicos fundamentales de la especialidad" },
    { icon: "💻", text: "Uso de herramientas digitales, trabajo colaborativo y documentación técnica" },
    { icon: "🚀", text: "Gestión de emprendimientos con metodologías ágiles y Design Thinking" },
  ],
  unidadesCompetencia: [
    "Fundamentos técnicos de la especialidad",
    "Técnicas intermedias y herramientas del taller",
    "Producción y control de calidad",
    "Gestión y emprendimiento",
    "Proyecto integrador y certificación",
  ],
  inventoryZones: [
    { icon: "🔬", name: "Zona de Investigación, Gestión y Diseño", desc: "Equipos de documentación y gestión de proyectos", count: 40 },
    { icon: "⚙️", name: "Área de Producción / Práctica", desc: "Equipos y herramientas principales del taller", count: 20 },
    { icon: "🧰", name: "Depósito / Almacén", desc: "Herramientas de mano, insumos y materiales de taller", count: 60 },
    { icon: "🖥️", name: "Área de Simulación / Digital", desc: "Módulos educativos y equipos de simulación", count: 15 },
  ],
  sesiones: [
    sesionActiva(  "Sesión introductoria del taller",             "Demostración práctica de los procedimientos básicos del taller. Incluye resolución de dudas.",      ["Hoy", "Nivel Básico"]),
    sesionProxima( "Técnica avanzada: nivel intermedio",           "Exploraremos procedimientos de mayor complejidad con equipos del taller.",                          ["Próximamente", "Nivel Intermedio"]),
    sesionProxima( "Sesión especial para docentes",                "Sesión pedagógica sobre cómo incorporar nuevas metodologías en el taller.",                         ["Próximamente", "Docentes"]),
    sesionGrabada( "Fundamentos del taller — sesión grabada",      "Sesión grabada con los conceptos esenciales de la especialidad.",                                   ["Grabada"]),
  ],
  curiosidades: [
    { icon: "💡", title: "Una especialidad con futuro",   text: "Los técnicos especializados tienen alta demanda laboral en Perú y América Latina." },
    { icon: "🌐", title: "Tecnología aplicada",           text: "La digitalización está transformando todos los oficios técnicos. El técnico del futuro combina oficio y tecnología." },
    { icon: "📈", title: "Emprendimiento técnico",        text: "La mayoría de los emprendimientos de alta rentabilidad en Perú provienen de especialidades técnicas." },
  ],
  quizTitle: "Quiz del Taller",
  quizDesc: "Pon a prueba tus conocimientos y genera curiosidad en tus estudiantes.",
  quizBtnBg: "#02d47e",
};

// ─── Exportación ──────────────────────────────────────────────────────────────
export const getTallerDashboardData = (slug: string): TallerDashboardData => {
  return DATA[slug] ?? DEFAULT_DATA;
};

export default DATA;
