import React from 'react';
import { Button as DSButton } from '@regal/design-system';

export const Button = React.forwardRef(({ children, type = 'button', variant = 'primary', size = 'md', disabled = false, className = '', onClick, ...props }, ref) => {
  
  // Mapping des variants legacy vers le Design System
  let dsVariant = variant;
  if (variant === 'success') dsVariant = 'primary'; // Le DS n'a pas de success, on utilise primary (bordeaux)
  if (variant === 'purple') dsVariant = 'primary';
  if (variant === 'danger') dsVariant = 'primary'; // TODO: Ajouter variant danger au DS si besoin
  if (variant === 'secondary') dsVariant = 'outline'; // L'ancien secondary était blanc avec bordure -> outline
  if (variant === 'ghost') dsVariant = 'ghost';

  // Mapping des tailles
  // DS: sm (xs text), md (sm text), lg (base text)
  // Legacy: sm (sm text), md (sm text), lg (base text)
  // On garde tel quel car assez proche

  return (
    <div ref={ref} className="inline-block">
       <DSButton
        type={type}
        variant={dsVariant}
        size={size}
        disabled={disabled}
        onClick={onClick}
        className={className}
        {...props}
      >
        {children}
      </DSButton>
    </div>
  );
});

Button.displayName = 'Button';



