export type AboutTranslations = {
  about: {
    badge: string;
    title: string;
    subtitle: string;
    roleAtNauticOps: string;
    readMore: string;
    readLess: string;
    members: Array<{
      name: string;
      role: string;
      tags: string;
      shortBio: string;
      fullBio: string[];
      responsibilities: string[];
    }>;
  };
};

export const aboutEn: AboutTranslations["about"] = {
  badge: "About Us",
  title: "Built from Real Port Call Reality",
  subtitle:
    "NauticOps is built from the day-to-day of a port call: last-minute changes, many stakeholders, and constant coordination by phone and email. We deliver a simple shared layer for real-time coordination and visibility that fits into existing systems—without changing how people work.",
  roleAtNauticOps: "At NauticOps he leads",
  readMore: "Read more",
  readLess: "Read less",
  members: [
    {
      name: "Abraham Riveiro Sotelo",
      role: "Founder & CEO",
      tags: "Port calls & vessel ops background · Product and pilots",
      shortBio:
        "Seafarer and founder of NauticOps. Brings field insight from real vessel operations and port calls, turning it into a practical product that helps port stakeholders coordinate through shared, real-time information.",
      fullBio: [
        "Abraham has experienced port call coordination firsthand: ETA changes, service rescheduling, berth windows, incidents, and time pressure. At NauticOps, he focuses on turning those frictions into simple workflows—clear alerts, a shared status, and fewer repeated calls.",
      ],
      responsibilities: [
        "Product vision and use-case prioritization",
        "Validation with stakeholders (agents, terminals, towage, pilots, mooring, shipping lines)",
        "Lightweight pilots and rollouts",
        "Partnerships with the port innovation ecosystem",
      ],
    },
    {
      name: "José Ramón Cobián Fernández",
      role: "CTO",
      tags: "Engineering & data · Platform and scalability",
      shortBio:
        "CTO at NauticOps. Turns port call operational needs into a robust, scalable platform—data integration, architecture and automation to keep coordination reliable and fast.",
      fullBio: [
        "José Ramón leads NauticOps' technical build so the product remains solid, secure, and ready to scale. His approach is hands-on: integrate data sources, structure port-call events, and ensure each stakeholder sees what they need, exactly when they need it.",
      ],
      responsibilities: [
        "Backend architecture and data models",
        "Integrations (APIs, maritime data sources, existing systems)",
        "Event automation, alerts, and information consistency",
        "Performance, reliability, and product scalability",
      ],
    },
  ],
};

export const aboutEs: AboutTranslations["about"] = {
  badge: "Sobre Nosotros",
  title: "Construido desde la Operativa Real del Puerto",
  subtitle:
    "NauticOps nace del día a día de una escala: cambios de última hora, múltiples actores y mucha coordinación por teléfono y correo. Creamos una capa sencilla de coordinación y visibilidad en tiempo real que se integra con lo que ya usa el puerto, sin cambiar la forma de trabajar.",
  roleAtNauticOps: "En NauticOps lidera",
  readMore: "Leer más",
  readLess: "Leer menos",
  members: [
    {
      name: "Abraham Riveiro Sotelo",
      role: "Fundador & CEO",
      tags: "Experiencia en buques y escalas · Producto y pilotos",
      shortBio:
        "Marino mercante y fundador de NauticOps. Aporta visión de \"terreno\" desde la operativa real de buques y escalas, y la traduce a un producto práctico para coordinar actores portuarios con información compartida en tiempo real.",
      fullBio: [
        "Abraham ha vivido la coordinación de una escala desde dentro: cambios de ETA, ajustes de servicios, ventanas de atraque, incidencias y presión por tiempos. En NauticOps se centra en convertir esas fricciones en flujos simples: avisos claros, estado compartido y menos llamadas repetidas.",
      ],
      responsibilities: [
        "Visión de producto y prioridades por caso de uso",
        "Validación con actores (consignatarios, terminales, remolque, practicaje, amarre, navieras)",
        "Pilotos y despliegues ligeros",
        "Alianzas con ecosistema e incubadoras",
      ],
    },
    {
      name: "José Ramón Cobián Fernández",
      role: "CTO",
      tags: "Ingeniería y datos · Plataforma y escalabilidad",
      shortBio:
        "CTO de NauticOps. Convierte necesidades operativas del puerto en una plataforma robusta y escalable: integración de datos, arquitectura y automatización para que la coordinación sea fiable y rápida.",
      fullBio: [
        "José Ramón lidera el diseño técnico de NauticOps para que el sistema sea sólido, seguro y preparado para crecer. Su enfoque es práctico: integrar fuentes de datos, normalizar eventos de escala y asegurar que cada actor vea lo que necesita, cuando lo necesita.",
      ],
      responsibilities: [
        "Arquitectura backend y modelos de datos",
        "Integraciones (APIs, fuentes marítimas, sistemas existentes)",
        "Automatización de eventos, alertas y consistencia de información",
        "Rendimiento, fiabilidad y escalabilidad del producto",
      ],
    },
  ],
};
