import Button from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Button Primary',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Button Secondary',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Button Outline',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Button Ghost',
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    children: 'Button Danger',
  },
};

export const Small = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};
