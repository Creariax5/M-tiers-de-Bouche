import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';
import React from 'react';

describe('Input', () => {
  test('rend un input avec le type par défaut text', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('accepte un type personnalisé', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('accepte une ref via forwardRef', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('applique la classe error quand error=true', () => {
    render(<Input error={true} data-testid="input-error" />);
    const input = screen.getByTestId('input-error');
    expect(input.className).toContain('border-red-500');
  });

  test('applique la classe normale quand error=false', () => {
    render(<Input error={false} data-testid="input-normal" />);
    const input = screen.getByTestId('input-normal');
    expect(input.className).toContain('border-gray-300');
  });

  test('passe les props additionnelles', () => {
    render(<Input placeholder="Test placeholder" data-testid="input-props" />);
    const input = screen.getByTestId('input-props');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
  });

  test('applique les classes personnalisées', () => {
    render(<Input className="custom-class" data-testid="input-custom" />);
    const input = screen.getByTestId('input-custom');
    expect(input.className).toContain('custom-class');
  });
});
