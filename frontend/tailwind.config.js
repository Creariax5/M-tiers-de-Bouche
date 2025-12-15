import { designConfig } from '@regal/design-system/src/config/designConfig.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@regal/design-system/dist/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'night-bordeaux': designConfig.colors.primary.DEFAULT,
        'stone-brown': designConfig.colors.secondary.DEFAULT,
        'dusty-taupe': designConfig.colors.accent.DEFAULT,
        'white-smoke': designConfig.colors.neutral.smoke,
        'black': designConfig.colors.neutral.black,
        
        // Alias plus intuitifs
        'primary': designConfig.colors.primary,
        'secondary': designConfig.colors.secondary,
        'accent': designConfig.colors.accent,
        'neutral': designConfig.colors.neutral,
        'success': designConfig.colors.system.success,
        'warning': designConfig.colors.system.warning,
        'error': designConfig.colors.system.error,
        'info': designConfig.colors.system.info,
      },
      fontFamily: {
        'primary': [designConfig.fonts.primary.name, 'serif'],
        'secondary': [designConfig.fonts.secondary.name, 'sans-serif'],
      },
      spacing: designConfig.spacing,
      borderRadius: designConfig.borders.radius,
      boxShadow: designConfig.shadows,
      transitionDuration: designConfig.animations.duration,
      transitionTimingFunction: designConfig.animations.easing,
    },
  },
  plugins: [],
}
