export type LegalTranslations = {
  legal: {
    backToHome: string;
    privacy: {
      title: string;
      content: string[];
      contact: string;
    };
    terms: {
      title: string;
      content: string[];
    };
    security: {
      title: string;
      content: string[];
    };
  };
};

export const legalEn: LegalTranslations["legal"] = {
  backToHome: "← Back to home",
  privacy: {
    title: "Privacy Policy",
    content: [
      "NauticOps is committed to protecting user privacy.",
      "Personal data collected through contact or demo request forms is used solely to respond to enquiries related to the product.",
      "Data will not be shared with third parties or used for unsolicited commercial purposes.",
      "For any privacy-related questions:",
    ],
    contact: "info@nauticops.com",
  },
  terms: {
    title: "Terms of Service",
    content: [
      "Access to this website does not imply the purchase of any service.",
      "NauticOps is currently in MVP and validation stage. The information presented is for informational purposes and may change.",
      "Use of this website implies acceptance of these terms.",
    ],
  },
  security: {
    title: "Security",
    content: [
      "NauticOps applies technical and organizational measures to protect information and data shared through the platform.",
      "Security and reliability are core principles in the platform design, especially in port and operational environments.",
    ],
  },
};

export const legalEs: LegalTranslations["legal"] = {
  backToHome: "← Volver al inicio",
  privacy: {
    title: "Política de Privacidad",
    content: [
      "NauticOps se compromete a proteger la privacidad de los usuarios de esta web.",
      "Los datos personales recogidos a través de los formularios de contacto o solicitud de demo se utilizan únicamente para responder a las solicitudes recibidas y mantener comunicaciones relacionadas con el producto.",
      "No se cederán datos a terceros ni se utilizarán con fines comerciales no solicitados.",
      "Para cualquier consulta relacionada con la privacidad de los datos, puede contactar en:",
    ],
    contact: "info@nauticops.com",
  },
  terms: {
    title: "Términos de Servicio",
    content: [
      "El acceso a esta web no implica la contratación de ningún servicio.",
      "NauticOps se encuentra en fase de desarrollo y validación (MVP). La información presentada tiene carácter informativo y puede cambiar.",
      "El uso de esta web implica la aceptación de estos términos.",
    ],
  },
  security: {
    title: "Seguridad",
    content: [
      "NauticOps aplica medidas técnicas y organizativas orientadas a proteger la información y los datos compartidos a través de la plataforma.",
      "La seguridad y la fiabilidad son principios clave en el diseño del producto, especialmente en entornos portuarios y operativos.",
    ],
  },
};
