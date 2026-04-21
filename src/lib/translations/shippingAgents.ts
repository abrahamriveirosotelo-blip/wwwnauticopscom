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
    title: "NauticOps for Port Agents | Port Call Coordination",
    description:
      "Stop coordinating port calls through WhatsApp chains. NauticOps puts every service provider on the same operational view so one update reaches everyone at the same time.",
  },
  nav: { link: "For Port Agents" },
  hero: {
    badge: "For Port Agents and Shipping Agencies",
    h1: "When the ETA changes,\neveryone needs to know.",
    subtitle:
      "NauticOps puts the port call on a shared screen. The pilot, tug, mooring crew, terminal and port authority all see the same picture, updated in real time.",
    supportingLine: "No integration project. No system replacement. Operational from day one.",
    impactPhrase:
      "NauticOps does not replace your port systems. It coordinates the people and services around them.",
    ctaPrimary: "Request a pilot",
    ctaSecondary: "See the platform",
  },
  pain: {
    badge: "How port calls work today",
    title: "What coordination really costs, call by call",
    subtitle:
      "Every port call involves five to eight actors with different systems, different schedules and no shared view. The shipping agent carries that coordination load on every single call.",
    items: [
      {
        title: "You are the only one with the full picture",
        body: "The pilot, the tug, the terminal and the port authority each have their own partial view. You carry all the threads and relay every change manually across six different conversations.",
      },
      {
        title: "ETA changes travel slower than the vessel",
        body: "A two-hour delay triggers a chain of calls, messages and re-confirmations. By the time everyone is updated, the service schedule has already shifted and nobody agrees on the new timing.",
      },
      {
        title: "Verbal confirmations do not leave a trail",
        body: "WhatsApp threads and phone confirmations are not records. When something goes wrong, there is no log of who confirmed what or when. And the accountability lands on you.",
      },
      {
        title: "The whole operation stops when you are not available",
        body: "If you are unreachable for thirty minutes, the berth assignment, the tug booking and the terminal slot are all on hold. The port call depends entirely on your personal availability.",
      },
    ],
  },
  solution: {
    badge: "What NauticOps changes",
    title: "How daily port call coordination works with NauticOps",
    subtitle:
      "The shipping agent stops being the one who has to relay everything and gets time to supervise the call instead.",
    features: [
      {
        title: "A single operational view everyone works from",
        body: "Pilot, tug operator, mooring crew, terminal and port authority see the same port call in one place: ETA, berth, service schedule, confirmations. No more conflicting information depending on who you ask.",
      },
      {
        title: "When the ETA shifts, everyone sees it at the same time",
        body: "Update the ETA once. Every actor with a service in that call sees the change immediately. Idle time caused by late notification disappears.",
      },
      {
        title: "Every service confirms directly, without going through you",
        body: "Each party confirms their slot in the platform. You see the status of every service without picking up the phone to chase confirmations.",
      },
      {
        title: "Works with what you already have",
        body: "NauticOps runs alongside your existing tools. No configuration needed on other parties' side. No new systems to learn before the first port call.",
      },
    ],
  },
  howItWorks: {
    badge: "Step by step",
    title: "How a port call runs in NauticOps",
    subtitle:
      "The process does not change. What changes is that every actor can see it as it happens.",
    steps: [
      {
        number: "01",
        title: "You receive the arrival notice",
        body: "You register the port call in NauticOps: ETA, berth and services required. From that moment, every party involved has access to the same information.",
      },
      {
        number: "02",
        title: "Every actor sees the same timeline",
        body: "Pilot station, tug company, mooring crew and terminal see the shared schedule instantly. Each one sees only what is relevant to their own service, without information overload.",
      },
      {
        number: "03",
        title: "The ETA shifts. Everyone adjusts.",
        body: "When timing changes, every actor is notified and confirms their updated slot directly. You monitor the full picture from one view without needing to call anyone.",
      },
    ],
  },
  noReplacement: {
    badge: "No integration required",
    title: "NauticOps works alongside what you already use",
    text1:
      "There is no integration project. No data to migrate, no systems to reconfigure. NauticOps connects the actors of the port call as a coordination layer, without touching any existing system.",
    text2:
      "In pilot mode, setup takes less than one working day. You register the first port call and all actors are operational from that moment.",
    cardTitle: "What NauticOps does not replace",
    items: [
      {
        label: "Port Community System (PCS)",
        note: "NauticOps adds real-time operational coordination on top of it. Your PCS workflow is unchanged.",
      },
      {
        label: "Terminal Operating System (TOS)",
        note: "Terminal operations continue in your TOS. NauticOps adds a shared view of the port call for everyone involved.",
      },
      {
        label: "ERP or back-office systems",
        note: "Your financial and administrative workflows are not touched.",
      },
      {
        label: "Messaging tools",
        note: "NauticOps is not a chat. It is a coordination layer: structured confirmations, shared status, operational record.",
      },
    ],
  },
  credibility: {
    badge: "Sector validation",
    title: "Built with the ecosystem, not outside it",
    subtitle:
      "NauticOps has been developed with direct input from port operators, maritime service providers and port innovation programmes.",
    actorsTitle: "The actors it connects",
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
    title: "Early conversations underway in",
    subtitle:
      "We are working with port operators in these locations to plan the first live deployments.",
    ports: [
      { name: "Vigo", country: "Spain" },
      { name: "Cádiz", country: "Spain" },
      { name: "Huelva", country: "Spain" },
      { name: "Castellón", country: "Spain" },
    ],
  },
  bottomCta: {
    title: "Want to see how NauticOps fits your operation?",
    subtitle:
      "We configure the first port call together, at your port, with your services and your actors. No commitment beyond that first call.",
    button: "Request a pilot",
  },
  form: {
    badge: "Start your pilot",
    title: "Request a pilot",
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
    submit: "Request a pilot",
    disclaimer: "We will contact you within 24 hours to talk about your port and how we can run the first call together.",
    errorFallback: "Something went wrong. Please try again or write to us at info@nauticops.com",
    success: {
      title: "Request received",
      message:
        "We will be in touch within 24 hours to talk about your port and how to coordinate the first call together.",
    },
  },
};

// ─── ESPAÑOL ──────────────────────────────────────────────────────────────────

export const shippingAgentsEs: ShippingAgentsTranslations = {
  meta: {
    title: "NauticOps para Consignatarios | Coordinación Operativa de Escalas",
    description:
      "Deja de coordinar la escala por teléfono y WhatsApp. NauticOps pone a todos los actores portuarios en la misma pantalla operativa para que una sola actualización llegue a todos al mismo tiempo.",
  },
  nav: { link: "Para Consignatarios" },
  hero: {
    badge: "Para Consignatarios y Servicios Portuarios",
    h1: "Cuando cambia la ETA,\ntodos tienen que saberlo a la vez.",
    subtitle:
      "NauticOps pone la escala en una pantalla compartida. El práctico, el remolcador, el amarre, la terminal y la Autoridad Portuaria ven la misma información, actualizada en tiempo real.",
    supportingLine: "Sin integrar sistemas. Sin sustituir nada. Operativo desde el primer día.",
    impactPhrase:
      "NauticOps no sustituye tus sistemas portuarios. Coordina a las personas y los servicios que trabajan alrededor de ellos.",
    ctaPrimary: "Solicitar piloto",
    ctaSecondary: "Ver la plataforma",
  },
  pain: {
    badge: "Cómo funciona la escala hoy",
    title: "Lo que cuesta coordinar una escala, llamada a llamada",
    subtitle:
      "Cada escala implica entre cinco y ocho actores con sistemas distintos, agendas distintas y sin visión compartida. El consignatario asume ese coste operativo en cada escala.",
    items: [
      {
        title: "Tú eres el único que tiene la foto completa",
        body: "El práctico, el remolcador, la terminal y la Autoridad Portuaria tienen visiones parciales. Tú llevas todos los hilos y tienes que retransmitir cada cambio manualmente por seis conversaciones distintas.",
      },
      {
        title: "Los cambios de ETA viajan más despacio que el buque",
        body: "Un retraso de dos horas genera una cadena de llamadas, mensajes y reconfirmaciones. Cuando todos están al día, el programa de servicios ya ha cambiado y nadie coincide en los nuevos tiempos.",
      },
      {
        title: "Las confirmaciones verbales no dejan rastro",
        body: "Los hilos de WhatsApp y las confirmaciones telefónicas no son registros. Cuando algo falla, no hay log de quién confirmó qué ni cuándo. Y la responsabilidad recae sobre ti.",
      },
      {
        title: "La operación entera para cuando tú no estás disponible",
        body: "Si estás treinta minutos sin cobertura, el atraque, el remolcador y el turno de terminal están en espera. La escala depende por completo de tu disponibilidad personal.",
      },
    ],
  },
  solution: {
    badge: "Qué cambia con NauticOps",
    title: "Cómo cambia la coordinación diaria de la escala",
    subtitle:
      "El consignatario deja de ser el intermediario permanente que tiene que retransmitir todo y puede dedicar ese tiempo a supervisar la escala en su conjunto.",
    features: [
      {
        title: "Una única pantalla de la escala para todos",
        body: "Práctico, remolcador, amarre, terminal y Autoridad Portuaria ven la misma escala en un único sitio: ETA, atraque, programa de servicios y confirmaciones. Sin versiones distintas según con quién hables.",
      },
      {
        title: "Cuando cambia la ETA, todos lo saben al mismo tiempo",
        body: "Actualizas la ETA una vez. Cada actor con un servicio en esa escala lo ve de inmediato. Los tiempos muertos por notificación tardía desaparecen.",
      },
      {
        title: "Cada servicio confirma directamente, sin pasar por ti",
        body: "Cada actor confirma su franja en la plataforma. Ves el estado de cada servicio sin tener que llamar a nadie para verificarlo.",
      },
      {
        title: "Funciona con lo que ya tienes",
        body: "NauticOps trabaja junto a tus herramientas actuales. No hace falta que el resto configure nada antes de la primera escala.",
      },
    ],
  },
  howItWorks: {
    badge: "Paso a paso",
    title: "Cómo funciona una escala en NauticOps",
    subtitle:
      "El proceso no cambia. Lo que cambia es que todos los actores pueden verlo tal como ocurre.",
    steps: [
      {
        number: "01",
        title: "Recibes el aviso de llegada",
        body: "Registras la escala en NauticOps: ETA, atraque y servicios requeridos. Desde ese momento, todos los actores implicados tienen acceso a la misma información.",
      },
      {
        number: "02",
        title: "Todos los actores ven el mismo programa",
        body: "Prácticos, remolcadores, amarre y terminal ven el timeline compartido al instante. Cada uno ve solo lo que corresponde a su servicio, sin sobrecarga de información.",
      },
      {
        number: "03",
        title: "Cambia la ETA. Todos se ajustan.",
        body: "Cuando cambian los tiempos, cada actor recibe la notificación y confirma su franja actualizada directamente. Tú supervisas el avance desde una única vista, sin llamadas.",
      },
    ],
  },
  noReplacement: {
    badge: "Sin integración, sin proyecto",
    title: "NauticOps trabaja junto a lo que ya usas",
    text1:
      "No hay proyecto de integración. No hay datos que migrar ni sistemas que reconfigurar. NauticOps se instala como capa de coordinación sin modificar nada de lo que ya funciona.",
    text2:
      "En modo piloto, la puesta en marcha lleva menos de una jornada. Registras la primera escala y todos los actores están operativos desde ese momento.",
    cardTitle: "Lo que NauticOps no sustituye",
    items: [
      {
        label: "Sistema de Comunidad Portuaria (SCSP / PCS)",
        note: "NauticOps añade coordinación operativa en tiempo real sobre él. Tu flujo de trabajo en el SCSP no cambia.",
      },
      {
        label: "Sistema de Gestión de Terminal (TOS)",
        note: "Las operaciones de terminal siguen en tu TOS. NauticOps añade visibilidad compartida de la escala para todos los implicados.",
      },
      {
        label: "ERP o sistemas administrativos",
        note: "Tus flujos financieros y administrativos no se tocan.",
      },
      {
        label: "Herramientas de mensajería",
        note: "NauticOps no es un chat. Es una capa de coordinación: confirmaciones estructuradas, estado compartido, registro operativo.",
      },
    ],
  },
  credibility: {
    badge: "Validación sectorial",
    title: "Construido con el ecosistema, no fuera de él",
    subtitle:
      "NauticOps se ha desarrollado con aportación directa de operadores portuarios, servicios marítimos y programas de innovación del sector.",
    actorsTitle: "Los actores con los que trabaja",
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
    title: "Primeras conversaciones en marcha en",
    subtitle:
      "Estamos trabajando con operadores portuarios en estas ubicaciones para planificar los primeros pilotos reales.",
    ports: [
      { name: "Vigo", country: "España" },
      { name: "Cádiz", country: "España" },
      { name: "Huelva", country: "España" },
      { name: "Castellón", country: "España" },
    ],
  },
  bottomCta: {
    title: "¿Quieres ver cómo encaja NauticOps en tu operativa portuaria?",
    subtitle:
      "Configuramos la primera escala juntos, en tu puerto, con tus servicios y tus actores. Sin ningún compromiso más allá de esa primera prueba.",
    button: "Solicitar piloto",
  },
  form: {
    badge: "Inicia tu piloto",
    title: "Solicitar un piloto",
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
    disclaimer: "Nos pondremos en contacto en menos de 24 horas para hablar de tu puerto y cómo coordinar juntos la primera escala.",
    errorFallback: "Ha ocurrido un error. Inténtalo de nuevo o escríbenos a info@nauticops.com",
    success: {
      title: "Solicitud recibida",
      message:
        "Nos pondremos en contacto en menos de 24 horas para hablar de tu puerto y cómo coordinar la primera escala juntos.",
    },
  },
};
