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
        portCalls: "Multi-Actor Coordination",
        realTime: "Near Real-Time Shared Updates",
        systemAgnostic: "Designed to Integrate with Existing Systems",
      },
    },

    context: {
      badge: "The Port Today",
      title: "The current port environment",
      subtitle:
        "Each port call involves the coordination of multiple actors working in parallel, including port authorities, agents, terminals, pilots, tug operators, and service providers. Each manages information and processes through their own systems. Achieving a shared, real-time view across all stakeholders continues to be a recurring challenge.",
      items: [
        {
          title: "Multiple stakeholders, multiple systems",
          description:
            "Port authorities, agents, terminals, pilots, tug operators, and service providers manage schedules and data through specialised platforms tailored to their specific roles.",
        },
        {
          title: "Continuously evolving schedules",
          description:
            "ETAs, berth windows, and service schedules are constantly updated. Keeping all stakeholders aligned requires consistent, shared, and up-to-date information.",
        },
        {
          title: "Specialised systems, limited cross-visibility",
          description:
            "Port Community Systems, ERPs, and terminal systems perform essential functions. However, cross-system visibility between them is often partial or fragmented.",
        },
        {
          title: "A growing need for shared coordination",
          description:
            "As volumes, operational complexity, and regulatory requirements increase, the value of a shared coordination layer across stakeholders gains growing relevance.",
        },
      ],
    },

    solution: {
      badge: "Our Approach",
      title: "A Coordination Layer That Works Alongside Existing Systems",
      subtitle:
        "NauticOps connects data and stakeholders to create shared visibility across the port call, without requiring changes to your existing processes or tools.",
      features: [
        {
          title: "Complementary by Design",
          description:
            "NauticOps enhances your current tools instead of replacing them. It integrates with PCS, ERPs and terminal systems to build a unified coordination view.",
        },
        {
          title: "Real-Time Synchronisation",
          description:
            "All stakeholders access the same live data: ETAs, berth assignments and service readiness. Manual coordination is significantly reduced.",
        },
        {
          title: "Role-Based Access",
          description:
            "Each participant sees only the information relevant to their role, with built-in permissions and data privacy.",
        },
      ],
      cardTitle: "Built to Fit, Not to Compete",
      cardDescription:
        "NauticOps respects your existing infrastructure and adds a shared coordination layer alongside your current systems, delivering value to every stakeholder.",
      benefits: [
        "Works alongside your current systems",
        "No disruption to established workflows",
        "Deployable in weeks, not months",
        "Immediate visibility improvements",
      ],
    },

    howItFits: {
      badge: "How It Fits",
      title: "Three Steps Towards a Shared Visibility",
      subtitle:
        "Adoption is straightforward. NauticOps fits into your existing ecosystem without disruption.",
      steps: [
        {
          title: "Connect Your Data",
          description:
            "Connect NauticOps to your systems via standard APIs or manual input. Compatible with PCS, ERPs, TOS and other common systems. No migration required.",
        },
        {
          title: "See a Shared View",
          description:
            "ETAs, berth schedules, service readiness and relevant information are consolidated into a single near real-time view, accessible to all authorised stakeholders.",
        },
        {
          title: "Coordinate Together",
          description:
            "Status updates, schedule changes and notifications are automatically shared with relevant stakeholders. Less manual follow-up, more aligned coordination.",
        },
      ],
    },

    whoItsFor: {
      badge: "Who It's For",
      title: "Designed for the Entire Port Ecosystem",
      subtitle:
        "NauticOps supports all port stakeholders, from regulatory authorities to service providers, through a shared coordination layer.",
      audiences: [
        {
          title: "Port Authorities",
          description:
            "Integrated visibility of port calls, vessel traffic and regulatory compliance, supported by shared, real-time information.",
        },
        {
          title: "Maritime Agents",
          description:
            "Management of multiple port calls and associated services, with coordinated event tracking and updates for shipowners and operators.",
        },
        {
          title: "Terminal Operators",
          description:
            "Berth and operations planning with early visibility of arrivals, services and relevant schedule changes.",
        },
        {
          title: "Pilots and Tug Operators",
          description:
            "Improved anticipation of vessel movements, service windows and seamless coordination with other operational stakeholders.",
        },
        {
          title: "Shipping Lines",
          description:
            "Centralised tracking of fleet port calls, including time monitoring and proactive notifications on operational changes.",
        },
        {
          title: "Service Providers",
          description:
            "Reception of service requests, availability confirmation and real-time status updates shared across all parties.",
        },
        {
          title: "Technology Integrators",
          description:
            "APIs and data flows enabling NauticOps to operate as a complementary coordination layer within existing port infrastructures.",
        },
        {
          title: "Partners and Investors",
          description:
            "Pilot programmes, strategic partnerships and collaboration in the evolution of digital port coordination.",
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
      title: "Looking to improve coordination and visibility across your port calls?",
      subtitle:
        "Request a demo to discover how NauticOps complements your existing systems with a shared coordination layer for port calls.",
      benefits: [
        "Personalised platform walkthrough",
        "Discussion of your specific use cases",
        "Integration assessment with your systems",
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
        disclaimer: "We'll get back to you within 24 hours.",
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
        "NauticOps ofrece una capa de coordinación compartida entre los actores de la escala portuaria, respetando los sistemas y responsabilidades de cada organización. Complementa los sistemas existentes sin interferir en los procesos actuales.",
      ctaPrimary: "Solicitar una Demo",
      ctaSecondary: "Ver Plataforma",
      stats: {
        portCalls: "Coordinación Multiactor",
        realTime: "Actualizaciones Compartidas en Tiempo Casi Real",
        systemAgnostic: "Diseñado para Integrarse con Sistemas Existentes",
      },
    },

    context: {
      badge: "El Puerto Hoy",
      title: "El entorno portuario actual",
      subtitle:
        "Cada escala portuaria implica la coordinación de múltiples actores que operan en paralelo: autoridades, agentes, terminales, prácticos, remolcadores y proveedores de servicios. Cada uno gestiona su información y procesos en sistemas propios. Lograr una visión compartida y actualizada en tiempo real entre todos ellos sigue siendo un desafío habitual.",
      items: [
        {
          title: "Múltiples actores, múltiples sistemas",
          description:
            "Autoridades portuarias, agentes, terminales, prácticos, remolcadores y proveedores de servicios gestionan horarios y datos desde plataformas especializadas, adaptadas a sus funciones específicas.",
        },
        {
          title: "Cronogramas en evolución constante",
          description:
            "Las ETAs, ventanas de atraque y horarios de servicio se actualizan de forma continua. Mantener a todos los actores alineados requiere información coherente, compartida y actualizada.",
        },
        {
          title: "Sistemas especializados, visibilidad transversal limitada",
          description:
            "Los Port Community Systems, ERPs y sistemas de terminal cumplen funciones clave. Sin embargo, la visibilidad transversal entre ellos suele ser parcial o fragmentada.",
        },
        {
          title: "Una necesidad creciente de coordinación compartida",
          description:
            "A medida que aumentan los volúmenes, la complejidad operativa y las exigencias regulatorias, disponer de una capa de coordinación compartida entre actores adquiere una relevancia creciente.",
        },
      ],
    },

    solution: {
      badge: "Nuestro Enfoque",
      title: "Una Capa de Coordinación que Trabaja Junto a los Sistemas Existentes",
      subtitle:
        "NauticOps conecta datos y actores para crear visibilidad compartida a lo largo de la escala portuaria, sin requerir cambios en sus procesos ni en sus herramientas actuales.",
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
            "Cada participante visualiza únicamente la información relevante para su función, con permisos y privacidad de datos incorporados.",
        },
      ],
      cardTitle: "Diseñado para Encajar, No para Competir",
      cardDescription:
        "NauticOps respeta su infraestructura existente y añade una capa de coordinación compartida que se integra junto a sus sistemas actuales, generando valor para todos los actores.",
      benefits: [
        "Funciona junto a sus sistemas actuales",
        "Sin interrupciones en flujos de trabajo establecidos",
        "Desplegable en semanas, no en meses",
        "Mejoras de visibilidad inmediatas",
      ],
    },

    howItFits: {
      badge: "Cómo Encaja",
      title: "Tres Pasos hacia una Visibilidad Compartida",
      subtitle:
        "La adopción es sencilla. NauticOps encaja en su ecosistema existente sin generar disrupciones.",
      steps: [
        {
          title: "Conecte sus Datos",
          description:
            "Conecte NauticOps a sus sistemas mediante APIs estándar o entrada manual. Compatible con PCS, ERPs, TOS y otros sistemas habituales. No requiere migraciones.",
        },
        {
          title: "Vea una Vista Compartida",
          description:
            "ETAs, horarios de atraque, estado de servicios e información relevante se consolidan en un único panel en tiempo casi real, accesible para todas las partes autorizadas.",
        },
        {
          title: "Coordinen Juntos",
          description:
            "Las actualizaciones de estado, cambios de cronograma y notificaciones se distribuyen automáticamente a los actores relevantes. Menos seguimiento manual, mayor coordinación alineada.",
        },
      ],
    },

    whoItsFor: {
      badge: "Para Quién",
      title: "Diseñado para Todo el Ecosistema Portuario",
      subtitle:
        "NauticOps da servicio a todos los actores portuarios, desde autoridades reguladoras hasta proveedores de servicios, mediante una capa de coordinación compartida.",
      audiences: [
        {
          title: "Autoridades Portuarias",
          description:
            "Visión integral de las escalas, del tráfico de buques y del cumplimiento normativo, con información compartida y actualizada en tiempo real.",
        },
        {
          title: "Agentes Marítimos",
          description:
            "Gestión de múltiples escalas y servicios asociados, con seguimiento de eventos y actualizaciones coordinadas para armadores y operadores.",
        },
        {
          title: "Operadores de Terminal",
          description:
            "Planificación de atraques y operaciones con visibilidad anticipada de llegadas, servicios y cambios relevantes en los cronogramas.",
        },
        {
          title: "Prácticos y Remolcadores",
          description:
            "Anticipación de movimientos, ventanas de servicio y coordinación fluida con otros actores operativos del puerto.",
        },
        {
          title: "Líneas Navieras",
          description:
            "Seguimiento centralizado de las escalas de flota, con monitorización de tiempos y notificaciones proactivas ante cambios operativos.",
        },
        {
          title: "Proveedores de Servicios",
          description:
            "Recepción de solicitudes, confirmación de disponibilidad y actualización del estado de los servicios para todas las partes involucradas.",
        },
        {
          title: "Integradores Tecnológicos",
          description:
            "APIs y flujos de datos que permiten integrar NauticOps como una capa complementaria dentro de la infraestructura portuaria existente.",
        },
        {
          title: "Socios e Inversores",
          description:
            "Programas piloto, alianzas estratégicas y colaboración en la evolución de la coordinación digital portuaria.",
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
      title: "¿Le interesa mejorar la coordinación y la visibilidad de sus escalas?",
      subtitle:
        "Solicite una demo para descubrir cómo NauticOps complementa sus sistemas actuales con una capa de coordinación compartida para la gestión de escalas portuarias.",
      benefits: [
        "Recorrido personalizado de la plataforma",
        "Análisis de sus casos de uso específicos",
        "Evaluación de integración con sus sistemas",
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
        disclaimer: "Le responderemos en menos de 24 horas.",
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
