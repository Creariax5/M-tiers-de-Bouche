import { designConfig } from '../../config/designConfig';

/**
 * Logo - Composant centralisé pour afficher le logo
 * 
 * Usage:
 *   <Logo />
 *   <Logo size="sm" variant="white" />
 *   <Logo className="custom-class" />
 */
export default function Logo({ 
  size = 'md', 
  variant = 'main',
  className = '',
  showText = false 
}) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  // Get logo URL based on variant, fallback to main
  const logoUrl = designConfig.brand.logo[variant] || designConfig.brand.logo.main;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <img 
        src={logoUrl} 
        alt={designConfig.brand.logoAlt}
        className={`${sizes[size]} w-auto object-contain`}
      />
      
      {/* Texte du logo (optionnel car souvent inclus dans le SVG) */}
      {showText && (
        <span className={`${textSizes[size]} font-primary font-bold text-primary`}>
          {designConfig.brand.name}
        </span>
      )}
    </div>
  );
}
