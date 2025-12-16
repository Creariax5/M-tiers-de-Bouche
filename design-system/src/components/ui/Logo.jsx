import { designConfig } from '../../config/designConfig';

/**
 * Logo - Composant centralisé pour afficher le logo RÉGAL
 * 
 * Le logo principal contient déjà le texte "REGAL"
 * Utiliser variant="secondary" pour le logo RG compact
 * 
 * Usage:
 *   <Logo />                    → Logo principal (REGAL complet)
 *   <Logo variant="secondary" /> → Logo compact (RG)
 *   <Logo size="sm" />           → Taille réduite
 */
export default function Logo({ 
  size = 'md', 
  variant = 'main',
  className = ''
}) {
  const sizes = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  };

  // Get logo URL based on variant, fallback to main
  const logoUrl = designConfig.brand.logo[variant] || designConfig.brand.logo.main;

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoUrl} 
        alt={designConfig.brand.logoAlt}
        className={`${sizes[size]} w-auto object-contain`}
      />
    </div>
  );
}
