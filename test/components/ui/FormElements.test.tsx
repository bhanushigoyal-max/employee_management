import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input, Textarea, Select, CheckboxRadioGroup } from '../../../src/components/ui/FormElements';

describe('FormElements', () => {
  const mockRegister = jest.fn((name) => ({ name, onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() }));

  it('renders Input component correctly', () => {
    render(<Input label="Test Input" name="testInput" register={mockRegister} required />);
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('renders Textarea component correctly', () => {
    render(<Textarea label="Test Textarea" name="testTextarea" register={mockRegister} />);
    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
  });

  it('renders Select component correctly', () => {
    const options = [{ value: '1', label: 'Option 1' }];
    render(<Select label="Test Select" name="testSelect" register={mockRegister} options={options} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('renders CheckboxRadioGroup correctly', () => {
    const options = [{ value: 'male', label: 'Male' }];
    render(<CheckboxRadioGroup label="Gender" name="gender" type="radio" register={mockRegister} options={options} />);
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
  });
});
