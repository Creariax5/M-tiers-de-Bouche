import '../src/index.css'; 

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F9FAFB',
        },
        {
          name: 'dark',
          value: '#1F2937',
        },
        {
          name: 'regal-bg',
          value: '#EAE9E8', // White Smoke from brand
        },
      ],
    },
  },
};

export default preview;
