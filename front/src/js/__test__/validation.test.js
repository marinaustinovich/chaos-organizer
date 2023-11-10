import { isValidPassword, isValidTimeFormat } from '../utils/validation';

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

describe('isValidTimeFormat', () => {
  test('returns true for valid time format', () => {
    expect(isValidTimeFormat('10.11.2023 22:30')).toBe(true);
  });

  test('returns false for invalid time format - wrong separator', () => {
    expect(isValidTimeFormat('10-11-2023 22:30')).toBe(false);
  });

  test('returns false for invalid time format - missing time', () => {
    expect(isValidTimeFormat('10.11.2023')).toBe(false);
  });

  test('returns false for invalid time format - extra characters', () => {
    expect(isValidTimeFormat('10.11.2023 22:30:00')).toBe(false);
  });

  test('returns false for invalid time format - letters instead of numbers', () => {
    expect(isValidTimeFormat('ab.cd.efgh ij:kl')).toBe(false);
  });
});
