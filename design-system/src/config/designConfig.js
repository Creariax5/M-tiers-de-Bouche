/**
 * Design System Configuration
 * 
 * Fichier central pour toutes les variables de design
 * Un seul endroit pour changer : polices, couleurs, logo, espacements
 */

export const designConfig = {
  // ========================================
  // IDENTITÉ DE MARQUE
  // ========================================
  brand: {
    name: "RÉGAL",
    logo: {
      main: "/logos/principal-couleur.svg",
      white: "/logos/principal-blanc.svg",
      black: "/logos/principal-noir.svg",
      secondary: "/logos/secondaire-couleur.svg",
      secondaryWhite: "/logos/secondaire-blanc.svg",
      secondaryBlack: "/logos/secondaire-noir.svg",
      tertiary: "/logos/tertiaire-couleur.svg",
      tertiaryWhite: "/logos/tertiaire-blanc.svg",
      tertiaryBlack: "/logos/tertiaire-noir.svg",
      monoWhite: "/logos/mono-blanc.svg",
      monoBlack: "/logos/mono-noir.svg",
    },
    logoAlt: "Logo RÉGAL",
    favicon: "/favicon.ico",
  },

  // ========================================
  // TYPOGRAPHIE
  // ========================================
  fonts: {
    // Police principale (titres, headers)
    primary: {
      name: "Libre Baskerville",
      family: '"Libre Baskerville", serif',
      weights: [400, 700],
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
    },
    
    // Police secondaire (corps de texte, UI)
    secondary: {
      name: "Raleway",
      family: '"Raleway", sans-serif',
      weights: [300, 400, 500, 600, 700],
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
    },
  },

  // ========================================
  // PALETTE DE COULEURS
  // ========================================
  colors: {
    // Couleurs principales
    primary: {
      DEFAULT: "#49111C",  // night-bordeaux
      light: "#6B1A28",
      dark: "#2A0A11",
      rgb: "73, 17, 28",
    },
    
    secondary: {
      DEFAULT: "#5D4D3D",  // stone-brown
      light: "#7A6757",
      dark: "#3D332A",
      rgb: "93, 77, 61",
    },
    
    accent: {
      DEFAULT: "#A48C78",  // dusty-taupe
      light: "#B9A593",
      dark: "#8B7562",
      rgb: "164, 140, 120",
    },
    
    // Couleurs neutres
    neutral: {
      white: "#FFFFFF",
      smoke: "#EAE9E8",
      light: "#F5F5F4",
      medium: "#D4D4D4",
      dark: "#737373",
      black: "#0D0909",
    },
    
    // Couleurs système
    system: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },

  // ========================================
  // ESPACEMENTS & TAILLES
  // ========================================
  spacing: {
    xs: "0.5rem",   // 8px
    sm: "1rem",     // 16px
    md: "1.5rem",   // 24px
    lg: "2rem",     // 32px
    xl: "3rem",     // 48px
    "2xl": "4rem",  // 64px
  },

  // ========================================
  // BORDURES & OMBRES
  // ========================================
  borders: {
    radius: {
      sm: "0.25rem",  // 4px
      md: "0.5rem",   // 8px
      lg: "1rem",     // 16px
      full: "9999px",
    },
    width: {
      thin: "1px",
      medium: "2px",
      thick: "4px",
    },
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // ========================================
  // TRANSITIONS & ANIMATIONS
  // ========================================
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // ========================================
  // BREAKPOINTS (Responsive)
  // ========================================
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

export default designConfig;
