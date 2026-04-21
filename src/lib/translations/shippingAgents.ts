export type ShippingAgentsTranslations = {
  meta: { title: string; description: string };
  nav: { link: string };
  hero: {
    badge: string;
    h1: string;
    subtitle: string;
    supportingLine: string;
    impactPhrase: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  pain: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; body: string }>;
  };
  solution: {
    badge: string;
    title: string;
    subtitle: string;
    features: Array<{ title: string; body: string }>;
  };
  howItWorks: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; body: string }>;
  };
  noReplacement: {
    badge: string;
    title: string;
    text1: string;
    text2: string;
    cardTitle: string;
    items: Array<{ label: string; note: string }>;
  };
  credibility: {
    badge: string;
    title: string;
    subtitle: string;
    actorsTitle: string;
    actors: string[];
    supportedTitle: string;
    supporters: string[];
  };
  pilotPorts: {
    badge: string;
    title: string;
    subtitle: string;
    ports: Array<{ name: string; country: string }>;
  };
  bottomCta: { title: string; subtitle: string; button: string };
  form: {
    badge: string;
    title: string;
    name: string;
    namePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    role: string;
    rolePlaceholder: string;
    roles: {
      portAgent: string;
      pilotStation: string;
      tugCompany: string;
      mooringCompany: string;
      terminal: string;
      portAuthority: string;
      serviceProvider: string;
      other: string;
    };
    port: string;
    portPlaceholder: string;
    submit: string;
    disclaimer: string;
    errorFallback: string;
    success: { title: string; message: string };
  };
};

// ─── ENGLISH ──────────────────────────────────────────────────────────────────

export const shippingAgentsEn: ShippingAgentsTranslations = {
  meta: {
    title: "NauticOps for Port Agents | Port Call Coordination Layer",
    description:
      "Stop coordinating port calls through WhatsApp chains. NauticOps gives shipping agents and all port actors a shared operational timeline — one update, everyone aligned.",
  },
  nav: { link: "For Port Agents" },
  hero: {
    badge: "For Port Agents & Shipping Agencies",
    h1: "One update.\nEvery party aligned.",
    subtitle:
      "NauticOps gives shipping agents a single shared operational view of every port call — visible in real time to the pilot, tug, mooring crew, terminal, and port authority.",
    supportingLine: "No integration project. No system replacement. Active from day one.",
    impactPhrase:
      "NauticOps does not replace your systems.\nIt makes them work together.",
    ctaPrimary: "Request Pilot Access",
    ctaSecondary: "See the full platform",
  },
  pain: {
    badge: "The coordination gap",
    title: "The cost of coordinating a port call manually",
    subtitle:
      "Every port call involves five to eight actors with different systems, different schedules, and no shared view. The shipping agent absorbs that entire coordination cost — every single call.",
    items: [
      {
        title: "You are the only one with the full picture",
        body: "The pilot, the tug, the terminal and the port authority each have their own partial view. You carry all the threads — and relay every change manually across six different conversations.",
      },
      {
        title: "ETA changes travel slower than the vessel",
        body: "A two-hour delay triggers a chain of calls, messages and re-confirmations. By the time everyone is updated, the service schedule has already shifted and nobody agrees on the new timing.",
      },
      {
        title: "No confirmation trail. No traceability.",
        body: "Verbal confirmations and WhatsApp threads are not records. When something goes wrong, there is no log of who confirmed what, when, and under which conditions — and the accountability lands on you.",
      },
      {
        title: "You become the operational bottleneck",
        body: "The entire port call depends on your availability. If you are unreachable for thirty minutes, the berth assignment, the tug booking and the terminal slot are all on hold.",
      },
    ],
  },
  solution: {
    badge: "The NauticOps layer",
    title: "A shared operational view for every port call",
    subtitle:
      "NauticOps connects all actors around a single source of truth for the port call. The shipping agent stops being the relay and starts being the supervisor.",
    features: [
      {
        title: "One shared operational timeline",
        body: "Pilot, tug operator, mooring crew, terminal and port authority see the same port call timeline in real time — ETA, berth, service schedule, confirmations. No more fragmented pictures.",
      },
      {
        title: "ETA changes propagate instantly",
        body: "Update the ETA once. Every actor with a service in that call sees the change immediately. Idle time caused by late notification drops to zero.",
      },
      {
        title: "Confirmations per actor, on record",
        body: "Each party confirms their slot directly in the platform. You see the status of every service in real time. No follow-up calls to check if the tug is confirmed.",
      },
      {
        title: "A layer on top, not a replacement",
        body: "NauticOps does not replace your PCS, your TOS or your existing tools. It sits on top as a lightweight coordination layer — active from day one, no migration required.",
      },
    ],
  },
  howItWorks: {
    badge: "Operational flow",
    title: "From notification to departure.\nOne shared view.",
    subtitle:
      "NauticOps does not change how the port call works. It gives every actor visibility of the same call — in real time.",
    steps: [
      {
        number: "01",
        title: "Vessel notification received",
        body: "You receive the arrival notice from the shipowner or operator. You create or confirm the port call in NauticOps — ETA, berth, services required.",
      },
      {
        number: "02",
        title: "All actors see the same timeline",
        body: "Pilot station, tug company, mooring crew and terminal access the shared timeline instantly. Each actor sees only what is relevant to their service.",
      },
      {
        number: "03",
        title: "Changes propagate. Confirmations accumulate.",
        body: "When the ETA shifts, every actor is notified. Each one confirms their updated slot directly. You monitor overall progress from a single view — no calls needed.",
      },
    ],
  },
  noReplacement: {
    badge: "Zero friction adoption",
    title: "NauticOps sits on top of what you already use",
    text1:
      "No integration project. No data migration. No training week. NauticOps is a lightweight coordination layer that connects the actors of the port call — without replacing any existing system.",
    text2:
      "In pilot mode, onboarding takes less than one working day. You set up the first port call and all actors are operational from that moment.",
    cardTitle: "What NauticOps does not replace",
    items: [
      {
        label: "Port Community System (PCS)",
        note: "NauticOps does not replace it — it adds a real-time operational coordination layer on top.",
      },
      {
        label: "Terminal Operating System (TOS)",
        note: "Terminal operations continue in your TOS. NauticOps adds shared timeline visibility.",
      },
      {
        label: "ERP or back-office systems",
        note: "Your financial and administrative workflows are untouched.",
      },
      {
        label: "Messaging tools",
        note: "NauticOps is not a chat. It is a structured coordination layer with confirmations and a shared operational record.",
      },
    ],
  },
  credibility: {
    badge: "Sector validation",
    title: "Built with the ecosystem, not outside it",
    subtitle:
      "NauticOps has been developed with direct input from port actors, maritime operators, and port innovation programmes.",
    actorsTitle: "Designed for the full port call ecosystem",
    actors: [
      "Port Authorities",
      "Shipping Agents",
      "Pilot Stations",
      "Tug Operators",
      "Mooring Companies",
      "Maritime Terminals",
      "Maritime Service Providers",
    ],
    supportedTitle: "Validated with support from",
    supporters: [
      "La Lonja Tech — maritime innovation programme",
      "Incubazul / Bluecore — blue economy accelerator",
      "Ports 4.0 — Spanish port innovation fund (application submitted)",
      "Port authority institutional support letters",
    ],
  },
  pilotPorts: {
    badge: "Pilot programme",
    title: "Initial pilot conversations active in",
    subtitle:
      "We are currently in early dialogue with port actors in these locations for the first live pilots.",
    ports: [
      { name: "Vigo", country: "Spain" },
      { name: "Cádiz", country: "Spain" },
      { name: "Huelva", country: "Spain" },
      { name: "Castellón", country: "Spain" },
    ],
  },
  bottomCta: {
    title: "Ready to run your first coordinated port call?",
    subtitle:
      "Request pilot access for your agency. We configure the first port call together — at your port, with your services, with your actors.",
    button: "Request Pilot Access",
  },
  form: {
    badge: "Start your pilot",
    title: "Request pilot access",
    name: "Full name",
    namePlaceholder: "Your name",
    company: "Company / Agency",
    companyPlaceholder: "Your company name",
    email: "Work email",
    emailPlaceholder: "you@company.com",
    role: "Your role",
    rolePlaceholder: "Select your role",
    roles: {
      portAgent: "Port Agent / Shipping Agent",
      pilotStation: "Pilot Station",
      tugCompany: "Tug Operator",
      mooringCompany: "Mooring Company",
      terminal: "Terminal Operator",
      portAuthority: "Port Authority",
      serviceProvider: "Maritime Service Provider",
      other: "Other",
    },
    port: "Main port (optional)",
    portPlaceholder: "e.g. Port of Vigo",
    submit: "Request Pilot Access",
    disclaimer: "We will contact you within 24 hours to discuss your port and operational context.",
    errorFallback: "Something went wrong. Please try again or email us at info@nauticops.com",
    success: {
      title: "Request received",
      message:
        "We will be in touch within 24 hours to discuss your port and how to run the first coordinated port call together.",
    },
  },
};

// ─── ESPAÑOL ──────────────────────────────────────────────────────────────────

export const shippingAgentsEs: ShippingAgentsTranslations = {
  meta: {
    title: "NauticOps para Consignatarios | Coordinación Operativa de Escalas",
    description:
      "Deja de coordinar la escala por WhatsApp y teléfono. NauticOps da al consignatario y a todos los actores portuarios una visión operativa compartida — una actualización, todos alineados.",
  },
  nav: { link: "Para Consignatarios" },
  hero: {
    badge: "Para Consignatarios y Servicios Portuarios",
    h1: "Una actualización.\nTodos alineados.",
    subtitle:
      "NauticOps da al consignatario una visión operativa única de cada escala — visible en tiempo real para el práctico, remolcador, amarre, terminal y Autoridad Portuaria.",
    supportingLine: "Sin integrar sistemas. Sin sustituir nada. Operativo desde el primer día.",
    impactPhrase:
      "NauticOps no sustituye tus sistemas.\nHace que trabajen coordinados.",
    ctaPrimary: "Solicitar piloto",
    ctaSecondary: "Ver la plataforma",
  },
  pain: {
    badge: "El problema de la coordinación",
    title: "El coste real de coordinar una escala manualmente",
    subtitle:
      "Cada escala implica entre cinco y ocho actores con sistemas distintos, agendas distintas y sin visión compartida. El consignatario absorbe todo ese coste de coordinación — en cada escala.",
    items: [
      {
        title: "Tú eres el único con la foto completa",
        body: "El práctico, el remolcador, la terminal y la Autoridad Portuaria tienen visiones parciales. Tú llevas todos los hilos — y retransmites cada cambio manualmente a través de seis conversaciones distintas.",
      },
      {
        title: "Los cambios de ETA viajan más despacio que el buque",
        body: "Un retraso de dos horas supone una cadena de llamadas, mensajes y reconfirmaciones. Cuando todos están actualizados, el programa de servicios ya ha cambiado y nadie coincide en los nuevos tiempos.",
      },
      {
        title: "Sin confirmaciones registradas. Sin trazabilidad.",
        body: "Las confirmaciones verbales y los hilos de WhatsApp no son registros. Cuando algo falla, no existe log de quién confirmó qué, cuándo y en qué condiciones — y la responsabilidad recae sobre ti.",
      },
      {
        title: "Tú eres el cuello de botella de la operación",
        body: "La escala depende de tu disponibilidad. Si estás treinta minutos sin cobertura, el atraque, el remolcador y el turno de terminal están en espera.",
      },
    ],
  },
  solution: {
    badge: "La capa NauticOps",
    title: "Una visión operativa compartida para cada escala",
    subtitle:
      "NauticOps conecta a todos los actores alrededor de una única fuente de verdad para la escala. El consignatario deja de ser el intermediario y pasa a ser el supervisor.",
    features: [
      {
        title: "Un timeline operativo único y compartido",
        body: "Práctico, remolcador, amarre, terminal y Autoridad Portuaria ven el mismo timeline en tiempo real — ETA, atraque, programa de servicios, confirmaciones. Sin visiones fragmentadas.",
      },
      {
        title: "Los cambios de ETA se propagan al instante",
        body: "Actualizas la ETA una vez. Cada actor con un servicio en esa escala lo ve de forma inmediata. Los tiempos muertos por notificación tardía desaparecen.",
      },
      {
        title: "Confirmaciones por actor, registradas",
        body: "Cada servicio confirma su franja directamente en la plataforma. Ves el estado de cada operación en tiempo real. Sin llamadas para verificar si el remolcador está confirmado.",
      },
      {
        title: "Una capa encima, no una sustitución",
        body: "NauticOps no reemplaza tu SCSP, tu TOS ni tus herramientas actuales. Se sitúa encima como capa ligera de coordinación — operativa desde el primer día, sin migración.",
      },
    ],
  },
  howItWorks: {
    badge: "Flujo operativo",
    title: "Desde la notificación hasta la salida.\nUna visión compartida.",
    subtitle:
      "NauticOps no cambia cómo funciona la escala. Da a cada actor visibilidad del mismo escenario — en tiempo real.",
    steps: [
      {
        number: "01",
        title: "Recibes la notificación de escala",
        body: "Recibes el aviso de llegada del armador u operador. Creas o confirmas la escala en NauticOps — ETA, atraque, servicios requeridos.",
      },
      {
        number: "02",
        title: "Todos los actores ven el mismo timeline",
        body: "Prácticos, remolcadores, amarre y terminal acceden al timeline compartido al instante. Cada actor ve solo lo que es relevante para su servicio.",
      },
      {
        number: "03",
        title: "Los cambios se propagan. Las confirmaciones se acumulan.",
        body: "Cuando cambia la ETA, todos los actores son notificados. Cada uno confirma su franja actualizada directamente. Tú supervisas el avance desde una única vista — sin llamadas.",
      },
    ],
  },
  noReplacement: {
    badge: "Adopción sin fricción",
    title: "NauticOps se instala sobre lo que ya usas",
    text1:
      "Sin proyecto de integración. Sin migración de datos. Sin semana de formación. NauticOps es una capa ligera de coordinación que conecta a los actores de la escala — sin sustituir ningún sistema existente.",
    text2:
      "En modo piloto, la puesta en marcha lleva menos de una jornada. Configuras la primera escala y todos los actores están operativos desde ese momento.",
    cardTitle: "Lo que NauticOps no sustituye",
    items: [
      {
        label: "Sistema de Comunidad Portuaria (SCSP / PCS)",
        note: "NauticOps no lo reemplaza — añade una capa de coordinación operativa en tiempo real sobre él.",
      },
      {
        label: "Sistema de Gestión de Terminal (TOS)",
        note: "Las operaciones de terminal siguen en tu TOS. NauticOps añade visibilidad compartida del timeline de escala.",
      },
      {
        label: "ERP o sistemas administrativos",
        note: "Tus flujos financieros y administrativos no se tocan.",
      },
      {
        label: "Herramientas de mensajería",
        note: "NauticOps no es un chat. Es una capa de coordinación estructurada con confirmaciones y registro operativo.",
      },
    ],
  },
  credibility: {
    badge: "Validación sectorial",
    title: "Construido con el ecosistema, no fuera de él",
    subtitle:
      "NauticOps se ha desarrollado con aportación directa de actores portuarios, operadores marítimos y programas de innovación portuaria.",
    actorsTitle: "Diseñado para todo el ecosistema de la escala",
    actors: [
      "Autoridades Portuarias",
      "Consignatarios",
      "Prácticos",
      "Remolcadores",
      "Empresas de amarre",
      "Terminales portuarias",
      "Servicios marítimos auxiliares",
    ],
    supportedTitle: "Validado con el respaldo de",
    supporters: [
      "La Lonja Tech — programa de innovación marítima",
      "Incubazul / Bluecore — aceleradora de economía azul",
      "Ports 4.0 — fondo de innovación portuaria (candidatura presentada)",
      "Cartas de apoyo de Autoridades Portuarias",
    ],
  },
  pilotPorts: {
    badge: "Programa piloto",
    title: "Conversaciones de piloto activas en",
    subtitle:
      "Actualmente mantenemos diálogo con actores portuarios en estas ubicaciones para los primeros pilotos reales.",
    ports: [
      { name: "Vigo", country: "España" },
      { name: "Cádiz", country: "España" },
      { name: "Huelva", country: "España" },
      { name: "Castellón", country: "España" },
    ],
  },
  bottomCta: {
    title: "¿Listo para coordinar tu primera escala con visibilidad compartida?",
    subtitle:
      "Solicita acceso piloto para tu consignataria. Configuramos la primera escala juntos — en tu puerto, con tus servicios, con tus actores.",
    button: "Solicitar piloto",
  },
  form: {
    badge: "Inicia tu piloto",
    title: "Solicitar acceso piloto",
    name: "Nombre completo",
    namePlaceholder: "Tu nombre",
    company: "Empresa / Consignataria",
    companyPlaceholder: "Nombre de tu empresa",
    email: "Email profesional",
    emailPlaceholder: "tu@empresa.com",
    role: "Tu rol",
    rolePlaceholder: "Selecciona tu rol",
    roles: {
      portAgent: "Consignatario / Agente marítimo",
      pilotStation: "Prácticos",
      tugCompany: "Remolcadores",
      mooringCompany: "Amarre",
      terminal: "Terminal portuaria",
      portAuthority: "Autoridad Portuaria",
      serviceProvider: "Servicios marítimos",
      other: "Otro",
    },
    port: "Puerto principal (opcional)",
    portPlaceholder: "Ej. Puerto de Vigo",
    submit: "Solicitar piloto",
    disclaimer: "Nos pondremos en contacto en menos de 24 horas para hablar de tu puerto y contexto operativo.",
    errorFallback: "Ha ocurrido un error. Inténtalo de nuevo o escríbenos a info@nauticops.com",
    success: {
      title: "Solicitud recibida",
      message:
        "Nos pondremos en contacto en menos de 24 horas para hablar de tu puerto y cómo coordinar juntos la primera escala.",
    },
  },
};
