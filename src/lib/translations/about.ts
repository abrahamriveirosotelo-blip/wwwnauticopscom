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
  title: "Built from Real Port Operations",
  subtitle:
    "NauticOps is built from real port operations and applied technology. We are a small, complementary team focused on solving real coordination challenges during port calls, connecting stakeholders without disrupting existing systems.",
  roleAtNauticOps: "Role at NauticOps",
  readMore: "Read more",
  readLess: "Read less",
  members: [
    {
      name: "Abraham Riveiro Sotelo",
      role: "Founder & CEO – NauticOps",
      tags: "Smart Port Operations · Maritime Digitalization · Deck Officer",
      shortBio:
        "Founder of NauticOps and maritime professional with hands-on experience in vessel operations and port calls. Leads product vision grounded in real port workflows and stakeholder coordination.",
      fullBio: [
        "Abraham is the founder of NauticOps and a merchant marine officer with experience onboard merchant and oceanographic vessels. His background combines real maritime operations with applied digitalization in the port environment.",
        "NauticOps was born from first-hand experience with daily port call friction: misalignment between actors, last-minute changes, lack of shared visibility and reliance on calls and emails. His role focuses on turning these real operational needs into a practical, easy-to-adopt product aligned with how ports work today.",
      ],
      responsibilities: [
        "Product vision and use case definition",
        "Relationships with port stakeholders and incubators",
        "Operational validation and pilots",
        "Strategy and business development",
        "Team and partner coordination",
      ],
    },
    {
      name: "Jose Ramón Cobián Fernández",
      role: "CTO – NauticOps",
      tags: "Mathematics · Computer Science · Data & Systems Engineering",
      shortBio:
        "CTO of NauticOps with a strong background in mathematics, computer science and data analysis. Responsible for transforming port operational requirements into a robust and scalable technical platform.",
      fullBio: [
        "Jose Ramón brings to NauticOps a strong analytical and technical profile, with experience in data-driven systems, quantitative research and technology development across demanding sectors such as energy, banking and technology consulting.",
        "At NauticOps, he leads the technical architecture and development of the platform, ensuring reliability, structure and scalability while keeping a practical, operations-focused approach.",
      ],
      responsibilities: [
        "Technical architecture and system design",
        "Backend development and data logic",
        "Operational data modeling and metrics",
        "Integrations and scalability",
        "Technical support for pilots and validations",
      ],
    },
  ],
};

export const aboutEs: AboutTranslations["about"] = {
  badge: "Sobre Nosotros",
  title: "Construido desde la Operativa Real del Puerto",
  subtitle:
    "NauticOps nace desde la operativa real del puerto y la tecnología aplicada con criterio. Somos un equipo pequeño, complementario y enfocado en resolver problemas reales de coordinación en escalas portuarias, conectando a los actores sin alterar sus sistemas actuales.",
  roleAtNauticOps: "Rol en NauticOps",
  readMore: "Leer más",
  readLess: "Leer menos",
  members: [
    {
      name: "Abraham Riveiro Sotelo",
      role: "Founder & CEO – NauticOps",
      tags: "Smart Port Operations · Maritime Digitalization · Deck Officer",
      shortBio:
        "Fundador de NauticOps y profesional marítimo con experiencia directa en la operativa de buques y escalas portuarias. Lidera la visión del producto desde el conocimiento del terreno y la coordinación entre actores portuarios.",
      fullBio: [
        "Abraham es fundador de NauticOps y marino mercante con experiencia como oficial de puente en buques mercantes y oceanográficos. Su trayectoria combina operativa marítima real con digitalización aplicada al entorno portuario.",
        "NauticOps surge de su experiencia directa viviendo las fricciones diarias en una escala: descoordinación, cambios de última hora, falta de visibilidad compartida y dependencia excesiva de llamadas y correos. Su rol se centra en traducir esas necesidades reales en un producto útil, sencillo de adoptar y alineado con cómo trabajan hoy los puertos.",
      ],
      responsibilities: [
        "Visión de producto y definición de casos de uso",
        "Relación con actores portuarios e incubadoras",
        "Validación operativa y pilotos",
        "Estrategia y desarrollo de negocio",
        "Coordinación del equipo y partners",
      ],
    },
    {
      name: "Jose Ramón Cobián Fernández",
      role: "CTO – NauticOps",
      tags: "Mathematics · Computer Science · Data & Systems Engineering",
      shortBio:
        "CTO de NauticOps con sólida base en matemáticas, ciencia de la computación y análisis de datos. Responsable de convertir los requisitos operativos del puerto en una plataforma técnica robusta y escalable.",
      fullBio: [
        "Jose Ramón aporta a NauticOps un perfil técnico con fuerte base analítica y experiencia en entornos de datos, investigación cuantitativa y desarrollo de sistemas en sectores exigentes como energía, banca y consultoría tecnológica.",
        "En NauticOps lidera el diseño y desarrollo técnico del producto, asegurando que la plataforma sea fiable, estructurada y preparada para crecer, manteniendo siempre un enfoque práctico orientado a la operativa real.",
      ],
      responsibilities: [
        "Arquitectura técnica y diseño del sistema",
        "Desarrollo backend y lógica de datos",
        "Modelado de información y métricas operativas",
        "Integraciones y escalabilidad",
        "Soporte técnico en pilotos y validaciones",
      ],
    },
  ],
};
