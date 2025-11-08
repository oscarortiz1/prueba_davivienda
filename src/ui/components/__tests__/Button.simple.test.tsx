import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component - Basic Tests', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render with custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have button type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('should render with ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });
});
