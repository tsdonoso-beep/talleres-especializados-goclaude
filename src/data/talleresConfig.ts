// Configuración de los 9 talleres EPT — nombres del MD, orden de la referencia visual
export interface TallerConfig {
  id: string;
  slug: string;
  nombre: string;
  nombreCorto: string; // para sidebar
  numero: number;      // T1-T9
  descripcion: string;
  color: string;       // HSL values only (no hsl() wrapper)
  icon: string;        // lucide icon name
  imagen: string;      // Unsplash photo URL
  zonas: {
    id: string;
    nombre: string;
    descripcion: string;
  }[];
}

export const talleresConfig: TallerConfig[] = [
  {
    id: "mecanica-automotriz",
    slug: "mecanica-automotriz",
    nombre: "Mecánica Automotriz",
    nombreCorto: "Mecánica Automotriz",
    numero: 1,
    descripcion: "Aprende los fundamentos de la mecánica automotriz, diagnóstico y mantenimiento de vehículos. Formación técnica en sistemas de motor, transmisión, frenos y suspensión.",
    color: "220 70% 50%",
    icon: "Car",
    imagen: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "industria-vestido",
    slug: "industria-vestido",
    nombre: "Industria del Vestido",
    nombreCorto: "Ind. del Vestido",
    numero: 2,
    descripcion: "Diseño, patronaje, confección y acabados de prendas de vestir. Formación en técnicas de costura industrial, moldería, textiles y emprendimiento en moda.",
    color: "330 65% 50%",
    icon: "Scissors",
    imagen: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "cocina-reposteria",
    slug: "cocina-reposteria",
    nombre: "Cocina y Repostería",
    nombreCorto: "Cocina y Repostería",
    numero: 3,
    descripcion: "Técnicas culinarias, preparación de alimentos y arte de la repostería. Desarrollo de competencias en cocina nacional e internacional, pastelería y gestión.",
    color: "30 70% 50%",
    icon: "ChefHat",
    imagen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "ebanisteria",
    slug: "ebanisteria",
    nombre: "Ebanistería",
    nombreCorto: "Ebanistería",
    numero: 4,
    descripcion: "Diseño y fabricación de muebles finos y estructuras en madera. Formación en técnicas de torno, ensamble, lacado y acabados de alta calidad.",
    color: "25 55% 42%",
    icon: "Hammer",
    imagen: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "computacion-informatica",
    slug: "computacion-informatica",
    nombre: "Comp. e Informática",
    nombreCorto: "Comp. e Informática",
    numero: 5,
    descripcion: "Programación, redes y soporte técnico de sistemas informáticos. Formación en ofimática, desarrollo web básico y mantenimiento de hardware y software.",
    color: "180 65% 38%",
    icon: "Monitor",
    imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "electronica",
    slug: "electronica",
    nombre: "Electrónica",
    nombreCorto: "Electrónica",
    numero: 6,
    descripcion: "Diseño, montaje y reparación de circuitos y sistemas electrónicos. Formación en automatización, microcontroladores y electrónica de potencia.",
    color: "200 70% 45%",
    icon: "Cpu",
    imagen: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "industria-alimentaria",
    slug: "industria-alimentaria",
    nombre: "Ind. Alimentaria",
    nombreCorto: "Ind. Alimentaria",
    numero: 7,
    descripcion: "Procesamiento, conservación y control de calidad de alimentos. Buenas prácticas de manufactura, inocuidad alimentaria y gestión de producción.",
    color: "50 70% 42%",
    icon: "UtensilsCrossed",
    imagen: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "electricidad",
    slug: "electricidad",
    nombre: "Electricidad",
    nombreCorto: "Electricidad",
    numero: 8,
    descripcion: "Instalación y mantenimiento de sistemas eléctricos residenciales e industriales. Formación en tableros, redes y normativa de seguridad eléctrica.",
    color: "45 80% 48%",
    icon: "Zap",
    imagen: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  },
  {
    id: "construcciones-metalicas",
    slug: "construcciones-metalicas",
    nombre: "Const. Metálicas",
    nombreCorto: "Const. Metálicas",
    numero: 9,
    descripcion: "Técnicas de soldadura, corte y ensamble de estructuras metálicas. Formación en lectura de planos, metalmecánica y fabricación industrial.",
    color: "15 55% 45%",
    icon: "Wrench",
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    zonas: [
      { id: "investigacion", nombre: "Zona Investigación", descripcion: "Equipos para identificar necesidades y problemas" },
      { id: "innovacion", nombre: "Zona Innovación", descripcion: "Equipos para diseñar y crear prototipos" },
      { id: "seguridad", nombre: "Seguridad", descripcion: "Equipamiento de protección personal" }
    ]
  }
];

export const getTallerBySlug = (slug: string): TallerConfig | undefined => {
  return talleresConfig.find(t => t.slug === slug);
};

export const getZonasByTaller = (tallerSlug: string) => {
  const taller = getTallerBySlug(tallerSlug);
  return taller?.zonas || [];
};
