# REGAL Design System

This directory contains the **official implementation** of the REGAL Design System.
It serves as the single source of truth for:

- **Design Tokens**: Colors, Typography, Spacing (defined in `src/config/designConfig.js`)
- **UI Components**: Reusable React components (Buttons, Cards, Inputs, Badges, etc.)
- **Brand Assets**: Logos and iconography.

## Structure

- `src/config/`: Central configuration file (`designConfig.js`).
- `src/components/ui/`: Core UI components.
- `src/pages/fundamentals/`: Documentation for brand, colors, and typography.
- `src/pages/components/`: Interactive documentation for UI components.

## Usage

This project is a reference implementation. To use these components in the main application:
1. Copy `src/config/designConfig.js` to the target project.
2. Configure Tailwind to use the tokens from the config.
3. Import the UI components from `src/components/ui`.
