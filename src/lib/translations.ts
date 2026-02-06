export type Language = "en" | "es";

type TranslationSchema = {
  nav: {
    problem: string;
    solution: string;
    howItWorks: string;
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
  problem: {
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
  howItWorks: {
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
    // Navigation
    nav: {
      problem: "Problem",
      solution: "Solution",
      howItWorks: "How It Works",
      whoItsFor: "Who It's For",
      useCases: "Use Cases",
      viewPlatform: "View Platform",
      requestDemo: "Request Demo",
    },

    // Hero Section
    hero: {
      badge: "Real-Time Port Call Coordination",
      title: "Unified Visibility for Every Port Call",
      subtitle:
        "NauticOps connects port authorities, agents, terminals, and service providers on a single coordination platform—without replacing your existing systems.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "View Platform",
      stats: {
        portCalls: "Port Calls Managed",
        realTime: "Real-Time Updates",
        systemAgnostic: "System Agnostic",
      },
    },

    // Problem Section
    problem: {
      badge: "The Challenge",
      title: "Port Call Coordination Is Still Broken",
      subtitle:
        "Despite decades of digital investment, port stakeholders still struggle with fragmented communication and limited real-time visibility.",
      items: [
        {
          title: "Fragmented Information",
          description:
            "Critical updates scattered across emails, calls, and disconnected systems. No single source of truth for port call status.",
        },
        {
          title: "Last-Minute Surprises",
          description:
            "ETA changes, berth reassignments, and service delays communicated too late, causing costly operational disruptions.",
        },
        {
          title: "Coordination Gaps",
          description:
            "Pilots, tugs, mooring, and terminals working from different timelines. Misalignment creates inefficiency and delays.",
        },
        {
          title: "System Silos",
          description:
            "Each stakeholder uses their own tools—PCS, ERPs, spreadsheets. No easy way to share real-time operational data.",
        },
      ],
    },

    // Solution Section
    solution: {
      badge: "The Solution",
      title: "A Coordination Layer That Connects Everything",
      subtitle:
        "NauticOps doesn't replace your systems—it connects them. A lightweight platform that creates shared visibility without changing how you work.",
      features: [
        {
          title: "Non-Invasive Integration",
          description:
            "Connects to your existing PCS, ERP, and TOS systems. No need to replace what already works.",
        },
        {
          title: "Real-Time Sync",
          description:
            "All stakeholders see the same live data—ETAs, berth assignments, service readiness, and more.",
        },
        {
          title: "Role-Based Access",
          description:
            "Each party sees only what's relevant to them, with appropriate permissions and data privacy.",
        },
      ],
      cardTitle: "Complementary by Design",
      cardDescription:
        "Built to enhance your existing infrastructure, not compete with it. NauticOps respects your investment in PCS, ERPs, and operational tools.",
      benefits: [
        "Works alongside your current systems",
        "No disruption to established workflows",
        "Quick deployment in weeks, not months",
        "Immediate visibility improvements",
      ],
    },

    // How It Works Section
    howItWorks: {
      badge: "How It Works",
      title: "Three Steps to Unified Port Operations",
      subtitle:
        "Get started quickly without disrupting your current workflows. NauticOps is designed for fast deployment and immediate value.",
      steps: [
        {
          title: "Connect Your Data",
          description:
            "Link NauticOps to your existing systems via APIs or manual input. We integrate with PCS, ERPs, TOS, and more—no migration required.",
        },
        {
          title: "See Everything in One Place",
          description:
            "All port call data—ETAs, berth schedules, service requests, vessel status—unified on a single, real-time dashboard for all stakeholders.",
        },
        {
          title: "Coordinate in Real Time",
          description:
            "Instant notifications, status updates, and timeline changes visible to everyone who needs them. Reduce calls, emails, and delays.",
        },
      ],
    },

    // Who It's For Section
    whoItsFor: {
      badge: "Who It's For",
      title: "Built for Everyone in the Port Ecosystem",
      subtitle:
        "NauticOps serves the entire maritime community—from port authorities and agents to terminal operators and service providers.",
      audiences: [
        {
          title: "Port Authorities",
          description:
            "Gain oversight of all port calls, coordinate vessel traffic, and ensure regulatory compliance with complete visibility.",
        },
        {
          title: "Shipping Agents",
          description:
            "Manage multiple port calls across vessels, track service providers, and keep principals updated in real time.",
        },
        {
          title: "Terminal Operators",
          description:
            "Plan berth allocation, coordinate loading operations, and sync with all stakeholders on vessel timelines.",
        },
        {
          title: "Pilots & Tugs",
          description:
            "See vessel arrivals early, confirm service windows, and coordinate with other maritime services seamlessly.",
        },
        {
          title: "Shipping Lines",
          description:
            "Track fleet port calls, monitor turnaround times, and get proactive updates on delays or changes.",
        },
        {
          title: "Service Providers",
          description:
            "Receive service requests in time, confirm availability, and update completion status for all parties.",
        },
        {
          title: "System Integrators",
          description:
            "Leverage open APIs to connect NauticOps with existing port infrastructure and digital ecosystems.",
        },
        {
          title: "Industry Partners",
          description:
            "Explore pilot opportunities, strategic partnerships, and early-stage investment in maritime coordination.",
        },
      ],
    },

    // Use Cases Section
    useCases: {
      badge: "Use Cases",
      title: "Real Scenarios, Real Value",
      subtitle:
        "See how NauticOps addresses everyday coordination challenges that cost ports and their stakeholders time and money.",
      cases: [
        {
          category: "Arrival Coordination",
          title: "Real-Time ETA Updates",
          description:
            "A vessel's ETA changes 6 hours before arrival. Instead of dozens of calls and emails, NauticOps instantly notifies pilots, tugs, mooring, and the terminal—everyone adjusts their schedule from a single source.",
          stats: [
            { label: "Communication Time", value: "-85%" },
            { label: "Coordination Errors", value: "-60%" },
          ],
        },
        {
          category: "Service Scheduling",
          title: "Synchronized Port Services",
          description:
            "When a vessel confirms its berth window, all service providers—fuel, provisions, waste removal—receive their assigned windows automatically. Status updates flow back to the agent and port authority in real time.",
          stats: [
            { label: "Service Delays", value: "-40%" },
            { label: "Confirmation Speed", value: "3x" },
          ],
        },
        {
          category: "Documentation",
          title: "Digital Pre-Arrival Workflow",
          description:
            "All pre-arrival documents and clearances tracked in one place. The port authority sees submission status, agents track approvals, and missing items trigger automatic reminders before they cause delays.",
          stats: [
            { label: "Document Processing", value: "-50%" },
            { label: "Compliance Issues", value: "-70%" },
          ],
        },
        {
          category: "Operations Analytics",
          title: "Port Performance Visibility",
          description:
            "Track turnaround times, berth utilization, and service efficiency across all port calls. Identify bottlenecks, measure KPIs, and generate reports for stakeholders and regulators.",
          stats: [
            { label: "Report Generation", value: "Instant" },
            { label: "Data Accuracy", value: "99%" },
          ],
        },
      ],
    },

    // Trust Section
    trust: {
      badge: "Trust & Ecosystem",
      title: "Built for the Maritime Industry",
      subtitle:
        "NauticOps is designed with the security, standards, and integrations that port stakeholders require.",
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
            "RESTful APIs enable integration with any PCS, ERP, TOS, or custom maritime system.",
        },
        {
          title: "Industry Backed",
          description:
            "Developed with input from port authorities, agents, and terminal operators worldwide.",
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

    // CTA Section
    cta: {
      title: "Ready to Improve Port Call Coordination?",
      subtitle:
        "Request a demo to see how NauticOps can create unified visibility for your port operations—without disrupting your existing systems.",
      benefits: [
        "Personalized platform walkthrough",
        "Discussion of your specific use cases",
        "Integration assessment for your systems",
        "Pilot program options",
      ],
      formTitle: "Request a Demo",
      form: {
        name: "Full Name",
        namePlaceholder: "John Smith",
        email: "Work Email",
        emailPlaceholder: "john@company.com",
        company: "Company / Organization",
        companyPlaceholder: "Port of Barcelona",
        role: "Your Role",
        rolePlaceholder: "Select your role",
        roles: {
          portAuthority: "Port Authority",
          shippingAgent: "Shipping Agent",
          terminalOperator: "Terminal Operator",
          shippingLine: "Shipping Line",
          serviceProvider: "Service Provider",
          systemIntegrator: "System Integrator",
          investor: "Investor / Partner",
          other: "Other",
        },
        submit: "Request Demo",
        disclaimer: "We'll get back to you within 24 hours. No spam, ever.",
      },
      success: {
        title: "Thank You!",
        message:
          "We've received your request and will be in touch within 24 hours to schedule your personalized demo.",
      },
    },

    // Footer
    footer: {
      description:
        "Real-time operational coordination for port calls. Connecting stakeholders without replacing existing systems.",
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
    // Navigation
    nav: {
      problem: "Problema",
      solution: "Solución",
      howItWorks: "Cómo Funciona",
      whoItsFor: "Para Quién",
      useCases: "Casos de Uso",
      viewPlatform: "Ver Plataforma",
      requestDemo: "Solicitar Demo",
    },

    // Hero Section
    hero: {
      badge: "Coordinación de Escalas en Tiempo Real",
      title: "Visibilidad Unificada para Cada Escala Portuaria",
      subtitle:
        "NauticOps conecta a autoridades portuarias, agentes, terminales y proveedores de servicios en una única plataforma de coordinación—sin reemplazar sus sistemas existentes.",
      ctaPrimary: "Solicitar una Demo",
      ctaSecondary: "Ver Plataforma",
      stats: {
        portCalls: "Escalas Gestionadas",
        realTime: "Actualizaciones en Tiempo Real",
        systemAgnostic: "Agnóstico de Sistemas",
      },
    },

    // Problem Section
    problem: {
      badge: "El Desafío",
      title: "La Coordinación de Escalas Sigue sin Funcionar",
      subtitle:
        "A pesar de décadas de inversión digital, los actores portuarios todavía luchan con comunicaciones fragmentadas y visibilidad limitada en tiempo real.",
      items: [
        {
          title: "Información Fragmentada",
          description:
            "Actualizaciones críticas dispersas entre correos electrónicos, llamadas y sistemas desconectados. Sin una fuente única de verdad para el estado de la escala.",
        },
        {
          title: "Sorpresas de Última Hora",
          description:
            "Cambios de ETA, reasignaciones de atraque y retrasos en servicios comunicados demasiado tarde, causando costosas interrupciones operativas.",
        },
        {
          title: "Brechas de Coordinación",
          description:
            "Prácticos, remolcadores, amarradores y terminales trabajando con cronogramas diferentes. La desalineación genera ineficiencia y demoras.",
        },
        {
          title: "Sistemas Aislados",
          description:
            "Cada actor utiliza sus propias herramientas—PCS, ERPs, hojas de cálculo. No hay forma fácil de compartir datos operativos en tiempo real.",
        },
      ],
    },

    // Solution Section
    solution: {
      badge: "La Solución",
      title: "Una Capa de Coordinación que lo Conecta Todo",
      subtitle:
        "NauticOps no reemplaza sus sistemas—los conecta. Una plataforma ligera que crea visibilidad compartida sin cambiar su forma de trabajar.",
      features: [
        {
          title: "Integración No Invasiva",
          description:
            "Se conecta a sus sistemas PCS, ERP y TOS existentes. Sin necesidad de reemplazar lo que ya funciona.",
        },
        {
          title: "Sincronización en Tiempo Real",
          description:
            "Todos los actores ven los mismos datos en vivo—ETAs, asignaciones de atraque, disponibilidad de servicios y más.",
        },
        {
          title: "Acceso Basado en Roles",
          description:
            "Cada parte ve solo lo que es relevante para ella, con permisos apropiados y privacidad de datos.",
        },
      ],
      cardTitle: "Complementario por Diseño",
      cardDescription:
        "Diseñado para mejorar su infraestructura existente, no para competir con ella. NauticOps respeta su inversión en PCS, ERPs y herramientas operativas.",
      benefits: [
        "Funciona junto a sus sistemas actuales",
        "Sin interrupciones a flujos de trabajo establecidos",
        "Despliegue rápido en semanas, no meses",
        "Mejoras de visibilidad inmediatas",
      ],
    },

    // How It Works Section
    howItWorks: {
      badge: "Cómo Funciona",
      title: "Tres Pasos hacia Operaciones Portuarias Unificadas",
      subtitle:
        "Comience rápidamente sin interrumpir sus flujos de trabajo actuales. NauticOps está diseñado para un despliegue rápido y valor inmediato.",
      steps: [
        {
          title: "Conecte Sus Datos",
          description:
            "Vincule NauticOps a sus sistemas existentes mediante APIs o entrada manual. Nos integramos con PCS, ERPs, TOS y más—sin migración requerida.",
        },
        {
          title: "Vea Todo en Un Solo Lugar",
          description:
            "Todos los datos de escala—ETAs, horarios de atraque, solicitudes de servicio, estado del buque—unificados en un panel único y en tiempo real para todos los actores.",
        },
        {
          title: "Coordine en Tiempo Real",
          description:
            "Notificaciones instantáneas, actualizaciones de estado y cambios de cronograma visibles para todos los que los necesitan. Reduzca llamadas, correos y demoras.",
        },
      ],
    },

    // Who It's For Section
    whoItsFor: {
      badge: "Para Quién",
      title: "Diseñado para Todo el Ecosistema Portuario",
      subtitle:
        "NauticOps sirve a toda la comunidad marítima—desde autoridades portuarias y agentes hasta operadores de terminales y proveedores de servicios.",
      audiences: [
        {
          title: "Autoridades Portuarias",
          description:
            "Obtenga supervisión de todas las escalas, coordine el tráfico de buques y asegure el cumplimiento normativo con visibilidad completa.",
        },
        {
          title: "Agentes Marítimos",
          description:
            "Gestione múltiples escalas en varios buques, haga seguimiento de proveedores de servicios y mantenga actualizados a sus armadores en tiempo real.",
        },
        {
          title: "Operadores de Terminal",
          description:
            "Planifique la asignación de atraques, coordine operaciones de carga y sincronice con todos los actores en los cronogramas de buques.",
        },
        {
          title: "Prácticos y Remolcadores",
          description:
            "Vea las llegadas de buques con anticipación, confirme ventanas de servicio y coordine con otros servicios marítimos sin problemas.",
        },
        {
          title: "Líneas Navieras",
          description:
            "Realice seguimiento de las escalas de su flota, monitoree tiempos de rotación y reciba actualizaciones proactivas sobre demoras o cambios.",
        },
        {
          title: "Proveedores de Servicios",
          description:
            "Reciba solicitudes de servicio a tiempo, confirme disponibilidad y actualice el estado de finalización para todas las partes.",
        },
        {
          title: "Integradores de Sistemas",
          description:
            "Aproveche APIs abiertas para conectar NauticOps con la infraestructura portuaria existente y ecosistemas digitales.",
        },
        {
          title: "Socios e Inversores",
          description:
            "Explore oportunidades piloto, alianzas estratégicas e inversión en etapa temprana en coordinación marítima.",
        },
      ],
    },

    // Use Cases Section
    useCases: {
      badge: "Casos de Uso",
      title: "Escenarios Reales, Valor Real",
      subtitle:
        "Vea cómo NauticOps aborda los desafíos de coordinación cotidianos que cuestan tiempo y dinero a los puertos y sus actores.",
      cases: [
        {
          category: "Coordinación de Arribos",
          title: "Actualizaciones de ETA en Tiempo Real",
          description:
            "El ETA de un buque cambia 6 horas antes de su llegada. En lugar de decenas de llamadas y correos, NauticOps notifica instantáneamente a prácticos, remolcadores, amarradores y la terminal—todos ajustan su horario desde una única fuente.",
          stats: [
            { label: "Tiempo de Comunicación", value: "-85%" },
            { label: "Errores de Coordinación", value: "-60%" },
          ],
        },
        {
          category: "Programación de Servicios",
          title: "Servicios Portuarios Sincronizados",
          description:
            "Cuando un buque confirma su ventana de atraque, todos los proveedores de servicios—combustible, provisiones, residuos—reciben sus ventanas asignadas automáticamente. Las actualizaciones de estado fluyen de vuelta al agente y la autoridad portuaria en tiempo real.",
          stats: [
            { label: "Demoras en Servicios", value: "-40%" },
            { label: "Velocidad de Confirmación", value: "3x" },
          ],
        },
        {
          category: "Documentación",
          title: "Flujo Digital Pre-Arribo",
          description:
            "Todos los documentos y autorizaciones de pre-arribo rastreados en un solo lugar. La autoridad portuaria ve el estado de envío, los agentes rastrean aprobaciones, y los elementos faltantes activan recordatorios automáticos antes de causar demoras.",
          stats: [
            { label: "Procesamiento de Documentos", value: "-50%" },
            { label: "Problemas de Cumplimiento", value: "-70%" },
          ],
        },
        {
          category: "Analítica Operativa",
          title: "Visibilidad del Rendimiento Portuario",
          description:
            "Rastree tiempos de rotación, utilización de atraques y eficiencia de servicios en todas las escalas. Identifique cuellos de botella, mida KPIs y genere informes para actores y reguladores.",
          stats: [
            { label: "Generación de Informes", value: "Instantánea" },
            { label: "Precisión de Datos", value: "99%" },
          ],
        },
      ],
    },

    // Trust Section
    trust: {
      badge: "Confianza y Ecosistema",
      title: "Diseñado para la Industria Marítima",
      subtitle:
        "NauticOps está diseñado con la seguridad, estándares e integraciones que los actores portuarios requieren.",
      points: [
        {
          title: "Seguridad Empresarial",
          description:
            "Infraestructura conforme a SOC 2 con cifrado de extremo a extremo y controles de acceso basados en roles.",
        },
        {
          title: "Estándares Abiertos",
          description:
            "Construido sobre estándares de datos marítimos (DCSA, S-100) para integración e interoperabilidad sin problemas.",
        },
        {
          title: "Diseño API-First",
          description:
            "APIs RESTful permiten integración con cualquier PCS, ERP, TOS o sistema marítimo personalizado.",
        },
        {
          title: "Respaldado por la Industria",
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

    // CTA Section
    cta: {
      title: "¿Listo para Mejorar la Coordinación de Escalas?",
      subtitle:
        "Solicite una demo para ver cómo NauticOps puede crear visibilidad unificada para sus operaciones portuarias—sin interrumpir sus sistemas existentes.",
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
          systemIntegrator: "Integrador de Sistemas",
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

    // Footer
    footer: {
      description:
        "Coordinación operativa en tiempo real para escalas portuarias. Conectando actores sin reemplazar sistemas existentes.",
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
