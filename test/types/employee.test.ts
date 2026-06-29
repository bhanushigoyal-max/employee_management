import { EmployeeSchema } from '../../src/types/employee';

describe('EmployeeSchema', () => {
  it('should validate a correct employee object', () => {
    const validEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      department: 'Development',
      skills: ['React', 'Node'],
      country: 'USA',
      state: 'CA',
      city: 'San Francisco',
      address: '123 Main Street Suite 100',
      profileImage: 'http://example.com/image.png',
      resume: 'http://example.com/resume.pdf',
      preferredMode: ['Remote', 'Office']
    };
    
    const result = EmployeeSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
  });

  it('should reject invalid first name with numbers', () => {
    const invalidEmployee = {
      firstName: 'John123', 
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      department: 'Development',
      skills: ['React'],
      country: 'USA',
      state: 'CA',
      city: 'SF',
      address: '123 Main St 100',
      profileImage: 'test',
      resume: 'test',
      preferredMode: ['Remote']
    };
    const result = EmployeeSchema.safeParse(invalidEmployee);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message === "Numbers are not allowed in first name")).toBe(true);
    }
  });

  it('should reject underage employee', () => {
    const youngDate = new Date();
    youngDate.setFullYear(youngDate.getFullYear() - 17);
    
    const invalidEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '1234567890',
      dateOfBirth: youngDate.toISOString(),
      gender: 'Male',
      department: 'Development',
      skills: ['React'],
      country: 'USA',
      state: 'CA',
      city: 'SF',
      address: '123 Main St 100',
      profileImage: 'test',
      resume: 'test',
      preferredMode: ['Remote']
    };
    const result = EmployeeSchema.safeParse(invalidEmployee);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message === "Employee must be at least 18 years old")).toBe(true);
    }
  });

  it('should reject invalid mobile number', () => {
    const invalidEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '12345',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      department: 'Development',
      skills: ['React'],
      country: 'USA',
      state: 'CA',
      city: 'SF',
      address: '123 Main St 100',
      profileImage: 'test',
      resume: 'test',
      preferredMode: ['Remote']
    };
    const result = EmployeeSchema.safeParse(invalidEmployee);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message === "Mobile number must be exactly 10 digits")).toBe(true);
    }
  });
});
