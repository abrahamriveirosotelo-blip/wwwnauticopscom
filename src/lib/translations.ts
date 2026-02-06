export type Language = "en" | "es";

type TranslationSchema = {
  nav: {
    context: string;
    solution: string;
    howItFits: string;
    whoItsFor: string;
    useCases: string;
    viewPlatform: string;
    requestDemo: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      portCalls: string;
      realTime: string;
      systemAgnostic: string;
    };
  };
  context: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
  };
  solution: {
    badge: string;
    title: string;
    subtitle: string;
    features: Array<{ title: string; description: string }>;
    cardTitle: string;
    cardDescription: string;
    benefits: string[];
  };
  howItFits: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string }>;
  };
  whoItsFor: {
    badge: string;
    title: string;
    subtitle: string;
    audiences: Array<{ title: string; description: string }>;
  };
  useCases: {
    badge: string;
    title: string;
    subtitle: string;
    cases: Array<{
      category: string;
      title: string;
      description: string;
      stats: Array<{ label: string; value: string }>;
    }>;
  };
  trust: {
    badge: string;
    title: string;
    subtitle: string;
    points: Array<{ title: string; description: string }>;
    ecosystemTitle: string;
    ecosystemItems: string[];
    backedBy: string;
    backedByItems: string[];
  };
  cta: {
    title: string;
    subtitle: string;
    benefits: string[];
    formTitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      role: string;
      rolePlaceholder: string;
      roles: {
        portAuthority: string;
        shippingAgent: string;
        terminalOperator: string;
        shippingLine: string;
        serviceProvider: string;
        systemIntegrator: string;
        investor: string;
        other: string;
      };
      submit: string;
      disclaimer: string;
    };
    success: {
      title: string;
      message: string;
    };
  };
  footer: {
    description: string;
    product: string;
    company: string;
    resources: string;
    legal: string;
    links: {
      features: string;
      useCases: string;
      integrations: string;
      pricing: string;
      aboutUs: string;
      careers: string;
      contact: string;
      partners: string;
      documentation: string;
      apiReference: string;
      blog: string;
      caseStudies: string;
      privacyPolicy: string;
      termsOfService: string;
      security: string;
    };
    copyright: string;
    tagline: string;
  };
};

export const translations: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      context: "The Port Today",
      solution: "Solution",
      howItFits: "How It Fits",
      whoItsFor: "Who It's For",
      useCases: "Use Cases",
      viewPlatform: "View Platform",
      requestDemo: "Request Demo",
    },

    hero: {
      badge: "Port Call Coordination Platform",
      title: "Shared Visibility for Every Port Call",
      subtitle:
        "NauticOps provides a shared coordination layer across the different actors involved in a port call, while respecting the systems and responsibilities of each organization. It complements existing systems, without replacing them or interfering with current processes.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "View Platform",
      stats: {
        portCalls: "Port Calls Coordinated",
        realTime: "Real-Time Updates",
        systemAgnostic: "System Agnostic",
      },
    },

    context: {
      badge: "The Port Today",
      title: "Today's Port Ecosystem",
      subtitle:
        "Every port call involves multiple actors working in parallel: authorities, agents, terminals, pilots, tugs and service providers. Each operates on their own systems and timelines. A shared, real-time view across all of them is still uncommon.",
      items: [
        {
          title: "Many Actors, Many Systems",
          description:
            "Port authorities, agents, terminals, pilots, tugs and service providers each manage their own schedules and data across separate tools.",
        },
        {
          title: "Timelines That Keep Moving",
          description:
            "ETAs, berth windows and service schedules change constantly. Keeping every party aligned requires timely and synchronized information.",
        },
        {
          title: "Specialised Tools, Limited Cross-Visibility",
          description:
            "Port Community Systems, ERPs and terminal operating systems each serve a clear purpose. Visibility across them, however, is often limited.",
        },
        {
          title: "A Growing Need for Coordination",
          description:
            "As trade volumes rise and regulatory requirements expand, the value of a shared coordination layer becomes increasingly clear.",
        },
      ],
    },

    solution: {
      badge: "Our Approach",
      title: "A Coordination Layer That Works Alongside Your Systems",
      subtitle:
        "NauticOps connects data and stakeholders to create shared visibility across the port call, without requiring changes to your existing processes.",
      features: [
        {
          title: "Complementary by Design",
          description:
            "NauticOps enhances your current tools instead of replacing them. It integrates with PCS, ERPs and terminal systems to build a unified coordination view.",
        },
        {
          title: "Real-Time Synchronisation",
          description:
            "All stakeholders access the same live data: ETAs, berth assignments and service readiness. Manual coordination is reduced significantly.",
        },
        {
          title: "Role-Based Access",
          description:
            "Each participant sees only the information relevant to their role, with built-in permissions and data privacy.",
        },
      ],
      cardTitle: "Built to Fit, Not to Compete",
      cardDescription:
        "NauticOps respects your existing infrastructure. It adds a shared coordination layer alongside your current tools, delivering value to every stakeholder.",
      benefits: [
        "Works alongside your current systems",
        "No disruption to established workflows",
        "Deployable in weeks, not months",
        "Immediate visibility improvements",
      ],
    },

    howItFits: {
      badge: "How It Fits",
      title: "Three Steps to Shared Visibility",
      subtitle:
        "Getting started is simple. NauticOps fits into your existing ecosystem without disruption.",
      steps: [
        {
          title: "Connect Your Data",
          description:
            "Link NauticOps to your systems via standard APIs or manual input. Compatible with PCS, ERPs, TOS and more. No migration required.",
        },
        {
          title: "See a Shared View",
          description:
            "ETAs, berth schedules, service status and vessel information come together on a single, real-time dashboard accessible to all parties.",
        },
        {
          title: "Coordinate Together",
          description:
            "Status updates, timeline changes and notifications reach every relevant stakeholder automatically. Less manual follow-up, more aligned coordination.",
        },
      ],
    },

    whoItsFor: {
      badge: "Who It's For",
      title: "Built for the Entire Port Ecosystem",
      subtitle:
        "NauticOps serves all port stakeholders, from regulatory authorities to service providers, with a shared coordination platform.",
      audiences: [
        {
          title: "Port Authorities",
          description:
            "A comprehensive view of all port calls, vessel traffic coordination and regulatory compliance with real-time visibility.",
        },
        {
          title: "Shipping Agents",
          description:
            "Manage multiple port calls, track service providers and keep principals informed with live updates across vessels.",
        },
        {
          title: "Terminal Operators",
          description:
            "Plan berth allocation, coordinate cargo handling and stay aligned with stakeholders on vessel timelines.",
        },
        {
          title: "Pilots & Tugs",
          description:
            "View arrivals in advance, confirm service windows and coordinate seamlessly with other maritime services.",
        },
        {
          title: "Shipping Lines",
          description:
            "Track fleet port calls, monitor turnaround times and receive proactive updates on schedule changes.",
        },
        {
          title: "Service Providers",
          description:
            "Receive service requests on time, confirm availability and update completion status for all parties involved.",
        },
        {
          title: "Technology Integrators",
          description:
            "Use open APIs to connect NauticOps with existing port infrastructure and digital ecosystems.",
        },
        {
          title: "Industry Partners",
          description:
            "Explore pilot programmes, strategic partnerships and early-stage collaboration in maritime coordination.",
        },
      ],
    },

    useCases: {
      badge: "Use Cases",
      title: "Real Port Scenarios, Tangible Results",
      subtitle:
        "Practical examples of how NauticOps supports daily coordination across the port ecosystem.",
      cases: [
        {
          category: "Arrival Coordination",
          title: "Synchronized ETA Updates",
          description:
            "When a vessel's ETA changes, pilots, tugs, mooring and the terminal are all notified at once, so everyone adjusts from a single shared timeline.",
          stats: [
            { label: "Coordination effort", value: "Significantly reduced" },
            { label: "Alignment", value: "Real-time" },
          ],
        },
        {
          category: "Service Scheduling",
          title: "Aligned Port Services",
          description:
            "Once a vessel confirms its berth window, all service providers receive their assigned slots. Status updates flow back to the agent and port authority in real time.",
          stats: [
            { label: "Scheduling time", value: "Reduced" },
            { label: "Confirmation speed", value: "Up to 3x faster" },
          ],
        },
        {
          category: "Documentation",
          title: "Streamlined Pre-Arrival Workflow",
          description:
            "Pre-arrival documents and clearances are tracked in one place. The port authority sees submission status, agents track approvals, and reminders trigger automatically.",
          stats: [
            { label: "Processing time", value: "Reduced" },
            { label: "Compliance tracking", value: "Centralised" },
          ],
        },
        {
          category: "Performance Visibility",
          title: "Port Performance Insights",
          description:
            "Turnaround times, berth utilisation and service performance across all port calls. Identify patterns, measure KPIs and generate reports for stakeholders.",
          stats: [
            { label: "Report generation", value: "On demand" },
            { label: "Data consolidation", value: "Automated" },
          ],
        },
      ],
    },

    trust: {
      badge: "Trust & Ecosystem",
      title: "Built for the Maritime Industry",
      subtitle:
        "NauticOps is designed with the security, standards and integrations that port stakeholders expect.",
      points: [
        {
          title: "Enterprise Security",
          description:
            "SOC 2 compliant infrastructure with end-to-end encryption and role-based access controls.",
        },
        {
          title: "Open Standards",
          description:
            "Built on maritime data standards (DCSA, S-100) for seamless integration and interoperability.",
        },
        {
          title: "API-First Design",
          description:
            "RESTful APIs enable integration with any PCS, ERP, TOS or custom maritime system.",
        },
        {
          title: "Industry Informed",
          description:
            "Developed with input from port authorities, agents and terminal operators.",
        },
      ],
      ecosystemTitle: "Integrates With Your Existing Ecosystem",
      ecosystemItems: [
        "Port Community Systems",
        "ERP Platforms",
        "Terminal Operating Systems",
        "Vessel Tracking Services",
        "Maritime Data Providers",
      ],
      backedBy: "Supported and accompanied by leading innovation and port ecosystem programmes.",
      backedByItems: [
        "La Lonja Tech",
        "Incubazul / BlueCore",
      ],
    },

    cta: {
      title: "Interested in Shared Port Call Visibility?",
      subtitle:
        "Request a demo to see how NauticOps complements your existing systems with a shared coordination layer for port calls.",
      benefits: [
        "Personalised platform walkthrough",
        "Discussion of your specific use cases",
        "Integration assessment for your systems",
        "Pilot programme options",
      ],
      formTitle: "Request a Demo",
      form: {
        name: "Full Name",
        namePlaceholder: "John Smith",
        email: "Work Email",
        emailPlaceholder: "john@company.com",
        company: "Company / Organisation",
        companyPlaceholder: "Port of Barcelona",
        role: "Your Role",
        rolePlaceholder: "Select your role",
        roles: {
          portAuthority: "Port Authority",
          shippingAgent: "Shipping Agent",
          terminalOperator: "Terminal Operator",
          shippingLine: "Shipping Line",
          serviceProvider: "Service Provider",
          systemIntegrator: "Technology Integrator",
          investor: "Investor / Partner",
          other: "Other",
        },
        submit: "Request Demo",
        disclaimer: "We'll respond within 24 hours. No spam, ever.",
      },
      success: {
        title: "Thank You!",
        message:
          "We've received your request and will be in touch within 24 hours to schedule your personalised demo.",
      },
    },

    footer: {
      description:
        "Shared coordination for port calls. Connecting stakeholders alongside their existing systems.",
      product: "Product",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      links: {
        features: "Features",
        useCases: "Use Cases",
        integrations: "Integrations",
        pricing: "Pricing",
        aboutUs: "About Us",
        careers: "Careers",
        contact: "Contact",
        partners: "Partners",
        documentation: "Documentation",
        apiReference: "API Reference",
        blog: "Blog",
        caseStudies: "Case Studies",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        security: "Security",
      },
      copyright: "All rights reserved.",
      tagline: "Designed for the maritime industry.",
    },
  },

  es: {
    nav: {
      context: "El Puerto Hoy",
      solution: "Solución",
      howItFits: "Cómo Encaja",
      whoItsFor: "Para Quién",
      useCases: "Casos de Uso",
      viewPlatform: "Ver Plataforma",
      requestDemo: "Solicitar Demo",
    },

    hero: {
      badge: "Plataforma de Coordinación de Escalas",
      title: "Coordinación y Visibilidad Compartida en Cada Escala Portuaria",
      subtitle:
        "NauticOps proporciona una capa de coordinación compartida entre los distintos actores involucrados en una escala portuaria, respetando los sistemas y responsabilidades de cada organización. Complementa los sistemas existentes, sin reemplazarlos ni interferir con los procesos actuales.",
      ctaPrimary: "Solicitar una Demo",
      ctaSecondary: "Ver Plataforma",
      stats: {
        portCalls: "Escalas Coordinadas",
        realTime: "Actualizaciones en Tiempo Real",
        systemAgnostic: "Agnóstico de Sistemas",
      },
    },

    context: {
      badge: "El Puerto Hoy",
      title: "El Entorno Portuario Actual",
      subtitle:
        "Cada escala implica múltiples actores trabajando en paralelo: autoridades, agentes, terminales, prácticos, remolcadores y proveedores de servicios. Cada uno opera con sus propios sistemas y cronogramas. Una visión compartida y en tiempo real entre todos ellos sigue siendo poco habitual.",
      items: [
        {
          title: "Muchos Actores, Muchos Sistemas",
          description:
            "Autoridades portuarias, agentes, terminales, prácticos, remolcadores y proveedores de servicios gestionan sus horarios y datos en herramientas separadas.",
        },
        {
          title: "Cronogramas en Constante Cambio",
          description:
            "Los ETAs, las ventanas de atraque y los horarios de servicios cambian continuamente. Mantener a todas las partes alineadas requiere información sincronizada y oportuna.",
        },
        {
          title: "Herramientas Especializadas, Visibilidad Cruzada Limitada",
          description:
            "Los Port Community Systems, ERPs y sistemas de terminal cumplen funciones claras. Sin embargo, la visibilidad transversal entre ellos suele ser limitada.",
        },
        {
          title: "Una Necesidad Creciente de Coordinación",
          description:
            "A medida que crecen los volúmenes de comercio y las exigencias regulatorias, el valor de una capa de coordinación compartida resulta cada vez más evidente.",
        },
      ],
    },

    solution: {
      badge: "Nuestro Enfoque",
      title: "Una Capa de Coordinación que Trabaja Junto a sus Sistemas",
      subtitle:
        "NauticOps conecta datos y actores para crear visibilidad compartida a lo largo de la escala, sin requerir cambios en sus procesos actuales.",
      features: [
        {
          title: "Complementario por Diseño",
          description:
            "NauticOps mejora sus herramientas actuales en lugar de reemplazarlas. Se integra con PCS, ERPs y sistemas de terminal para construir una vista de coordinación unificada.",
        },
        {
          title: "Sincronización en Tiempo Real",
          description:
            "Todos los actores acceden a los mismos datos en vivo: ETAs, asignaciones de atraque y disponibilidad de servicios. La coordinación manual se reduce de forma significativa.",
        },
        {
          title: "Acceso Basado en Roles",
          description:
            "Cada participante ve únicamente la información relevante para su función, con permisos y privacidad de datos incorporados.",
        },
      ],
      cardTitle: "Diseñado para Encajar, No para Competir",
      cardDescription:
        "NauticOps respeta su infraestructura existente. Añade una capa de coordinación compartida junto a sus herramientas actuales, generando valor para todos los actores.",
      benefits: [
        "Funciona junto a sus sistemas actuales",
        "Sin interrupciones a flujos de trabajo establecidos",
        "Desplegable en semanas, no en meses",
        "Mejoras de visibilidad inmediatas",
      ],
    },

    howItFits: {
      badge: "Cómo Encaja",
      title: "Tres Pasos hacia la Visibilidad Compartida",
      subtitle:
        "Comenzar es sencillo. NauticOps encaja en su ecosistema existente sin disrupciones.",
      steps: [
        {
          title: "Conecte sus Datos",
          description:
            "Vincule NauticOps a sus sistemas mediante APIs estándar o entrada manual. Compatible con PCS, ERPs, TOS y más. Sin migración necesaria.",
        },
        {
          title: "Vea una Vista Compartida",
          description:
            "ETAs, horarios de atraque, estado de servicios e información del buque se reúnen en un único panel en tiempo real accesible para todas las partes.",
        },
        {
          title: "Coordinen Juntos",
          description:
            "Actualizaciones de estado, cambios de cronograma y notificaciones llegan a cada actor relevante de forma automática. Menos seguimiento manual, más coordinación alineada.",
        },
      ],
    },

    whoItsFor: {
      badge: "Para Quién",
      title: "Diseñado para Todo el Ecosistema Portuario",
      subtitle:
        "NauticOps sirve a todos los actores portuarios, desde autoridades reguladoras hasta proveedores de servicios, con una plataforma de coordinación compartida.",
      audiences: [
        {
          title: "Autoridades Portuarias",
          description:
            "Vista integral de todas las escalas, coordinación del tráfico de buques y seguimiento del cumplimiento normativo con visibilidad en tiempo real.",
        },
        {
          title: "Agentes Marítimos",
          description:
            "Gestión de múltiples escalas, seguimiento de proveedores de servicios e información actualizada para armadores en tiempo real.",
        },
        {
          title: "Operadores de Terminal",
          description:
            "Planificación de atraques, coordinación de operaciones de carga y alineación con todos los actores en los cronogramas de buques.",
        },
        {
          title: "Prácticos y Remolcadores",
          description:
            "Visualización anticipada de llegadas, confirmación de ventanas de servicio y coordinación fluida con otros servicios marítimos.",
        },
        {
          title: "Líneas Navieras",
          description:
            "Seguimiento de escalas de flota, monitoreo de tiempos de rotación y actualizaciones proactivas sobre cambios de horario.",
        },
        {
          title: "Proveedores de Servicios",
          description:
            "Recepción oportuna de solicitudes, confirmación de disponibilidad y actualización del estado de finalización para todas las partes.",
        },
        {
          title: "Integradores Tecnológicos",
          description:
            "APIs abiertas para conectar NauticOps con la infraestructura portuaria existente y ecosistemas digitales.",
        },
        {
          title: "Socios e Inversores",
          description:
            "Programas piloto, alianzas estratégicas y colaboración temprana en coordinación marítima.",
        },
      ],
    },

    useCases: {
      badge: "Casos de Uso",
      title: "Escenarios Portuarios Reales, Resultados Tangibles",
      subtitle:
        "Ejemplos prácticos de cómo NauticOps facilita la coordinación diaria en el ecosistema portuario.",
      cases: [
        {
          category: "Coordinación de Arribos",
          title: "Actualizaciones de ETA Sincronizadas",
          description:
            "Cuando el ETA de un buque cambia, prácticos, remolcadores, amarradores y la terminal son notificados simultáneamente, de modo que todos se ajustan desde un cronograma compartido.",
          stats: [
            { label: "Esfuerzo de coordinación", value: "Significativamente reducido" },
            { label: "Alineación", value: "En tiempo real" },
          ],
        },
        {
          category: "Programación de Servicios",
          title: "Servicios Portuarios Alineados",
          description:
            "Cuando un buque confirma su ventana de atraque, todos los proveedores reciben sus slots asignados. Las actualizaciones de estado fluyen al agente y la autoridad portuaria en tiempo real.",
          stats: [
            { label: "Tiempo de programación", value: "Reducido" },
            { label: "Velocidad de confirmación", value: "Hasta 3x más rápida" },
          ],
        },
        {
          category: "Documentación",
          title: "Flujo Pre-Arribo Simplificado",
          description:
            "Documentos y autorizaciones de pre-arribo centralizados en un solo lugar. La autoridad portuaria ve el estado de envío, los agentes rastrean aprobaciones y los recordatorios se activan automáticamente.",
          stats: [
            { label: "Tiempo de procesamiento", value: "Reducido" },
            { label: "Seguimiento de cumplimiento", value: "Centralizado" },
          ],
        },
        {
          category: "Visibilidad de Rendimiento",
          title: "Indicadores de Gestión Portuaria",
          description:
            "Tiempos de rotación, utilización de atraques y rendimiento de servicios en todas las escalas. Identifique patrones, mida KPIs y genere informes para actores y reguladores.",
          stats: [
            { label: "Generación de informes", value: "Bajo demanda" },
            { label: "Consolidación de datos", value: "Automatizada" },
          ],
        },
      ],
    },

    trust: {
      badge: "Confianza y Ecosistema",
      title: "Diseñado para la Industria Marítima",
      subtitle:
        "NauticOps está diseñado con la seguridad, los estándares y las integraciones que los actores portuarios necesitan.",
      points: [
        {
          title: "Seguridad Empresarial",
          description:
            "Infraestructura conforme a SOC 2 con cifrado de extremo a extremo y controles de acceso basados en roles.",
        },
        {
          title: "Estándares Abiertos",
          description:
            "Construido sobre estándares de datos marítimos (DCSA, S-100) para integración e interoperabilidad.",
        },
        {
          title: "Diseño API-First",
          description:
            "APIs RESTful para integración con cualquier PCS, ERP, TOS o sistema marítimo personalizado.",
        },
        {
          title: "Informado por la Industria",
          description:
            "Desarrollado con aportes de autoridades portuarias, agentes y operadores de terminales.",
        },
      ],
      ecosystemTitle: "Se Integra con su Ecosistema Existente",
      ecosystemItems: [
        "Port Community Systems",
        "Plataformas ERP",
        "Sistemas Operativos de Terminal",
        "Servicios de Seguimiento de Buques",
        "Proveedores de Datos Marítimos",
      ],
      backedBy: "Acompañado y respaldado por programas líderes de innovación y ecosistema portuario.",
      backedByItems: [
        "La Lonja Tech",
        "Incubazul / BlueCore",
      ],
    },

    cta: {
      title: "¿Le interesa la visibilidad compartida de escalas?",
      subtitle:
        "Solicite una demo para ver cómo NauticOps complementa sus sistemas existentes con una capa de coordinación compartida para escalas portuarias.",
      benefits: [
        "Recorrido personalizado de la plataforma",
        "Análisis de sus casos de uso específicos",
        "Evaluación de integración para sus sistemas",
        "Opciones de programa piloto",
      ],
      formTitle: "Solicitar una Demo",
      form: {
        name: "Nombre Completo",
        namePlaceholder: "Juan García",
        email: "Correo Electrónico Laboral",
        emailPlaceholder: "juan@empresa.com",
        company: "Empresa / Organización",
        companyPlaceholder: "Puerto de Barcelona",
        role: "Su Rol",
        rolePlaceholder: "Seleccione su rol",
        roles: {
          portAuthority: "Autoridad Portuaria",
          shippingAgent: "Agente Marítimo",
          terminalOperator: "Operador de Terminal",
          shippingLine: "Línea Naviera",
          serviceProvider: "Proveedor de Servicios",
          systemIntegrator: "Integrador Tecnológico",
          investor: "Inversor / Socio",
          other: "Otro",
        },
        submit: "Solicitar Demo",
        disclaimer: "Le responderemos en menos de 24 horas. Sin spam, nunca.",
      },
      success: {
        title: "¡Gracias!",
        message:
          "Hemos recibido su solicitud y nos pondremos en contacto en menos de 24 horas para programar su demo personalizada.",
      },
    },

    footer: {
      description:
        "Coordinación compartida para escalas portuarias. Conectando actores junto a sus sistemas existentes.",
      product: "Producto",
      company: "Empresa",
      resources: "Recursos",
      legal: "Legal",
      links: {
        features: "Características",
        useCases: "Casos de Uso",
        integrations: "Integraciones",
        pricing: "Precios",
        aboutUs: "Sobre Nosotros",
        careers: "Carreras",
        contact: "Contacto",
        partners: "Socios",
        documentation: "Documentación",
        apiReference: "Referencia API",
        blog: "Blog",
        caseStudies: "Casos de Éxito",
        privacyPolicy: "Política de Privacidad",
        termsOfService: "Términos de Servicio",
        security: "Seguridad",
      },
      copyright: "Todos los derechos reservados.",
      tagline: "Diseñado para la industria marítima.",
    },
  },
};

export type Translations = TranslationSchema;
