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
      context: "Context",
      solution: "Solution",
      howItFits: "How It Fits",
      whoItsFor: "Who It's For",
      useCases: "Use Cases",
      viewPlatform: "View Platform",
      requestDemo: "Request Demo",
    },

    hero: {
      badge: "Real-Time Port Call Coordination",
      title: "Shared Visibility for Every Port Call",
      subtitle:
        "NauticOps brings port authorities, agents, terminals and service providers onto a single coordination layer—complementing your existing systems, not replacing them.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "View Platform",
      stats: {
        portCalls: "Port Calls Coordinated",
        realTime: "Real-Time Updates",
        systemAgnostic: "System Agnostic",
      },
    },

    context: {
      badge: "Current Context",
      title: "A Complex Ecosystem with Many Moving Parts",
      subtitle:
        "Port operations involve multiple stakeholders, systems and service providers—each with their own tools and timelines. Creating a shared, real-time view across this ecosystem remains a key coordination challenge.",
      items: [
        {
          title: "Multiple Stakeholders",
          description:
            "Port authorities, agents, terminals, pilots, tugs and service providers each manage their own data and schedules across different systems.",
        },
        {
          title: "Dynamic Timelines",
          description:
            "ETAs, berth windows and service schedules evolve continuously. Keeping all parties aligned requires timely, synchronized information sharing.",
        },
        {
          title: "Diverse Systems",
          description:
            "Port Community Systems, ERPs, terminal operating systems and other tools each serve a specific purpose. Cross-system visibility is often limited.",
        },
        {
          title: "Growing Complexity",
          description:
            "As trade volumes grow and regulatory demands increase, the need for a shared coordination layer becomes increasingly relevant.",
        },
      ],
    },

    solution: {
      badge: "Our Approach",
      title: "A Coordination Layer That Complements Your Ecosystem",
      subtitle:
        "NauticOps works alongside your existing systems—connecting data and stakeholders to create shared visibility without requiring process changes.",
      features: [
        {
          title: "Complementary by Nature",
          description:
            "Designed to enhance, not replace, your current tools. NauticOps integrates with PCS, ERPs and terminal systems to create a unified view.",
        },
        {
          title: "Synchronized in Real Time",
          description:
            "All stakeholders access the same live data—ETAs, berth assignments, service readiness—reducing the need for manual coordination.",
        },
        {
          title: "Role-Appropriate Access",
          description:
            "Each participant sees the information relevant to their role, with appropriate permissions and data privacy built in.",
        },
      ],
      cardTitle: "Designed to Fit, Not to Compete",
      cardDescription:
        "NauticOps respects your investment in existing infrastructure. It sits alongside your current tools, adding a shared coordination layer that benefits every stakeholder.",
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
        "Getting started is straightforward. NauticOps is designed for easy adoption, fitting into your existing ecosystem without disruption.",
      steps: [
        {
          title: "Connect Your Data",
          description:
            "Link NauticOps to your existing systems via standard APIs or manual input. We work with PCS, ERPs, TOS and more—no migration needed.",
        },
        {
          title: "See a Shared View",
          description:
            "All port call data—ETAs, berth schedules, service status, vessel information—brought together on a single, real-time dashboard.",
        },
        {
          title: "Coordinate Together",
          description:
            "Status updates, timeline changes and notifications reach every relevant stakeholder automatically. Less manual communication, more aligned operations.",
        },
      ],
    },

    whoItsFor: {
      badge: "Who It's For",
      title: "Built for the Entire Port Ecosystem",
      subtitle:
        "NauticOps serves the full range of port stakeholders—from regulatory authorities to operational service providers—with a shared coordination platform.",
      audiences: [
        {
          title: "Port Authorities",
          description:
            "Gain a comprehensive view of all port calls, coordinate vessel traffic and monitor regulatory compliance with real-time visibility.",
        },
        {
          title: "Shipping Agents",
          description:
            "Manage multiple port calls across vessels, track service providers and keep principals informed with live updates.",
        },
        {
          title: "Terminal Operators",
          description:
            "Plan berth allocation, coordinate cargo operations and stay aligned with all stakeholders on vessel timelines.",
        },
        {
          title: "Pilots & Tugs",
          description:
            "View vessel arrivals in advance, confirm service windows and coordinate with other maritime services seamlessly.",
        },
        {
          title: "Shipping Lines",
          description:
            "Track fleet port calls, monitor turnaround times and receive proactive updates on schedule changes.",
        },
        {
          title: "Service Providers",
          description:
            "Receive service requests promptly, confirm availability and update completion status for all parties involved.",
        },
        {
          title: "Technology Integrators",
          description:
            "Leverage open APIs to connect NauticOps with existing port infrastructure and digital ecosystems.",
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
      title: "Real Port Scenarios, Tangible Value",
      subtitle:
        "See how NauticOps supports everyday coordination across the port ecosystem with practical, real-world scenarios.",
      cases: [
        {
          category: "Arrival Coordination",
          title: "Synchronized ETA Updates",
          description:
            "When a vessel's ETA changes, NauticOps notifies pilots, tugs, mooring and the terminal simultaneously—so everyone adjusts from a single, shared timeline.",
          stats: [
            { label: "Coordination Time", value: "-85%" },
            { label: "Alignment Gaps", value: "-60%" },
          ],
        },
        {
          category: "Service Scheduling",
          title: "Aligned Port Services",
          description:
            "When a vessel confirms its berth window, all service providers—fuel, provisions, waste removal—receive their assigned windows. Status updates flow back to the agent and port authority in real time.",
          stats: [
            { label: "Scheduling Delays", value: "-40%" },
            { label: "Confirmation Speed", value: "3×" },
          ],
        },
        {
          category: "Documentation",
          title: "Streamlined Pre-Arrival Workflow",
          description:
            "All pre-arrival documents and clearances tracked in one place. The port authority sees submission status, agents track approvals, and reminders are triggered automatically when needed.",
          stats: [
            { label: "Processing Time", value: "-50%" },
            { label: "Compliance Gaps", value: "-70%" },
          ],
        },
        {
          category: "Performance Visibility",
          title: "Port Operations Insights",
          description:
            "Track turnaround times, berth utilisation and service performance across all port calls. Identify patterns, measure KPIs and generate reports for stakeholders and regulators.",
          stats: [
            { label: "Report Generation", value: "Instant" },
            { label: "Data Accuracy", value: "99%" },
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
            "Developed with input from port authorities, agents and terminal operators worldwide.",
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
    },

    cta: {
      title: "Ready to Explore Shared Port Call Visibility?",
      subtitle:
        "Request a demo to see how NauticOps can complement your existing systems with a shared coordination layer for port operations.",
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
      context: "Contexto",
      solution: "Solución",
      howItFits: "Cómo Encaja",
      whoItsFor: "Para Quién",
      useCases: "Casos de Uso",
      viewPlatform: "Ver Plataforma",
      requestDemo: "Solicitar Demo",
    },

    hero: {
      badge: "Coordinación de Escalas en Tiempo Real",
      title: "Visibilidad Compartida para Cada Escala Portuaria",
      subtitle:
        "NauticOps conecta a autoridades portuarias, agentes, terminales y proveedores de servicios en una capa de coordinación compartida—complementando sus sistemas existentes, sin reemplazarlos.",
      ctaPrimary: "Solicitar una Demo",
      ctaSecondary: "Ver Plataforma",
      stats: {
        portCalls: "Escalas Coordinadas",
        realTime: "Actualizaciones en Tiempo Real",
        systemAgnostic: "Agnóstico de Sistemas",
      },
    },

    context: {
      badge: "Situación Actual",
      title: "Un Ecosistema Complejo con Muchas Partes en Movimiento",
      subtitle:
        "Las operaciones portuarias involucran múltiples actores, sistemas y proveedores de servicios—cada uno con sus propias herramientas y cronogramas. Crear una visión compartida y en tiempo real sigue siendo un desafío clave de coordinación.",
      items: [
        {
          title: "Múltiples Actores",
          description:
            "Autoridades portuarias, agentes, terminales, prácticos, remolcadores y proveedores de servicios gestionan sus propios datos y horarios en sistemas diferentes.",
        },
        {
          title: "Cronogramas Dinámicos",
          description:
            "Los ETAs, ventanas de atraque y horarios de servicios evolucionan continuamente. Mantener a todas las partes alineadas requiere información sincronizada y oportuna.",
        },
        {
          title: "Sistemas Diversos",
          description:
            "Port Community Systems, ERPs, sistemas de terminal y otras herramientas cumplen funciones específicas. La visibilidad cruzada entre sistemas suele ser limitada.",
        },
        {
          title: "Complejidad Creciente",
          description:
            "A medida que crecen los volúmenes de comercio y las exigencias regulatorias, la necesidad de una capa de coordinación compartida se vuelve cada vez más relevante.",
        },
      ],
    },

    solution: {
      badge: "Nuestro Enfoque",
      title: "Una Capa de Coordinación que Complementa su Ecosistema",
      subtitle:
        "NauticOps trabaja junto a sus sistemas existentes—conectando datos y actores para crear visibilidad compartida sin requerir cambios de procesos.",
      features: [
        {
          title: "Complementario por Naturaleza",
          description:
            "Diseñado para mejorar, no reemplazar, sus herramientas actuales. NauticOps se integra con PCS, ERPs y sistemas de terminal para crear una vista unificada.",
        },
        {
          title: "Sincronización en Tiempo Real",
          description:
            "Todos los actores acceden a los mismos datos en vivo—ETAs, asignaciones de atraque, disponibilidad de servicios—reduciendo la necesidad de coordinación manual.",
        },
        {
          title: "Acceso Adecuado al Rol",
          description:
            "Cada participante ve la información relevante para su función, con permisos apropiados y privacidad de datos incorporada.",
        },
      ],
      cardTitle: "Diseñado para Encajar, No para Competir",
      cardDescription:
        "NauticOps respeta su inversión en infraestructura existente. Se sitúa junto a sus herramientas actuales, añadiendo una capa de coordinación compartida que beneficia a todos los actores.",
      benefits: [
        "Funciona junto a sus sistemas actuales",
        "Sin interrupciones a flujos de trabajo establecidos",
        "Desplegable en semanas, no meses",
        "Mejoras de visibilidad inmediatas",
      ],
    },

    howItFits: {
      badge: "Cómo Encaja",
      title: "Tres Pasos hacia la Visibilidad Compartida",
      subtitle:
        "Comenzar es sencillo. NauticOps está diseñado para una adopción fácil, encajando en su ecosistema existente sin disrupciones.",
      steps: [
        {
          title: "Conecte Sus Datos",
          description:
            "Vincule NauticOps a sus sistemas existentes mediante APIs estándar o entrada manual. Trabajamos con PCS, ERPs, TOS y más—sin migración necesaria.",
        },
        {
          title: "Vea una Vista Compartida",
          description:
            "Todos los datos de escala—ETAs, horarios de atraque, estado de servicios, información del buque—reunidos en un único panel en tiempo real.",
        },
        {
          title: "Coordinen Juntos",
          description:
            "Actualizaciones de estado, cambios de cronograma y notificaciones llegan a cada actor relevante automáticamente. Menos comunicación manual, operaciones más alineadas.",
        },
      ],
    },

    whoItsFor: {
      badge: "Para Quién",
      title: "Diseñado para Todo el Ecosistema Portuario",
      subtitle:
        "NauticOps sirve a toda la gama de actores portuarios—desde autoridades reguladoras hasta proveedores de servicios—con una plataforma de coordinación compartida.",
      audiences: [
        {
          title: "Autoridades Portuarias",
          description:
            "Obtenga una vista integral de todas las escalas, coordine el tráfico de buques y supervise el cumplimiento normativo con visibilidad en tiempo real.",
        },
        {
          title: "Agentes Marítimos",
          description:
            "Gestione múltiples escalas en varios buques, haga seguimiento de proveedores de servicios y mantenga informados a sus armadores con actualizaciones en vivo.",
        },
        {
          title: "Operadores de Terminal",
          description:
            "Planifique la asignación de atraques, coordine operaciones de carga y manténgase alineado con todos los actores en los cronogramas de buques.",
        },
        {
          title: "Prácticos y Remolcadores",
          description:
            "Vea las llegadas de buques con anticipación, confirme ventanas de servicio y coordine con otros servicios marítimos de forma fluida.",
        },
        {
          title: "Líneas Navieras",
          description:
            "Realice seguimiento de las escalas de su flota, monitoree tiempos de rotación y reciba actualizaciones proactivas sobre cambios de horario.",
        },
        {
          title: "Proveedores de Servicios",
          description:
            "Reciba solicitudes de servicio oportunamente, confirme disponibilidad y actualice el estado de finalización para todas las partes involucradas.",
        },
        {
          title: "Integradores Tecnológicos",
          description:
            "Aproveche APIs abiertas para conectar NauticOps con la infraestructura portuaria existente y ecosistemas digitales.",
        },
        {
          title: "Socios e Inversores",
          description:
            "Explore programas piloto, alianzas estratégicas y colaboración temprana en coordinación marítima.",
        },
      ],
    },

    useCases: {
      badge: "Casos de Uso",
      title: "Escenarios Portuarios Reales, Valor Tangible",
      subtitle:
        "Vea cómo NauticOps apoya la coordinación cotidiana en el ecosistema portuario con escenarios prácticos y reales.",
      cases: [
        {
          category: "Coordinación de Arribos",
          title: "Actualizaciones de ETA Sincronizadas",
          description:
            "Cuando el ETA de un buque cambia, NauticOps notifica simultáneamente a prácticos, remolcadores, amarradores y la terminal—para que todos se ajusten desde un cronograma compartido.",
          stats: [
            { label: "Tiempo de Coordinación", value: "-85%" },
            { label: "Brechas de Alineación", value: "-60%" },
          ],
        },
        {
          category: "Programación de Servicios",
          title: "Servicios Portuarios Alineados",
          description:
            "Cuando un buque confirma su ventana de atraque, todos los proveedores—combustible, provisiones, residuos—reciben sus ventanas asignadas. Las actualizaciones de estado fluyen al agente y la autoridad portuaria en tiempo real.",
          stats: [
            { label: "Demoras de Programación", value: "-40%" },
            { label: "Velocidad de Confirmación", value: "3×" },
          ],
        },
        {
          category: "Documentación",
          title: "Flujo Pre-Arribo Optimizado",
          description:
            "Todos los documentos y autorizaciones de pre-arribo rastreados en un solo lugar. La autoridad portuaria ve el estado de envío, los agentes rastrean aprobaciones, y los recordatorios se activan automáticamente cuando es necesario.",
          stats: [
            { label: "Tiempo de Procesamiento", value: "-50%" },
            { label: "Brechas de Cumplimiento", value: "-70%" },
          ],
        },
        {
          category: "Visibilidad de Rendimiento",
          title: "Indicadores de Gestión Portuaria",
          description:
            "Rastree tiempos de rotación, utilización de atraques y rendimiento de servicios en todas las escalas. Identifique patrones, mida KPIs y genere informes para actores y reguladores.",
          stats: [
            { label: "Generación de Informes", value: "Instantánea" },
            { label: "Precisión de Datos", value: "99%" },
          ],
        },
      ],
    },

    trust: {
      badge: "Confianza y Ecosistema",
      title: "Diseñado para la Industria Marítima",
      subtitle:
        "NauticOps está diseñado con la seguridad, estándares e integraciones que los actores portuarios esperan.",
      points: [
        {
          title: "Seguridad Empresarial",
          description:
            "Infraestructura conforme a SOC 2 con cifrado de extremo a extremo y controles de acceso basados en roles.",
        },
        {
          title: "Estándares Abiertos",
          description:
            "Construido sobre estándares de datos marítimos (DCSA, S-100) para integración e interoperabilidad fluida.",
        },
        {
          title: "Diseño API-First",
          description:
            "APIs RESTful permiten integración con cualquier PCS, ERP, TOS o sistema marítimo personalizado.",
        },
        {
          title: "Informado por la Industria",
          description:
            "Desarrollado con aportes de autoridades portuarias, agentes y operadores de terminales de todo el mundo.",
        },
      ],
      ecosystemTitle: "Se Integra con Su Ecosistema Existente",
      ecosystemItems: [
        "Port Community Systems",
        "Plataformas ERP",
        "Sistemas Operativos de Terminal",
        "Servicios de Seguimiento de Buques",
        "Proveedores de Datos Marítimos",
      ],
    },

    cta: {
      title: "¿Listo para Explorar la Visibilidad Compartida de Escalas?",
      subtitle:
        "Solicite una demo para ver cómo NauticOps puede complementar sus sistemas existentes con una capa de coordinación compartida para operaciones portuarias.",
      benefits: [
        "Recorrido personalizado de la plataforma",
        "Discusión de sus casos de uso específicos",
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
