import { isValidPassword } from '../utils/validation';

describe('isValidPassword', () => {
  it('should return true for valid passwords', () => {
    expect(isValidPassword('Password123')).toBeTruthy();
    expect(isValidPassword('Another1ValidPassword')).toBeTruthy();
  });

  it('should return false for passwords without numbers', () => {
    expect(isValidPassword('Password')).toBeFalsy();
  });

  it('should return false for passwords without letters', () => {
    expect(isValidPassword('12345678')).toBeFalsy();
  });

  it('should return false for passwords shorter than 8 characters', () => {
    expect(isValidPassword('Pass1')).toBeFalsy();
  });

  it('should return false for empty passwords', () => {
    expect(isValidPassword('')).toBeFalsy();
  });
});
